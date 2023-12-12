const { createLogger, transports } = require('winston')
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http')
const {
    LoggerProvider,
    BatchLogRecordProcessor,
} = require('@opentelemetry/sdk-logs')
const { Resource } = require('@opentelemetry/resources')
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions')
const { SeverityNumber } = require('@opentelemetry/api-logs')
require('dotenv').config()

const resource = Resource.default().merge(
    new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'my-app',
        [SemanticResourceAttributes.SERVICE_VERSION]: '0.1.0',
    })
)

const loggerProvider = new LoggerProvider({
    resource: resource,
})
const logExporter = new OTLPLogExporter({
    url: `https://otel.kloudmate.com:4318/v1/logs`,
    headers: {
        Authorization: process.env.SECRET_KEY,
    },
})
const logProcessor = new BatchLogRecordProcessor(logExporter)
loggerProvider.addLogRecordProcessor(logProcessor)

const formatLog = (args) =>
    typeof args === 'string' ? args : JSON.stringify(args)

// your winston implementation
const consoleTransport = new transports.Console()
const logger = createLogger({
    transports: [consoleTransport],
})

const customLogger = {
    ...logger,
    info: (args) => {
        loggerProvider
            .getLogger('otel-logger')
            .emit({ body: formatLog(args), severityNumber: SeverityNumber.INFO })
        return logger.info(args)
    },

    error: (args) => {
        loggerProvider
            .getLogger('otel-logger')
            .emit({ body: formatLog(args), severityNumber: SeverityNumber.ERROR })
        return logger.error(args)
    },
}

module.exports = { customLogger }