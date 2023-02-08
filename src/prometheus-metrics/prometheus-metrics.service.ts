import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { Hpa, HpaDocument } from 'src/schema/hpa.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  PrometheusMetric,
  PrometheusMetricDocument,
} from 'src/schema/prometheusMetric.schema';
import { Interval } from '@nestjs/schedule';

/**
 * Service for querying prometheus metrics from the prometheus API
 */
@Injectable()
export class PrometheusMetricsService {
  constructor(
    @InjectModel(PrometheusMetric.name)
    private promModel: Model<PrometheusMetricDocument>,
    @InjectModel(Hpa.name) private hpaModel: Model<HpaDocument>,
    private httpService: HttpService,
  ) {
    this.updateHpaMetricQueries();
  }

  /**
   * Checks if requested query is used within a hpa scaling rule
   *
   * @param query
   * @returns
   */
  async isHpaMetricQuery(query: string): Promise<boolean> {
    const hpaMetricQueries = await this.getHpaMetricQueries();
    return hpaMetricQueries.includes(query);
  }

  /**
   * Queries the hpa database for current used metrics
   *
   * @returns
   */
  async getHpaMetricQueries(): Promise<any> {
    const uniqueQueries = [...new Set()];
    await this.hpaModel
      .find()
      .exec()
      .then((result) => {
        result.map((hpa) => {
          hpa.currentMetrics.map((metric) => {
            uniqueQueries.push(metric.query);
          });
        });
      });
    return uniqueQueries;
  }

  /**
   * Queries the hpa database for current used metrics and returns query and metric name
   *
   * @returns
   */
  async getHpaMetricQueriesAndNames(): Promise<any> {
    const uniqueQueries = [...new Set()];
    await this.hpaModel
      .find()
      .exec()
      .then((result) => {
        result.map((hpa) => {
          hpa.currentMetrics.map((metric) => {
            uniqueQueries.push({
              query: metric.query,
              metricName: metric.metricName,
            });
          });
        });
      });
    return uniqueQueries;
  }

  /**
   * Queries the prom database for the values of a metric used in a hpa scaling rule within a specific time range
   *
   * @param query
   * @param start unix timestamp
   * @param end unix timestamp
   * @returns
   */
  async getHpaMetricQueryValues(
    query: string,
    start: string,
    end: string,
  ): Promise<any> {
    query = await this.verifyUsedHpaRule(query);
    const startUnix = new Date(start).toISOString();
    const endUnix = new Date(end).toISOString();
    const result = this.promModel
      .find({ query: query, queriedAt: { $gte: startUnix, $lte: endUnix } })
      .exec()
      .then((result) => {
        return result;
      });
    return result;
  }

  /**
   * Regularly (every 30sec) checks the hpa configurations in the cluster and saves the used metrics in the database
   */
  @Interval(30000)
  async updateHpaMetricQueries() {
    const hpaMetricQueries = await this.getHpaMetricQueriesAndNames();

    for (const metricQuery of hpaMetricQueries) {
      this.queryPrometheus(metricQuery.query).then((result) => {
        const newMetric = new this.promModel({
          _id: new Types.ObjectId(),
          queriedAt: new Date().toISOString(),
          metricName: metricQuery.metricName,
          query: metricQuery.query,
          value: result[1],
        });
        newMetric.save();
      });
    }
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
  async queryPrometheusTimeRange(
    query: string,
    start: string,
    end: string,
    step: string,
  ): Promise<any> {
    //Verify start and end are unix timestamps
    const valid = new Date(start).getTime() > 0 && new Date(end).getTime() > 0;
    if (!valid) {
      throw new Error('Start and end must be unix timestamps');
    }

    query = await this.verifyUsedHpaRule(query);

    let result;
    const startUnix = new Date(start).getTime() / 1000;
    const endUnix = new Date(end).getTime() / 1000;
    try {
      const prometheusUrl =
        process.env.PROMETHEUS_URL ||
        'http://prometheus-kube-prometheus-prometheus:9090';
      // TODO: use format string
      const url =
        prometheusUrl +
        '/api/v1/query_range?query=' +
        query +
        '&start=' +
        startUnix +
        '&end=' +
        endUnix +
        '&step=' +
        step;
      result = await lastValueFrom(
        this.httpService.get(url).pipe(map((response) => response.data)),
      );
    } catch (error) {
      console.log(error);
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
    const valid = new Date(time).getTime() > 0;
    if (!valid) {
      throw new Error('Time must be unix timestamp');
    }
    query = await this.verifyUsedHpaRule(query);

    let result;
    const timeUnix = new Date(time).getTime() / 1000;
    try {
      const prometheusUrl =
        process.env.PROMETHEUS_URL ||
        'http://prometheus-kube-prometheus-prometheus:9090';
      const url =
        prometheusUrl + '/api/v1/query?query=' + query + '&time=' + timeUnix;
      result = await lastValueFrom(
        this.httpService.get(url).pipe(map((response) => response.data)),
      );
    } catch (error) {
      console.log(error);
    }
    return result.data.result.pop().value;
  }

  /**
   * Queries Prometheus for the value of a metric used in a hpa scaling rule at the current time
   * @param query
   * @returns
   */
  async queryPrometheus(query: string): Promise<any> {
    query = await this.verifyUsedHpaRule(query);
    let result;
    try {
      const prometheusUrl =
        process.env.PROMETHEUS_URL ||
        'http://prometheus-kube-prometheus-prometheus:9090';
      const url = prometheusUrl + '/api/v1/query?query=' + query;
      result = await lastValueFrom(
        this.httpService.get(url).pipe(map((response) => response.data)),
      );
    } catch (error) {
      console.log(error);
    }

    if (result.data.result.length == 0) {
      return [0, 0];
    }

    return result.data.result.pop().value;
  }

  /**
   * Verify query is used within a hpa scaling rule
   *
   * @param query
   * @returns
   */
  private async verifyUsedHpaRule(query: string) {
    query = query.replace(/\\/g, '');
    const isHpaMetricQuery = await this.isHpaMetricQuery(query);
    if (!isHpaMetricQuery) {
      throw new Error('Query is not used within an hpa scaling rule');
    }
    return query;
  }
}
