import { ILogger } from "../../logger/logger";
import { ISessionService } from "../../session_service/session_service";
import { WebsocketServer, WebsocketServerEvent, WebsocketServerEventHandler } from "../server";

class NewSessionHandler implements WebsocketServerEventHandler {

    sessionService: ISessionService;
    websocketServer: WebsocketServer;
    logger: ILogger;

    constructor(sessionService: ISessionService, websocketServer: WebsocketServer, logger: ILogger) {
        this.sessionService = sessionService;
        this.websocketServer = websocketServer;
        this.logger = logger;
    }

    eventName: string = "new_session";
    handler: (...args: any[]) => void = async () => {
        if (this.sessionService.getCurrentSession().isValid()) {
            this.logger.warn('Attempted to create new session, but session already exists.')
            return;
        }

        var newSession = await this.sessionService.createNewSession();

        this.websocketServer.emit(WebsocketServerEvent.NewSession, { 'session_id': newSession.id });
    };
}

export { NewSessionHandler }