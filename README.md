# OpenTelemetry transport for Pino

[![NPM Published Version][npm-img]][npm-url]
[![Apache License][license-image]][license-image]

This module provides a Transport for [`pino`](https://www.npmjs.com/package/pino) module to send Pino logging to the OpenTelemetry Logging SDK.

Compatible with OpenTelemetry JS API and SDK `1.0+`.

## Installation

```bash
npm install --save otel-pino-transport
```

## Usage

This package exports the Pino transport class that is used to send records to the
OpenTelemetry Logs SDK. It can be used directly when configuring a Pino logger.

For example:

```js
const logsAPI = require('@opentelemetry/api-logs');
const {
    LoggerProvider,
    SimpleLogRecordProcessor,
    ConsoleLogRecordExporter,
} = require('@opentelemetry/sdk-logs');
const { OpenTelemetryTransport } = require('otel-pino-transport');
const pino = require('pino');


// To start a logger, you first need to initialize the Logger provider.
const loggerProvider = new LoggerProvider();
// Add a processor to export log record
loggerProvider.addLogRecordProcessor(
    new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())
);
logsAPI.logs.setGlobalLoggerProvider(loggerProvider);

const logger = pino.createLogger({
  level: 'info',
  transports: [
    new OpenTelemetryTransport()
  ]
});
```

### Supported versions

- [`pino`](https://www.npmjs.com/package/pino) versions `>=9.0.0 <4`

## Useful links

- For more information on OpenTelemetry, visit: <https://opentelemetry.io/>
- For more about OpenTelemetry JavaScript: <https://github.com/open-telemetry/opentelemetry-js>
- For help or feedback on this project, join us in [GitHub Discussions][discussions-url]

## License

Apache 2.0 - See [LICENSE][license-url] for more information.

[discussions-url]: https://github.com/pragmaticivan/otel-pino-transport/discussions
[license-url]: https://github.com/pragmaticivan/otel-pino-transport/blob/main/LICENSE
[license-image]: https://img.shields.io/badge/license-Apache_2.0-green.svg?style=flat
[npm-url]: https://www.npmjs.com/package/otel-winston-transport
[npm-img]: https://badge.fury.io/js/%40opentelemetry%2Fwinston-transport.svg

## Inspirations

- https://github.com/pinojs/pino-opentelemetry-transport
- https://github.com/Julien-R44/pino-loki
