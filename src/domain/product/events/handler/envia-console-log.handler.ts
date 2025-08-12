import EventHandlerInterface from "../../../@shared/event/event.handler.interface";
import { CustomerCreatedEvent } from "../../../customer/events/customer-created.event";

export default class EnviaConsoleLogHandler implements EventHandlerInterface<CustomerCreatedEvent> {

    handle(event: CustomerCreatedEvent): void {
        const { id, name, address } = event.eventData
        console.log(`Endereço do cliente: ${ id }, ${ name } alterado para: ${ address.toString() }`)
    }

}