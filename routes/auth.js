const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const validateRegisterInput = require('../validation/registerValidation')

// @route GET api/auth/test
// @desc  Test the auth route
// @access Public
router.get('/test', (req, res) => {
  res.send('Auth route working! *_*')
})

// @route POST api/auth/register
// @desc  Create a new user
// @access Public
router.post('/register', async (req, res) => {
  try {
    const { errors, isValid } = validateRegisterInput(req.body)

    if (!isValid) {
      return res.status(400).json(errors)
    }

    // Check for existing user | RegExp for case sensitivity
    const existingEmail = await User.findOne({
      email: new RegExp('^' + req.body.email + '$', 'i')
    })
    if (existingEmail) {
      return res
        .status(400)
        .json({ error: 'A user with this email already exists.' })
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12)
    // Create a new user
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name
    })

    // Save user to db
    const savedUser = await newUser.save()

    // Return user without showing password
    const userToReturn = { ...savedUser._doc }
    delete userToReturn.password

    // Return the new User
    return res.json(userToReturn)
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
})

// @route POST api/auth/login
// @desc  Login user and return an access token
// @access Public
router.post('/login', async (req, res) => {
  try {
    // Check for user
    const user = await User.findOne({
      email: new RegExp('^' + req.body.email + '$', 'i')
    })
    if (!user) {
      return res.status(400).json({ error: 'Login credential error.' })
    }

    const passwordMatch = await bcrypt.compare(req.body.password, user.password)
    return res.json({ passwordMatch })
  } catch (err) {
    console.log(err)
    return res.status(500).send(err.message)
  }
})

module.exports = router
