const User = require('../models/User')
const jwt = require('jsonwebtoken')

/* 
    requiresAuth checks and verifies that the current user
    is already logged in.
    
    next() continues the request instead of cutting it early, 
    passing it to the next handler (param) in the function
*/
const requiresAuth = async (req, res, next) => {
  const token = req.cookies['access-token']
  let isAuthed = false

  if (token) {
    try {
      const { userId } = jwt.verify(token, process.env.JWT_SECRET)
      try {
        const user = await User.findById(userId)

        if (user) {
          const userToReturn = { ...user._doc }
          delete userToReturn.password
          req.user = userToReturn
          isAuthed = true
        }
      } catch {
        isAuthed = false
      }
    } catch {
      isAuthed = false
    }
  }

  if (isAuthed) {
    return next()
  } else {
    return res.status(401).send('Unauthorized')
  }
}

module.exports = requiresAuth
