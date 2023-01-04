import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsService } from './events/events.service';
import { EventsController } from './events/events.controller';
import { EventSetService } from './event-set/event-set.service';
import { EventSetController } from './event-set/event-set.controller';
import { Event, EventSchema } from './schema/adaptionEvent.schema';
import { ClusterMetric, ClusterMetricSchema } from './schema/clusterMetric.schema';
import { Hpa, HpaSchema } from './schema/hpa.schema';
import { Set, SetSchema } from './event-set/schema/set.schema';
import { DerivativeService } from './derivative/derivative.service';
import { HttpModule } from '@nestjs/axios';
import { DerivativeController } from './derivative/derivative.controller';
import { HpaController } from './hpa/hpa.controller';
import { HpaService } from './hpa/hpa.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ScalingConditionsController } from './scaling-conditions/scaling-conditions.controller';
import { ScalingCondition, ScalingConditionSchema } from './schema/scalingConditions.schema';
import { ScalingConditionsService } from './scaling-conditions/scaling-conditions.service';
import { PodMetricsController } from './pod-metrics/pod-metrics.controller';
import { PodMetricsService } from './pod-metrics/pod-metrics.service';
import { PrometheusMetricsService } from './prometheus-metrics/prometheus-metrics.service';
import { PrometheusMetricsController } from './prometheus-metrics/prometheus-metrics.controller';
import { PrometheusMetric, PrometheusMetricSchema } from './schema/prometheusMetric.schema';
import { ClusterMetricsController } from './cluster-metrics/cluster-metrics.controller';
import { ClusterMetricsService } from './cluster-metrics/cluster-metrics.service';
import { DeploymentInformationService } from './deployment-information/deployment-information.service';
import { DeploymentInformationController } from './deployment-information/deployment-information.controller';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot('mongodb://mongo-mongodb.default.svc.cluster.local:27017/events'),
    MongooseModule.forFeature([
      {
        name: Event.name,
        schema: EventSchema
      },
      {
        name: Set.name,
        schema: SetSchema
      },
      {
        name: ClusterMetric.name,
        schema: ClusterMetricSchema
      },
      {
        name: Hpa.name,
        schema: HpaSchema
      },
      {
        name: ScalingCondition.name,
        schema: ScalingConditionSchema
      },
      {
        name: PrometheusMetric.name,
        schema: PrometheusMetricSchema
      }
    ]), HttpModule
  ],
  controllers: [AppController, EventsController, EventSetController, DerivativeController, ClusterMetricsController, HpaController, ScalingConditionsController, PodMetricsController, PrometheusMetricsController, DeploymentInformationController],
  providers: [AppService, EventsService, EventSetService, DerivativeService, ClusterMetricsService, HpaService, ScalingConditionsService, PodMetricsService, PrometheusMetricsService, DeploymentInformationService],
})
export class AppModule { }
//'mongodb://mongo-mongodb.default.svc.cluster.local:27017/events,'