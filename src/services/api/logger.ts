export type LogLevel = 'info' | 'success' | 'warning' | 'error';

export class LoggerService {
  private static instance: LoggerService;

  private constructor() {}

  static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const dataString = data ? `\n${JSON.stringify(data, null, 2)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${dataString}`;
  }

  info(message: string, data?: any) {
    console.log(this.formatMessage('info', message, data));
  }

  success(message: string, data?: any) {
    console.log(this.formatMessage('success', message, data));
  }

  warning(message: string, data?: any) {
    console.warn(this.formatMessage('warning', message, data));
  }

  error(message: string, data?: any) {
    console.error(this.formatMessage('error', message, data));
  }
}

// Export singleton instance
export const logger = LoggerService.getInstance();