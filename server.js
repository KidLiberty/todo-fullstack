const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const authRoute = require('./routes/auth')

app.use(express.json())
app.use(express.urlencoded())

app.get('/api', (req, res) => {
  res.send('Fullstack Server Response')
})

// Can use to test your application, but not needed for full version
// app.post('/api/name', (req, res) => {
//   if (req.body.name) {
//     return res.json({ name: req.body.name })
//   } else {
//     return res.status(400).json({ error: 'No name provided.' })
//   }
// })

// When it makes a GET request, it will look to authRoute
app.use('/api/auth', authRoute)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to database!')

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port:${process.env.PORT}`)
    })
  })
  .catch(err => console.log(err))
