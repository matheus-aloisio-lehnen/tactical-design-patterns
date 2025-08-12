import EventInterface from "../../@shared/event/event.interface";

export class ProductCreatedEvent implements EventInterface {
    dataTimeOcurred: Date;
    eventData: any;

    constructor(dataTimeOcurred: Date, eventData: any) {
        this.dataTimeOcurred = dataTimeOcurred;
        this.eventData = eventData;
    }
}