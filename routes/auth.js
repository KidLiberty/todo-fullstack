const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const validateRegisterInput = require('../validation/registerValidation')
const validateLoginInput = require('../validation/loginValidation')
const jwt = require('jsonwebtoken')
const requiresAuth = require('../middleware/permissions')

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

    // When a user registers, we can log them in right away with savedUser._id (different from user._id)
    const payload = { userId: savedUser._id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })

    res.cookie('access-token', token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    })

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
    const { errors, isValid } = validateLoginInput(req.body)

    if (!isValid) {
      return res.status(400).json(errors)
    }

    // Check for user
    const user = await User.findOne({
      email: new RegExp('^' + req.body.email + '$', 'i')
    })
    if (!user) {
      return res
        .status(400)
        .json({ error: 'There was a problem with your login credentials.' })
    }

    const passwordMatch = await bcrypt.compare(req.body.password, user.password)
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ error: 'There was a problem with your login credentials.' })
    }

    const payload = { userId: user._id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })

    res.cookie('access-token', token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    })

    const userToReturn = { ...user._doc }
    delete userToReturn.password
    return res.json({ token, user: userToReturn })
  } catch (err) {
    console.log(err)
    return res.status(500).send(err.message)
  }
})

// @route PUT api/auth/login
// @desc  Logout user and clear the cookie
// @access Public
router.put('/logout', requiresAuth, async (req, res) => {
  try {
    res.clearCookie('access-token')

    res.json({ success: true })
  } catch (err) {
    console.log(err)
    return res.status(500).send(err.message)
  }
})

// @route GET api/auth/current
// @desc  Return the currently authed user
// @access Private
router.get('/current', requiresAuth, (req, res) => {
  if (!req.user) {
    return res.status(401).send('Unauthorized')
  }

  return res.json(req.user)
})

module.exports = router
