import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { Hpa, HpaDocument } from 'src/schema/hpa.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PrometheusMetric, PrometheusMetricDocument } from 'src/schema/prometheusMetric.schema';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class PrometheusMetricsService {
    constructor(@InjectModel(PrometheusMetric.name) private promModel: Model<PrometheusMetricDocument>, 
                @InjectModel(Hpa.name) private hpaModel: Model<HpaDocument>, 
                private httpService: HttpService) {
        this.saveHpaMetricQueries();
    }

    // TODO: export into kubernetes configmap
    static prometheusUrl = 'http://prometheus-kube-prometheus-prometheus:9090';

    /**
     * Returns all prometheus metrics from the database
     * @returns
     */
    async getAllPrometheusMetrics(): Promise<any> {
        return this.promModel.find().exec();
    }

    /**
     * Retrieves specific metrics from prometheus
     * @param query
     * @returns
     */
    async queryPrometheus(query: string): Promise<any> {
        var result;
        try {
            result = await lastValueFrom(this.httpService.get(PrometheusMetricsService.prometheusUrl + query).pipe(
                map(response => response.data)
            ));
        } catch (error) {
            console.log(error)
        }
        return result.data.result;
    }

    /**
     * Regularly (every 1 min) queries the hpa database and prometheus for current used metrics + value and saves them to the database
     * 
     * @returns
     */
    @Interval(60000)
    async saveHpaMetricQueries(): Promise<any> {
        await this.hpaModel.find().exec().then((result) => {
            result.map((hpa) => {
                hpa.currentMetrics.map(async (metric) => {
                    // slice(0,-2) removes the last two characters of the string (e.g. '\n')
                    var prometheusQuery = metric.query.slice(0, -2)
                    var metricValue = await this.queryPrometheus(prometheusQuery);
                    this.saveToDatabase(metric.metricName, prometheusQuery, metricValue);
                })
            }
        )});    
    }

    /**
     * Saves prometheus metrics to the database
     * @param metricName
     * @param query
     * @param value
     * @returns
     */ 
    async saveToDatabase(metricName: string, query: string, value: string): Promise<any> {
        const prometheusMetric = new this.promModel();
        prometheusMetric.queriedAt = new Date().toISOString();
        prometheusMetric.metricName = metricName;
        prometheusMetric.query = query;
        prometheusMetric.value = value;
        prometheusMetric.save();
    }
    
    /**
     * Queries Prometheus for the value of a specific metric wihthin a specific time range with a specific resolution
     * 
     * @param query 
     * @param start unix timestamp
     * @param end unix timestamp
     * @param step query resolution
     * @returns 
     */
     async queryPrometheusTimeRange(query: string, start: string, end: string, step: string): Promise<any> {

        //Verify start and end are unix timestamps
        var valid = (new Date(start)).getTime() > 0 && (new Date(end)).getTime() > 0;
        if (!valid) {
            throw new Error("Start and end must be unix timestamps");
        }

        var result;
        try {
            result = await lastValueFrom(this.httpService.get(PrometheusMetricsService.prometheusUrl + query + '&start=' + start + '&end=' + end + '&step=' + step).pipe(
                map(response => response.data)
            ));
        } catch (error) {
            console.log(error)
        }
        return result.data.result;
     }

}
