import { Server, Socket } from "socket.io"
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
                const handlerInstance = handler.getInstance(); // TODO: Find another way to resolve this socket reference
                handlerInstance.setSocket(socket);
                socket.on(handlerInstance.eventName, handlerInstance.handler);
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
    getInstance: () => WebsocketServerEventHandler;
    setSocket: (socket:Socket) => void;
    getSocket: () => Socket | undefined;
}

class WebsocketServerEvent {
    static NewSession: WebsocketServerEvent = new WebsocketServerEvent("new_session");

    eventName: string;

    constructor(eventName: string) {
        this.eventName = eventName;
    }
}

export { WebsocketServer, WebsocketServerEventHandler, WebsocketServerEvent }