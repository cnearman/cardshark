import { Logger } from "winston";

interface ILogger {
    fatal (logString: string, args: any) : void;
    error (logString: string, args: any) : void;    
    warn  (logString: string, args: any) : void;
    info  (logString: string, args: any) : void;
    debug (logString: string, args: any) : void;
    trace (logString: string, args: any) : void;


    fatal (logString: string) : void;
    error (logString: string) : void;    
    warn  (logString: string) : void;
    info  (logString: string) : void;
    debug (logString: string) : void;
    trace (logString: string) : void;
}

class WinstonLogger implements ILogger{
    logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }
    fatal(logString: string, args: any): void;
    fatal(logString: string): void;
    fatal(logString: string, args?: any): void {
        this.logger.log('fatal', logString, args);
    }
    error(logString: string, args: any): void;
    error(logString: string): void;
    error(logString: string, args?: any): void {
        this.logger.log('error', logString, args);
    }
    warn(logString: string, args: any): void;
    warn(logString: string): void;
    warn(logString: string, args?: any): void {
        this.logger.log('warn', logString, args);
    }
    info(logString: string, args: any): void;
    info(logString: string): void;
    info(logString: string, args?: any): void {
        this.logger.log('info', logString, args);
    }
    debug(logString: string, args: any): void;
    debug(logString: string): void;
    debug(logString: string, args?: any): void {
        this.logger.log('debug', logString, args );
    }
    trace(logString: string, args: any): void;
    trace(logString: string): void;
    trace(logString: string, args?: any): void {
        this.logger.log('error', logString, args );
    }
}
export { WinstonLogger, ILogger }