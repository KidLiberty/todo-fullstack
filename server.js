require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const authRoute = require('./routes/auth')
const toDosRoute = require('./routes/todos')
const app = express()

app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())

app.get('/api', (req, res) => {
  res.send('Fullstack Server Response')
})

// When it makes a request, it will look to authRoute
app.use('/api/auth', authRoute)
app.use('/api/todos', toDosRoute)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to database!')

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port:${process.env.PORT}`)
    })
  })
  .catch(err => console.log(err))
