import { ISessionService } from "../../session_service/session_service";
import { WebsocketServer, WebsocketServerEvent, WebsocketServerEventHandler } from "../server";

class NewSessionHandler implements WebsocketServerEventHandler {

    sessionService: ISessionService;
    websocketServer: WebsocketServer;

    constructor(sessionService: ISessionService, websocketServer: WebsocketServer) {
        this.sessionService = sessionService;
        this.websocketServer = websocketServer;
    }

    eventName: string = "new_session";
    handler: (...args: any[]) => void = async () => {
        // If already part of a session, don't join.
        if (this.sessionService.getCurrentSession().isValid()) {
            return;
        }

        var newSession = await this.sessionService.createNewSession();

        this.websocketServer.emit(WebsocketServerEvent.NewSession, { 'session_id': newSession.id });
    };
}

export { NewSessionHandler }