import { Socket } from "socket.io";
import { ILogger } from "../../logger/logger";
import { ISessionService } from "../../session_service/session_service";
import { WebsocketServer, WebsocketServerEvent, WebsocketServerEventHandler } from "../server";

class JoinSessionHandler implements WebsocketServerEventHandler {

    sessionService: ISessionService;
    websocketServer: WebsocketServer;
    logger: ILogger;
    socket: Socket | undefined;

    constructor(sessionService: ISessionService, websocketServer: WebsocketServer, logger: ILogger) {
        this.sessionService = sessionService;
        this.websocketServer = websocketServer;
        this.logger = logger;
    }

    setSocket: (socket: Socket) => void = (socket) => {
        this.socket = socket;
    };
    
    getSocket: () => Socket | undefined = () => {
        return this.socket;
    };

    getInstance: () => WebsocketServerEventHandler = () => {
        return new JoinSessionHandler(this.sessionService, this.websocketServer, this.logger);
    };

    eventName: string = "join_session";
    handler: (...args: any[]) => void = async (args) => {
        if (!this.getSocket()) {
            return;
        }
        
        this.logger.info(`Received join_session event from socket ${this.getSocket()?.id}`, args);
        await this.sessionService.joinSession(args.sessionId, args.name, this.getSocket()?.id!);

        // TODO: Send update state event to user.
        this.websocketServer.emit(WebsocketServerEvent.UpdateState, { 'session_id': newSession.id });
    };
}

export { JoinSessionHandler }