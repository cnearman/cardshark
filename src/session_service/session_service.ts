class SessionService implements ISessionService {
    sessionIdLength: number = 10;
    currentSession?: Session;

    redisClient: any;

    constructor(redisClient: any) {
        this.redisClient = redisClient;
    }

    createNewSession: () => Promise<Session> = async () => {
        var sessionId = this.makeSessionId(this.sessionIdLength);
        await this.redisClient.json.set(sessionId, '$', {"players" : [{"name": "chris"}]});
        return new Session(sessionId);
    }

    getSessionByUserId: (userId: string) => Promise<Session> = async (userId) => {
        var sessionId = await this.redisClient().get(`${userId}:currentSession`);
        var sessionData = await this.redisClient().json.get(sessionId, '$');
        return new Session(sessionId); 
    }
    // TODO: Complete get session
    // TODO: update logic for joining a session

    joinSession: (sessionId: string, name: string) => Promise<void> = async (sessionId, name) => {
        await this.redisClient.json.get()
    }

    getCurrentSession: () => Session = () => {
        return this.currentSession || new Session(Session.default_id);
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
    joinSession: (sessionId: string, name: string) => Promise<void>;
}

class Session {
    static default_id: string = "DEFAULT_ID";
    id: string;

    constructor(id: string) {
        this.id = id;
    }

    isValid() {
        return this.id != Session.default_id;
    }
}

export { SessionService, ISessionService, Session }