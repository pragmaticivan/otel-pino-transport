import abstractTransportBuild from 'pino-abstract-transport'
import { Logger, LogRecord, logs } from '@opentelemetry/api-logs';
import type { OtelPinoOptions } from './types'

/**
 * If the source format has only a single severity that matches the meaning of the range
 * then it is recommended to assign that severity the smallest value of the range.
 * https://github.com/open-telemetry/opentelemetry-specification/blob/fc8289b8879f3a37e1eba5b4e445c94e74b20359/specification/logs/data-model.md#mapping-of-severitynumber
 */
const DEFAULT_SEVERITY_NUMBER_MAP = {
  10: 1, // TRACE
  20: 5, // DEBUG
  30: 9, // INFO
  40: 13, // WARN
  50: 17, // ERROR
  60: 21 // FATAL
}

/**
 * Resolves the options for the Pino Loki transport
 */
function resolveOptions(options: OtelPinoOptions = {}) {
  return {
    ...options,
  }
}

function otelPino(userOptions: OtelPinoOptions = {}) {
  const options = resolveOptions(userOptions);

  const logger = logs.getLogger('otel-pino-transport');

  return abstractTransportBuild(
    async (source) => {
      for await (const obj of source) {
        emitLogRecord(logger, options, obj)
      }
    },
    {
      /**
       * When transport is closed, push remaining logs to Otel
       * and clear the interval
       */
      async close() {
        logs.disable();
      },
    },
  )
}

function emitLogRecord(logger: Logger, options: OtelPinoOptions, record: any) {
  const mapperOptions = {
    messageKey: record.messageKey,
    levels: record.levels,
  }
  const logRecord: LogRecord = toOpenTelemetry(record, mapperOptions)

  logger.emit(logRecord);
}

function toOpenTelemetry(sourceObject, { messageKey, levels, severityNumberMap = {}}) {
  const {
    time,
    level,
    hostname,
    pid,
    [messageKey]: msg,
    ...attributes
  } = sourceObject

  const severityNumber =
    severityNumberMap[sourceObject.level] ?? DEFAULT_SEVERITY_NUMBER_MAP[sourceObject.level] ?? 0
  const severityText = levels.labels[sourceObject.level]

  return {
    timestamp: time,
    body: msg,
    severityNumber,
    attributes,
    severityText
  }
}

module.exports = otelPino
module.exports.otelPino = otelPino
