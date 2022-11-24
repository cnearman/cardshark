import { Socket } from "socket.io";
import { ILogger } from "../../logger/logger";
import { ISessionService } from "../../session_service/session_service";
import { WebsocketServer, WebsocketServerEvent, WebsocketServerEventHandler } from "../server";

class NewSessionHandler implements WebsocketServerEventHandler {

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
        return new NewSessionHandler(this.sessionService, this.websocketServer, this.logger);
    };

    eventName: string = "new_session";
    handler: (...args: any[]) => void = async () => {
        if (!this.getSocket()) {
            return;
        }

        if (this.sessionService.getCurrentSession().isValid()) {
            this.logger.warn('Attempted to create new session, but session already exists.')
            return;
        }
        
        this.logger.info(`Received new_session event from socket ${this.getSocket()?.id}`);
        var newSession = await this.sessionService.createNewSession();

        this.websocketServer.emit(WebsocketServerEvent.NewSession, { 'session_id': newSession.id });
    };
}

export { NewSessionHandler }