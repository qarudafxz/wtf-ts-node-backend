import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import morgan from 'morgan'
import { db } from '@/database/connect'
//routes
import { auth } from '@/routes/auth'

dotenv.config()

const app = express()
app.use(express.json())
app.use(bodyParser.json())
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
)
app.use(morgan('tiny'))
app.disable('x-powered-by')

app.use('/api/auth', auth)

try {
  db.connect().then(() =>
    console.log(
      'Connected to Postgre Database. Ready to persist data and retrieve data',
    ),
  )
} catch (err) {
  throw new Error('Failed to connect to database')
}

app.listen(8080 || 4000, () => {
  console.log(`Server is running on port ${8080 || 4000}`)
})

export default app
