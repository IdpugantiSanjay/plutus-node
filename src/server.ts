import express from 'express'

import { config } from 'dotenv'
config()

import { Client } from '@elastic/elasticsearch'
import type { Client as NewTypes } from '@elastic/elasticsearch/api/new'
import { createTransactionIndex } from './transactions/store'
import { router } from './transactions/routes'
import { requestLogger } from './internal/request-logger'


import expressWinston from 'express-winston'
import { loggerOptions } from './logger'

const app = express()
app.use(requestLogger)
app.use(express.json())
app.use(expressWinston.logger(loggerOptions))

// @ts-expect-error @elastic/elasticsearch
const client: NewTypes = new Client({
  node: process.env['ELASTIC_SEARCH_URL'] || 'http://localhost:9200'
})

app.use('/api/:username/transactions', router)

app.get('/', (_, res) => res.send('Working'))

app.get('/routes', (_, res) => res.send('Working'))



app.listen(8080, function () { 
  console.log('Server started running on port 8080') 
  createTransactionIndex(client)
})
