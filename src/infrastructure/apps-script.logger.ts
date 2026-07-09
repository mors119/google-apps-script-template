import { serializeContext } from '../utils/logging';

export interface LoggerService {
  debug(message: string, context?: Readonly<Record<string, unknown>>): void;
  info(message: string, context?: Readonly<Record<string, unknown>>): void;
  warn(message: string, context?: Readonly<Record<string, unknown>>): void;
  error(message: string, context?: Readonly<Record<string, unknown>>): void;
}

export class AppsScriptLogger implements LoggerService {
  public debug(message: string, context?: Readonly<Record<string, unknown>>): void {
    Logger.log(this.format('DEBUG', message, context));
  }

  public info(message: string, context?: Readonly<Record<string, unknown>>): void {
    Logger.log(this.format('INFO', message, context));
  }

  public warn(message: string, context?: Readonly<Record<string, unknown>>): void {
    Logger.log(this.format('WARN', message, context));
  }

  public error(message: string, context?: Readonly<Record<string, unknown>>): void {
    Logger.log(this.format('ERROR', message, context));
  }

  private format(
    level: string,
    message: string,
    context?: Readonly<Record<string, unknown>>,
  ): string {
    const contextSuffix = context ? ` | ${serializeContext(context)}` : '';
    return `[${level}] ${message}${contextSuffix}`;
  }
}
