import { ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ClusterMetric,
  ClusterMetricDocument,
} from 'src/schema/clusterMetric.schema';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { Interval } from '@nestjs/schedule';

/**
 * Service for retrieving and storing cluster metrics.
 * Retrieves metrics from prometheus and stores them in the database every 5min
 */
@Injectable()
export class ClusterMetricsService {
  constructor(
    @InjectModel(ClusterMetric.name)
    private clusterMetricsModel: Model<ClusterMetricDocument>,
    private httpService: HttpService,
  ) {
    this.retrieveMetrics();
  }

  /**
   * Returns all cluster metrics from the database
   *
   * @returns
   */
  async getAllClusterMetrics(): Promise<any> {
    return this.clusterMetricsModel.find().exec();
  }

  /**
   * Returns the cluster metric with the given id
   * @param id
   * @returns
   */
  async getClusterMetricById(id: string): Promise<any> {
    return this.clusterMetricsModel.findById(id).exec();
  }

  /**
   * Returns the cluster metrics in between the given timestamps
   * @param from
   * @param to
   * @returns
   */
  async getClusterMetricsBetween(from: string, to: string): Promise<any> {
    const result = await this.clusterMetricsModel
      .find({ timestamp: { $gte: new Date(from), $lte: new Date(to) } })
      .exec();
    return result;
  }

  /**
   * Regularly (every 5min) retrieves cluster metrics
   */
  @Interval(300000)
  async retrieveMetrics() {
    const clusterMetrics = new this.clusterMetricsModel();
    clusterMetrics.id = new Types.ObjectId();
    clusterMetrics.createdAt = new Date().toISOString();
    clusterMetrics.cpu = await this.getClusterCPUUsage();
    clusterMetrics.memory = await this.getClusterMemoryUsage();
    clusterMetrics.podCount = await this.getClusterPodCount();
    clusterMetrics.save();
  }

  /**
   * Retrieves the cluster cpu usage from prometheus
   * @returns
   */
  async getClusterCPUUsage(): Promise<any> {
    const query = 'sum(irate(container_cpu_usage_seconds_total[1m]))';
    const apiGateway = '/api/v1/query?query=';
    const prometheusQuery = apiGateway + query;

    const result = await this.queryPrometheus({ query: prometheusQuery });

    //TODO: Check if this is indeed the last query result
    const cpuUsage = result.pop().value[1];
    return cpuUsage;
  }

  /**
   * Retrieves the cluster memory usage from prometheus
   * @returns
   */
  async getClusterMemoryUsage(): Promise<any> {
    const query = 'sum(container_memory_usage_bytes)';
    const apiGateway = '/api/v1/query?query=';
    const prometheusQuery = apiGateway + query;
    const result = await this.queryPrometheus({ query: prometheusQuery });
    const memoryUsage = result.pop().value[1];
    return memoryUsage;
  }

  /**
   * Retrieves the cluster pod count from prometheus
   * @returns
   */
  async getClusterPodCount(): Promise<any> {
    const query = 'count(kube_pod_info)';
    const apiGateway = '/api/v1/query?query=';
    const prometheusQuery = apiGateway + query;
    const result = await this.queryPrometheus({ query: prometheusQuery });
    const podCount = result.pop().value[1];
    return podCount;
  }

  /**
   * Queries prometheus with the given query
   * @param query
   * @returns
   */
  async queryPrometheus({ query }: { query: string }): Promise<Array<any>> {
    const prometheusUrl =
      process.env.PROMETHEUS_URL ||
      'http://prometheus-kube-prometheus-prometheus:9090';
    let result;
    try {
      result = await lastValueFrom(
        this.httpService
          .get(prometheusUrl + query)
          .pipe(map((response) => response.data)),
      );
    } catch (error) {
      console.log(error);
    }
    return result.data.result;
  }
}
