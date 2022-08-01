require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

// Connect to Database
const connectToDb = require('./db/connectToDb')

// Routes
const authRouter = require('./routes/authRoutes')

// middleware
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const errorHandlerMiddleware= require('./middleware/error-handler')
const notFoundMiddleware= require('./middleware/not-found')

app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

app.use('/api/v1/auth', authRouter)

// testing
app.get('/api/v1', (req, res) => {
    // console.log(req.signedCookies)
    res.send('Hello World')
})

app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)

const port = process.env.PORT || '3000'

const start = async () => {
    try {
        await connectToDb(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is listening on port : ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()