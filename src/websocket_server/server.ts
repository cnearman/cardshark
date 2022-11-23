import { Server } from "socket.io"
import { ILogger } from "../logger/logger";

class WebsocketServer {
    socketServer: Server;
    logger: ILogger;
    eventHandlers?: Array<WebsocketServerEventHandler>;

    constructor(socketServer:Server, logger: ILogger ) {
        this.socketServer = socketServer;
        this.logger = logger;
    }

    init(eventHandlers: Array<WebsocketServerEventHandler>) {
        this.eventHandlers = eventHandlers;
        if (!this.eventHandlers) {
            return;
        }

        this.socketServer.on("connection", (socket) => {
            this.logger.info("Client connected.");
            this.eventHandlers?.forEach ((handler) => {
                this.logger.info(`Bound Event Handler for ${handler.eventName}`);
                socket.on(handler.eventName, handler.handler);
            });
        });
    }

    emit(event: WebsocketServerEvent, eventBody: any) {
        this.socketServer.emit(event.eventName, eventBody);
    }
}

interface WebsocketServerEventHandler {
    eventName : string;
    handler: (...args: any[]) => void;
}

class WebsocketServerEvent {
    static NewSession: WebsocketServerEvent = new WebsocketServerEvent("new_session");

    eventName: string;

    constructor(eventName: string) {
        this.eventName = eventName;
    }
}

export { WebsocketServer, WebsocketServerEventHandler, WebsocketServerEvent }