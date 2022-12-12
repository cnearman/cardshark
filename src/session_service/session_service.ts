import { RedisJSON } from "@node-redis/json/dist/commands";
import { RedisClientType } from "redis";

class SessionService implements ISessionService {
    sessionIdLength: number = 10;
    currentSession?: Session;

    redisClient: RedisClientType;

    constructor(redisClient: RedisClientType) {
        this.redisClient = redisClient;
    }

    createNewSession: () => Promise<Session> = async () => {
        var sessionId = this.makeSessionId(this.sessionIdLength);
        await this.redisClient.json.set(sessionId, '$', {"players" : [{"name": "chris"}]});
        return new Session({id: sessionId});
    }

    getSessionByUserId: (userId: string) => Promise<Session> = async (userId) => {
        var sessionId = await this.redisClient.get(`${userId}:currentSession`);
        if (!sessionId) {
            return new Session({});
        }
        let id = sessionId!;
        let sessionData: any = await this.redisClient.json.get(id, {path: '$'});
        return new Session({id: sessionId, ...sessionData}); 
    }
    // TODO: Complete get session
    // TODO: update logic for joining a session

    joinSession: (sessionId: string, name: string, userId: string) => Promise<Session> = async (sessionId, name, userId) => {
        // set sessionId for current session with timeout
        await this.redisClient.multi()
            .set(`${userId}:currentSession`, sessionId, { EX: 60 * 60 * 8 })
            .json.ARRAPPEND(sessionId, '$.state.players', {name: name});
        
        var result = await this.redisClient.json.get(sessionId) as RedisJSON;
        if (!result) {
            throw Error(`User tried to join non-existant session ${sessionId}.`);
        }
        return new Session({id: sessionId, state: (result.valueOf()) as any});
    }

    getCurrentSession: () => Session = () => {
        return this.currentSession || new Session({});
    }

    makeSessionId:(length: number) => string = (length) => {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    }
}

interface ISessionService {
    createNewSession: () => Promise<Session>;
    getCurrentSession: () => Session;
    joinSession: (sessionId: string, name: string, userId: string) => Promise<Session>;
}

interface SessionParams {
    id?: string;
    state? : SessionState;
}

interface PlayerSessionData {
    name?: string;
}

class Session {
    static default_id: string = "DEFAULT_ID";
    id: string;
    state: SessionState;

    constructor(params: SessionParams) {
        let { 
            id = Session.default_id,
            state = SessionState.DefaultSessionState
        } = params;
        this.id = id;
        this.state = state;
    }

    isValid() {
        return this.id != Session.default_id;
    }
}

class SessionState {
    static DefaultSessionState: SessionState = new SessionState();
    players: PlayerSessionData[] | undefined;
}

export { SessionService, ISessionService, Session }