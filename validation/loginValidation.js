const Validator = require('validator')
const isEmpty = require('./isEmpty')

const validateLoginInput = data => {
  let errors = {}

  // Check email field
  if (isEmpty(data.email)) {
    errors.email = 'Please provide a valid email.'
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'Please provide a valid email.'
  }

  // Check password field
  if (isEmpty(data.password)) {
    errors.password = 'Please provide a valid password.'
  } else if (!Validator.isLength(data.password, { min: 6, max: 150 })) {
    errors.password = 'Password must be between 6 and 150 characters long.'
  }

  return { errors, isValid: isEmpty(errors) }
}

module.exports = validateLoginInput
