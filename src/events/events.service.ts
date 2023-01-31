import { ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventDto } from 'src/dto/event.dto';
import { EventSetService } from 'src/event-set/event-set.service';
import { Event, EventDocument } from 'src/schema/adaptionEvent.schema';
import * as k8s from '@kubernetes/client-node';
import { PrometheusMetricsService } from 'src/prometheus-metrics/prometheus-metrics.service';
import { HpaService } from 'src/hpa/hpa.service';
import { PodMetricsService } from 'src/pod-metrics/pod-metrics.service';
import { DeploymentInformationService } from 'src/deployment-information/deployment-information.service';

/**
 * Service for receiving and storing adaption events.
 * Receives events from the controller and stores them in the database
 */
@Injectable()
export class EventsService {
    private kubernetesConfig = new k8s.KubeConfig();

    constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>, 
                private eventSetService: EventSetService, 
                private prometheusService: PrometheusMetricsService, 
                private hpaService: HpaService,
                private podMetricsService: PodMetricsService,
                private deploymentInformationService: DeploymentInformationService) { 
        this.kubernetesConfig.loadFromDefault();
    }

    /**
     * This function is called when a event is received by the controller. It converts the incoming event to a better format 
     * and checks if the events is related.
     * 
     * @param eventDto 
     */
    async receiveNewAdaptionEvent(eventDto: EventDto) {
        let isRelated: boolean;
        const event = new this.eventModel();
        
        console.log(eventDto);
        
        if (eventDto.details == null)
            return;

        if (eventDto.details.reason === 'SuccessfulRescale') {
            event._id = new Types.ObjectId();
            event.createdAt = new Date().toISOString();
            event.name = eventDto.details.name;
            event.namespace = eventDto.details.namespace;
            event.reason = eventDto.details.reason;
            event.message = eventDto.details.message;
            event.scalingType = this.extractScalingType(event);
            event.replicaSize = this.extractReplicaSize(event);
            event.metricType = this.extractMetricType(event);

            if (event.scalingType == "scaleOut") {
                event.metricValue.push(await this.getMetricValue(event.name, event.namespace, event.metricType));
            } else {
                event.metricValue = await this.getAllMetricValues(event.name, event.namespace);
            }

            const latestEvent = await this.getLatestEvent(event.name, event.namespace);
            if(latestEvent !== null) {
                event.oldReplicaSetId= latestEvent._id;
                console.log('oldReplicaSetId: ' + latestEvent._id);
            }

            await this.isRelated(event).then(function (v) { isRelated = v })
            if (isRelated) {
                console.log('isRelated')
                this.eventSetService.addEventToLatestSet(event);
            } else {
                console.log('isNotRelated')
                this.eventSetService.createSetAndAddEvent(event);
            }
            event.save();

            this.podMetricsService.savePodInformation();
            this.deploymentInformationService.saveDeploymentInformation();
            this.prometheusService.updateHpaMetricQueries();
            
        }



    }

    /**
     * Returns metric value for a specific hpa configuration applied to the component
     * 
     * @param name name of the scaled component
     * @param namespace namespace of the event
     * @param metricType metric type of the hpa configuration
     * @returns
     */
    async getMetricValue(name: string, namespace: string, metricType: string): Promise<number> {
        const hpaConfigs = await this.hpaService.getHpaConfigurationByDeploymentName(name, namespace);
        let metricValue = 0;
        for (const hpaConfig of hpaConfigs.currentMetrics) {
            if (hpaConfig.metricName === metricType) {
                metricValue = await this.prometheusService.queryPrometheus(hpaConfig.query)[1];
                break;
            }
        }
        return metricValue;
    }

    /**
     * Returns metric value for all hpa configurations applied to the component
     * 
     * @param name name of the scaled component
     * @param namespace namespace of the event
     * @returns
     */
    async getAllMetricValues(name: string, namespace: string): Promise<number[]> {
        const hpaConfigs = await this.hpaService.getHpaConfigurationByDeploymentName(name, namespace);
        let metricValues = [];
        for (const hpaConfig of hpaConfigs.currentMetrics) {
            const metricValue = await this.prometheusService.queryPrometheus(hpaConfig.query)[1];
            metricValues.push(metricValue);
        }
        return metricValues;
    }

    /**
     * Returns the latest event from the database with the scaling type "scaleOut"
     * 
     * @param name name of the scaled component
     * @param namespace namespace of the event
     * @returns
     */
    async getLatestScaleOutEvent(name: string, namespace: string): Promise<Event> {
        return this.eventModel.findOne
            ({ 'name': name, 'namespace': namespace, 'scalingType': 'scaleOut' })
            .sort({ 'createdAt': -1 })
            .exec();
    }

    /**
     * Returns the latest event from the database
     * 
     * @param name name of the scaled component
     * @param namespace namespace of the event
     * @returns 
     */
    async getLatestEvent(name: string, namespace: string): Promise<Event> {
        return this.eventModel.findOne({ 'name': name, 'namespace': namespace }).sort({ 'createdAt': -1 }).exec();
    }
    /**
     * 
     * @returns All events from the database
     */
    async getAllEvents(): Promise<Event[]> {
        return this.eventModel.find().exec();
    }
    /**
     * Deletes all events from the database
     * 
     * @returns 
     */
    async deleteAllEvents() {
        return this.eventModel.remove().exec();
    }

    /**
     * Deletes one event from the database by its id
     * 
     * @param id
     * @returns
     */
    async deleteEventById(id: string) {
        return this.eventModel
            .findByIdAndDelete(id)
            .exec();
    }

    /**
     * Returns one event by its id
     * 
     * @param id
     * @returns
     */
    async getEventById(id: string): Promise<Event> {
        return this.eventModel.findById(id).exec();
    }

    /**
     * Extracts the scaling type via regex
     * 
     * @param event 
     * @returns the scaling type
     */
    extractScalingType(event: Event): string {
        let regexScaleOut = /(above)/g;
        let regexScaleIn = /(below)/g;
        let scalingType = '';
        if (regexScaleOut.test(event.message)) {
            scalingType = 'scaleOut'
        } else if (regexScaleIn.test(event.message)) {
            scalingType = 'scaleIn'
        } else {
            scalingType = 'TBD'
        }
        return scalingType;
    }
    /**
     * Extracts the replica size
     * 
     * @param event 
     * @returns the replica size
     */
    extractReplicaSize(event: Event): number {
        let regexReplicaSize = /New size\: (\d+)/;
        let replicaSize = NaN;
        try {
            replicaSize = parseInt(event.message.match(regexReplicaSize).pop());
        } catch (error) {

        }
        return replicaSize;
    }
    /**
     * Extracts the metric type
     * @param event 
     * @returns the metric type
     */
    extractMetricType(event: Event): string {
        let regexMetricTypeScaleIn = /(reason: All metrics below target)/
        let regexMetricType = /reason: (.*) metrics above target/;
        let regexExternalMetric = /external metric/;
        let regexMetricTypeExternalMetric = /(?<=tomato)(.*?)(?=tomato)/;
        let metricType = '';
        try {
            if (regexMetricTypeScaleIn.test(event.message)) {
                let metricType = 'scaleIn'
                return metricType
            }
            else if (regexExternalMetric.test(event.message)) {
                metricType = event.message.match(regexMetricTypeExternalMetric).pop();
            }
            else { metricType = event.message.match(regexMetricType).pop(); }
        } catch (error) {

        }
        return metricType;

    }
    /**
     * Checks if a event is related to the latest event
     * @param event 
     * @returns 
     */
    async isRelated(event: Event): Promise<boolean> {
        let latestEvent: Event;
        let isRelatedByDerivative: boolean;
        await this.getLatestEvent(event.name, event.namespace).then(function (v) { latestEvent = v });
        if (latestEvent === null) {
            return false
        }
        await this.isRelatedByDerivative(event, latestEvent)
        if (!this.isRelatedByScalingType(event, latestEvent)) {
            return false;
        } 
        if (!this.isRelatedByTime(event, latestEvent)) {
            return false
        }    
        if (this.isRelatedByDerivative(event, latestEvent)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Checks if events are related by time
     * @param event 
     * @param latestEvent 
     * @returns 
     */
    isRelatedByTime(event: Event, latestEvent: Event): boolean {
        let relationTime = 300000;
        if (latestEvent === null) {
            return false;
        }
        const currentDate = new Date(event.createdAt);
        const latestDate = new Date(latestEvent.createdAt)
        let difference = Math.abs(currentDate.getTime() - latestDate.getTime());
        if (difference < relationTime) {
            return true
        } else {
            return false
        }
    }
    /**
     * Checks if events are related by derivative
     * @param event 
     * @param latestEvent 
     * @returns 
     */
    async isRelatedByDerivative(event: Event, latestEvent: Event) {
        let eventTime = new Date(event.createdAt).getTime();
        let latestEventTime = new Date(latestEvent.createdAt).getTime();
        let isRelatedByDerivative: boolean;
        let positivePercentage: number;
        // await this.derivativeService.calculateDerivative(event.name, event.namespace, latestEventTime, eventTime, event.metricType).then(function(v) {positivePercentage = v});
        return true;
    }
    /**
     * Checks if events are related by scaling type
     * @param event 
     * @param latestEvent 
     * @returns 
     */
    isRelatedByScalingType(event: Event, latestEvent: Event): boolean {
        if (event.scalingType === latestEvent.scalingType && event.scalingType != 'TBD') {
            console.log(event.scalingType + '=' + latestEvent.scalingType)
            console.log('scalingType matches')
            return true;
        } else {
            return false;
        }
    }
}
