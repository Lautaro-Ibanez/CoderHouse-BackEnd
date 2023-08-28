import winston, { format } from "winston";

export default class LoggerService {
  constructor(env) {
    this.options = {
      levels: {
        debug: 5,
        http: 4,
        info: 3,
        warning: 2,
        error: 1,
        fatal: 0,
      },
    };
    this.logger = this.createLogger(env);
  }

  createLogger = (env) => {
    switch (env) {
      case "dev":
        return winston.createLogger({
          levels: this.options.levels,
          transports: [
            new winston.transports.Console({
              level: "debug",
              format: winston.format.simple(),
            }),
          ],
        });

      case "prod":
        return winston.createLogger({
          levels: this.options.levels,
          transports: [
            new winston.transports.Console({
              level: "info",
              format: winston.format.simple(),
            }),
            new winston.transports.File({
              level: "error",
              filename: "./errors.log",
              format: winston.format.simple(),
            }),
          ],
        });
    }
  };
}
