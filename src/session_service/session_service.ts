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

    joinSession: (sessionId: string, name: string, userId: string) => Promise<void> = async (sessionId, name, userId) => {
        await this.redisClient.multi()
            .set(`${userId}:currentSession`, sessionId);
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
    joinSession: (sessionId: string, name: string, userId: string) => Promise<void>;
}

interface SessionParams {
    id?: string;
    players? : PlayerSessionData[]
}

interface PlayerSessionData {
    name?: string;
}

class Session {
    static default_id: string = "DEFAULT_ID";
    id: string;
    players: PlayerSessionData[];

    constructor(params: SessionParams) {
        let { 
            id = Session.default_id,
            players = [] 
        } = params;
        this.id = id;
        this.players = players;
    }

    isValid() {
        return this.id != Session.default_id;
    }
}

export { SessionService, ISessionService, Session }