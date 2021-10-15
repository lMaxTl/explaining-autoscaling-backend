export class EventDto {
    createdAt: string;
    details: {
    message : string;
    reason : string;
    tip : string;
    count : string;
    kind : string;
    name : string;
    namespace : string;
    component : string;
    host : string;
    labels: JSON;
    }
    endpoint: string;
    eventType: string;
}