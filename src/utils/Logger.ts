import winston from 'winston';

export class Logger {
  private static instance: Logger;
  private logger: winston.Logger;

  private constructor() {
    this.logger = winston.createLogger({
      level: process.env['LOG_LEVEL'] || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: 'global-mcp-server' },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
      ],
    });

    // Only add file transport if LOG_FILE is set and directory exists
    const logFile = process.env['LOG_FILE'];
    if (logFile) {
      try {
        const fs = require('fs');
        const path = require('path');
        const logDir = path.dirname(logFile);
        
        // Create log directory if it doesn't exist
        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true });
        }
        
        this.logger.add(
          new winston.transports.File({ filename: logFile })
        );
      } catch (error) {
        // Fallback: just log to console if file logging fails
        console.warn('Failed to set up file logging:', (error as Error).message);
      }
    }
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public debug(message: string, meta?: unknown): void {
    this.logger.debug(message, meta);
  }

  public info(message: string, meta?: unknown): void {
    this.logger.info(message, meta);
  }

  public warn(message: string, meta?: unknown): void {
    this.logger.warn(message, meta);
  }

  public error(message: string, error?: unknown): void {
    this.logger.error(message, { error });
  }
}
