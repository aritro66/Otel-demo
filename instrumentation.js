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

const sdk = new NodeSDK({
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
    instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();