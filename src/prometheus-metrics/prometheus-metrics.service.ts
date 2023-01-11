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
    }

    /**
     * Checks if requested query is used within a hpa scaling rule
     * 
     * @param query
     * @returns
     */
    async isHpaMetricQuery(query: string): Promise<boolean> {
        let hpaMetricQueries = await this.getHpaMetricQueries();
        return hpaMetricQueries.includes(query);
    }

    /**
     * Queries the hpa database for current used metrics 
     * 
     * @returns
     */
    async getHpaMetricQueries(): Promise<any> {
        let uniqueQueries = [...new Set()];
        await this.hpaModel.find().exec().then((result) => {
            result.map((hpa) => {
                hpa.currentMetrics.map((metric) => {
                    uniqueQueries.push(metric.query);
                })
            }
        )});    
        return uniqueQueries;
    }


    /**
     * Queries Prometheus for the value of a metric used in a hpa scaling rule within a specific time range with a specific resolution
     * 
     * @param query 
     * @param start unix timestamp
     * @param end unix timestamp
     * @param step query resolution
     * @returns 
     */
     async queryPrometheusTimeRange(query: string, start: string, end: string, step: string): Promise<any> {

        //Verify start and end are unix timestamps
        let valid = (new Date(start)).getTime() > 0 && (new Date(end)).getTime() > 0;
        if (!valid) {
            throw new Error("Start and end must be unix timestamps");
        }

        //Verify query is used within a hpa scaling rule
        query = query.replace(/\\/g, "");
        let isHpaMetricQuery = await this.isHpaMetricQuery(query);
        if (!isHpaMetricQuery) {
            throw new Error("Query is not used within an hpa scaling rule");
        }

        let result;
        let startUnix = new Date(start).getTime() / 1000;
        let endUnix = new Date(end).getTime() / 1000;
        try {
            const prometheusUrl = process.env.PROMETHEUS_URL || 'http://prometheus-kube-prometheus-prometheus:9090';
            // TODO: use format string
            const url = prometheusUrl + '/api/v1/query_range?query=' + query + '&start=' + startUnix + '&end=' + endUnix + '&step=' + step;
            result = await lastValueFrom(this.httpService.get(url).pipe(
                map(response => response.data)
            ));
        } catch (error) {
            console.log(error)
        }
        return result.data.result.pop().values;
     }


    /**
     * Queries Prometheus for the value of a metric used in a hpa scaling rule at a specific time
     * 
     * @param query
     * @param time unix timestamp
     * @returns
     */
    async queryPrometheusTime(query: string, time: string): Promise<any> {
            
        //Verify time is unix timestamp
        let valid = (new Date(time)).getTime() > 0;
        if (!valid) {
            throw new Error("Time must be unix timestamp");
        }

        //Verify query is used within a hpa scaling rule
        query = query.replace(/\\/g, "");
        let isHpaMetricQuery = await this.isHpaMetricQuery(query);
        if (!isHpaMetricQuery) {
            throw new Error("Query is not used within an hpa scaling rule");
        }

        let result;
        let timeUnix = new Date(time).getTime() / 1000;
        try {
            const prometheusUrl = process.env.PROMETHEUS_URL || 'http://prometheus-kube-prometheus-prometheus:9090';
            const url = prometheusUrl + '/api/v1/query?query=' + query + '&time=' + timeUnix;
            result = await lastValueFrom(this.httpService.get(url).pipe(
                map(response => response.data)
            ));
        } catch (error) {
            console.log(error)
        }
        return result.data.result.pop().value;
    }

}
