import express from "express";
import { WebsocketServer } from './src/websocket_server/server'
import * as HTTPServer from "http";
import { Server } from "socket.io";
import * as redis from 'redis';
import { NewSessionHandler } from "./src/websocket_server/handlers/new_session_handler";
import { SessionService } from "./src/session_service/session_service";
import Routes from "./src/routes";
import winston from "winston";
import { WinstonLogger } from "./src/logger/logger";


const port: number = Number(process.env.PORT) || 8082;

const app: any = express();
app.use('/', Routes);

const redisClient: any = redis.createClient({url: 'redis://localhost:6379'});

redisClient.connect();

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);


// TODO: resolve error thrown here.
function cleanup() {
  redisClient.quit(function() {
      console.log('Redis client stopped.');
  });
};

const coreLogger = winston.createLogger({
    transports: [
      new winston.transports.Console()
    ]
  });

const logger = new WinstonLogger(coreLogger);

const httpServer: any =  HTTPServer.createServer(app);
const ioServer: Server = new Server(httpServer);

const sessionService: SessionService = new SessionService(redisClient);

const server: WebsocketServer = new WebsocketServer(ioServer, logger);
const handlers = [ new NewSessionHandler(sessionService, server, logger)];
server.init(handlers);

httpServer.listen(port, () => console.log(`Express App running on port ${port}`));