/**
 * Shape for a Pino log entry
 */
export interface PinoLog {
  level: number
  [key: string]: any
}

/**
 * Options for the Otel Pino transport
 */
export interface OtelPinoOptions {

  /**
   * Additional attributes to be added to all otel logs
   */
  attributes?: {
    [key: string]: string
  }
}
