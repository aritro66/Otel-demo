/*instrumentation.js*/
const { NodeSDK } = require('@opentelemetry/sdk-node');
const {
    getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const {
    OTLPMetricExporter,
} = require('@opentelemetry/exporter-metrics-otlp-http');
const {
    OTLPTraceExporter,
} = require('@opentelemetry/exporter-trace-otlp-http');
require('dotenv').config()
// const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
// const {
//     LoggerProvider,
//     BatchLogRecordProcessor,
// } = require('@opentelemetry/sdk-logs');
const { Resource } = require('@opentelemetry/resources')
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions')
const { SeverityNumber } = require('@opentelemetry/api-logs')
console.log(process.env.SECRET_KEY)

const resource = Resource.default().merge(
    new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'my-app',
        [SemanticResourceAttributes.SERVICE_VERSION]: '0.1.0',
    })
)

const sdk = new NodeSDK({
    resource: resource,
    traceExporter: new OTLPTraceExporter({
        url: `https://otel.kloudmate.com:4318/v1/traces`,
        headers: {
            Authorization: process.env.SECRET_KEY,
        },
    }),
    metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
            url: `https://otel.kloudmate.com:4318/v1/metrics`,
            headers: {
                Authorization: process.env.SECRET_KEY,
            },
        }),
    }),
    // logRecordProcessor: new BatchLogRecordProcessor({
    //     exporter: new OTLPLogExporter({
    //         url: `https://otel.kloudmate.com:4318/v1/logs`,
    //         headers: {
    //             Authorization: process.env.SECRET_KEY,
    //         },
    //     })
    // }),
    instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
