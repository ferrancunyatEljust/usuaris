import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())

// API routes (keeps same paths: /users and /login)
app.use('/', userRoutes)

// Error handling middleware
app.use(errorHandler)

app.listen(port, () => {
    console.log(`http://localhost:${port}${'/users'}`)
})