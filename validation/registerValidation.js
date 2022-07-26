const Validator = require('validator')
const isEmpty = require('./isEmpty')

const validateRegisterInput = data => {
  let errors = {}

  // Check the email field
  if (isEmpty(data.email)) {
    errors.email = 'Email field cannot be empty.'
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid, please provide a valid email.'
  }

  // Check the password field
  if (isEmpty(data.password)) {
    errors.password = 'Password field cannot be empty.'
  } else if (!Validator.isLength(data.password, { min: 6, max: 150 })) {
    errors.password = 'Password must be between 6 and 150 characters long.'
  }
}
