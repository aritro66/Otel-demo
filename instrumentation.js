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


const { resource, exporterConfigTraces, exporterConfigMetrics } = require('./constants')



const sdk = new NodeSDK({
    resource: resource,
    traceExporter: new OTLPTraceExporter(exporterConfigTraces),
    metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter(exporterConfigMetrics),
        exportIntervalMillis: 1000,
    }),

    instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

process.on('SIGTERM', () => {
    sdk.shutdown()
        .then(() => console.log('Tracing terminated'))
        .catch((error) => console.log('Error terminating tracing', error))
        .finally(() => process.exit(0));
});
