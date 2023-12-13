const { Resource } = require('@opentelemetry/resources')
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions')
require('dotenv').config()

const resource = Resource.default().merge(
    new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'my-app',
        [SemanticResourceAttributes.SERVICE_VERSION]: '0.1.0',
    })
)

const exporterConfigLogs = {
    url: `https://otel.kloudmate.com:4318/v1/logs`,
    headers: {
        Authorization: process.env.SECRET_KEY,
    },
}

const exporterConfigTraces = {
    url: `https://otel.kloudmate.com:4318/v1/traces`,
    headers: {
        Authorization: process.env.SECRET_KEY,
    },
}

const exporterConfigMetrics = {
    url: `https://otel.kloudmate.com:4318/v1/metrics`,
    headers: {
        Authorization: process.env.SECRET_KEY,
    },
}

module.exports = {
    resource,
    exporterConfigLogs,
    exporterConfigMetrics,
    exporterConfigTraces
}