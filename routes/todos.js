const express = require('express')
const router = express.Router()
const Todo = require('../models/Todo')
const requiresAuth = require('../middleware/permissions')
const validateToDoInput = require('../validation/toDoValidation')

// @route GET api/todos/test
// @desc Test the todos route
// @access Public

router.get('/test', (req, res) => {
  res.send('ToDos route working! *-*')
})

// @route POST api/todos/test
// @desc Create new todo
// @access Private

router.post('/new', requiresAuth, async (req, res) => {
  try {
    const { errors, isValid } = validateToDoInput(req.body)

    if (!isValid) {
      return res.status(400).json(errors)
    }

    const newToDo = new Todo({
      user: req.user._id,
      content: req.body.content,
      complete: false
    })

    await newToDo.save()

    return res.json(newToDo)
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
})

// @route GET api/todos/test
// @desc Return the current users todos
// @access Private

router.get('/current', requiresAuth, async (req, res) => {
  try {
    const completeToDos = await Todo.find({
      user: req.user._id,
      complete: true
    }).sort({ completedAt: -1 })

    const incompleteToDos = await Todo.find({
      user: req.user._id,
      completed: false
    }).sort({ completedAt: -1 })

    // Why does this output an array ?
    return res.json({ incomplete: incompleteToDos, complete: completeToDos })
  } catch (err) {
    console.log(err)
    res.status(400).send(err.message)
  }
})

module.exports = router
