import { Server } from "socket.io"

class WebsocketServer {
    socketServer: Server;
    eventHandlers?: Array<WebsocketServerEventHandler>;

    constructor(socketServer:Server ) {
        this.socketServer = socketServer;
    }

    init(eventHandlers: Array<WebsocketServerEventHandler>) {
        this.eventHandlers = eventHandlers;
        if (!this.eventHandlers) {
            return;
        }

        this.socketServer.on("connection", (socket) => {
            console.log(`Client connected`);
            this.eventHandlers?.forEach ((handler) => {
                console.log(`Bound Event Handler for ${handler.eventName}`);
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