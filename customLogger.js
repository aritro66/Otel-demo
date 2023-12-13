const { createLogger, transports } = require('winston')
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http')
const {
    LoggerProvider,
    BatchLogRecordProcessor,
} = require('@opentelemetry/sdk-logs')
const { resource, exporterConfigLogs } = require("./constants")
const { SeverityNumber } = require('@opentelemetry/api-logs')


const loggerProvider = new LoggerProvider({
    resource: resource,
})
const logExporter = new OTLPLogExporter(exporterConfigLogs)
const logProcessor = new BatchLogRecordProcessor(logExporter)
loggerProvider.addLogRecordProcessor(logProcessor)

const formatLog = (args) =>
    typeof args === 'string' ? args : JSON.stringify(args)

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