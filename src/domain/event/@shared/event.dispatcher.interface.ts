import EventHandlerInterface from "./event.handler.interface";

export default interface EventDispatcherInterface {
    notify(event: any): void
    register(eventName: string, eventHandler: EventHandlerInterface): void
    unregister(eventName: string, eventHandler: EventHandlerInterface): void
    unregisterAll(): void
}