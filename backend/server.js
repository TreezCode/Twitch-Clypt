const express = require('express')
const dotenv = require('dotenv').config()
const colors = require('colors')
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const port = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

const app = express()

// Express middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/twitch', require('./routes/twitchUserRoutes'))
app.use('/api/clips', require('./routes/clipRoutes'))
app.use('/api/games', require('./routes/gamesRoutes'))
app.use('/api/streams', require('./routes/streamRoutes'))

// Override Express default error handler
app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))
