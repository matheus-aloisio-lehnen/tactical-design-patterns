import EventInterface from "../@shared/event.interface";

export class CustomerCreatedEvent implements EventInterface {
    dataTimeOcurred: Date;
    eventData: any;

    constructor(dataTimeOcurred: Date, eventData: any) {
        this.dataTimeOcurred = dataTimeOcurred;
        this.eventData = eventData;
    }
}