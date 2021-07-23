import expressWinston from 'express-winston'
import winston, { format, transports } from 'winston'
import { ElasticsearchTransport } from 'winston-elasticsearch'

const env = process.env['NODE_ENV'] as 'dev' | 'stage' | 'prd'


function transportsBasedOnEnv(): winston.transport[] {
  const elasticTransport = new ElasticsearchTransport({
    level: 'debug',
    format: format.combine(format.json(), format.uncolorize()),
    indexPrefix: 'plutus-logs',
    clientOpts: {
      node: process.env['ELASTIC_SEARCH_URL'],
      maxRetries: 5,
      requestTimeout: 60000,
      sniffOnStart: true
    }
  })

  if (env == 'dev') return [
    new transports.File({ filename: 'plutus-logs', dirname: 'logs', format: format.combine(format.timestamp(), format.json(), format.uncolorize()) }),
    elasticTransport
  ]
  return [
    new transports.Console(),
    elasticTransport
  ]
}

function formatBasedOnEnv(): winston.Logform.Format {
  if (env == 'dev') {
    return format.combine(
      format.colorize(),
      format.simple()
    )
  }

  return format.combine(
    format.json()
  )
}

export const loggerOptions: expressWinston.LoggerOptions = {
  transports: transportsBasedOnEnv(),
  format: formatBasedOnEnv(),
  meta: true,
  expressFormat: true
};


export const logger = winston.createLogger({
  transports: transportsBasedOnEnv(),
  format: formatBasedOnEnv(),
});