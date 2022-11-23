import { Logger } from "winston";

interface ILogger {
    fatal:  (logString: string) => void;
    error:  (logString: string) => void;    
    warn:   (logString: string) => void;
    info:   (logString: string) => void;
    debug:  (logString: string) => void;
    trace:  (logString: string) => void;
}

class WinstonLogger implements ILogger{
    logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    fatal: (logString: string) => void = (logString) => {
        this.logger.log({ level: 'fatal', message: logString });
    };

    error: (logString: string) => void = (logString) => {
        this.logger.log({ level: 'error', message: logString });
    };

    warn: (logString: string) => void = (logString) => {
        this.logger.log({ level: 'warn', message: logString });
    };

    info: (logString: string) => void = (logString) => {
        this.logger.log({ level: 'info', message: logString });
    };

    debug: (logString: string) => void = (logString) => {
        this.logger.log({ level: 'debug', message: logString });
    };

    trace: (logString: string) => void = (logString) => {
        this.logger.log({ level: 'error', message: logString });
    };
}
export { WinstonLogger, ILogger }