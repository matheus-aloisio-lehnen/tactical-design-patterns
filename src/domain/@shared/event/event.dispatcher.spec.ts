import EventDispatcher from "./event.dispatcher";
import SendEmailWhenProductIsCreatedHandler from "../../product/events/handler/send-email-when-product-is-created.handler";
import { ProductCreatedEvent } from "../../product/events/product-created.event";
import EnviaConsoleLog1Handler from "../../product/events/handler/envia-console-log-1.handler";
import EnviaConsoleLogHandler from "../../product/events/handler/envia-console-log.handler";
import Customer from "../../customer/entity/customer";
import Address from "../../customer/value-object/address";
import EnviaConsoleLog2Handler from "../../product/events/handler/envia-console-log-2.handler";
import { CustomerCreatedEvent } from "../../customer/events/customer-created.event";
import { CustomerAddressChangedEvent } from "../../customer/events/customer-change-address.event";

describe("Domain events tests", () => {

    it("should register an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    })

    it("should unregister an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
        eventDispatcher.unregister("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);
    })

    it("should unregister all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
        eventDispatcher.unregisterAll();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBe(undefined);
    })

    it("should notify all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");
        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
        const productCreatedEvent = new ProductCreatedEvent(new Date(), {
            name: "Product 1",
            description: "Product 1 description",
            price: 10.0
        });
        // Quando o notify for chamado, o handle deve ser chamado
        eventDispatcher.notify(productCreatedEvent);
        expect(spyEventHandler).toHaveBeenCalled();
    })

    it("Dispara 2 handlers no CustomerCreatedEvent e 1 no CustomerAddressChangedEvent", () => {
        const dispatcher = new EventDispatcher()
        const h1 = new EnviaConsoleLog1Handler()
        const h2 = new EnviaConsoleLog2Handler()
        const h3 = new EnviaConsoleLogHandler()
        const spy1 = jest.spyOn(h1, "handle")
        const spy2 = jest.spyOn(h2, "handle")
        const spy3 = jest.spyOn(h3, "handle")
        dispatcher.register("CustomerCreatedEvent", h1)
        dispatcher.register("CustomerCreatedEvent", h2)
        dispatcher.register("CustomerAddressChangedEvent", h3)
        const customer = new Customer("c1", "Matheus")
        const evtCreated = new CustomerCreatedEvent(new Date(), {
            id: customer.id,
            name: customer.name
        })
        dispatcher.notify(evtCreated)
        customer.changeAddress(new Address("Rua A", 123, "88000-000", "Florianópolis"))
        const evtAddress = new CustomerAddressChangedEvent(new Date(), {
            id: customer.id,
            name: customer.name,
            address: customer.Address
        })
        dispatcher.notify(evtAddress)
        expect(spy1).toHaveBeenCalledTimes(1)
        expect(spy2).toHaveBeenCalledTimes(1)
        expect(spy3).toHaveBeenCalledTimes(1)
    })

})
