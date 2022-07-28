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

// @route PUT api/todos/:toDoId/complete
// @desc Mark a ToDo as complete
// @access Private

router.put('/:toDoId/complete', requiresAuth, async (req, res) => {
  try {
    const toDo = await Todo.findOne({
      user: req.user._id,
      _id: req.params.toDoId // /:toDoId parameter
    })

    if (!toDo) {
      return res.status(404).json({ error: 'ToDo not found.' })
    }

    // Already complete?
    if (toDo.complete) {
      return res.status(400).json({ error: 'ToDo is already complete.' })
    }

    /* 
     Update ToDo - second {} param is telling DB what to update
     { new: true } returns the new object and not the old
    */
    const updateToDo = await Todo.findOneAndUpdate(
      {
        user: req.user._id,
        _id: req.params.toDoId
      },
      { complete: true, completedAt: new Date() },
      { new: true }
    )

    return res.json(updateToDo)
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
})

// @route PUT api/todos/:toDoId/incomplete
// @desc Mark a ToDo as incomplete
// @access Private

router.put('/:toDoId/incomplete', requiresAuth, async (req, res) => {
  try {
    const toDo = await Todo.findOne({
      user: req.user._id,
      _id: req.params.toDoId
    })

    if (!toDo) {
      return res.status(404).json({ error: 'Todo not found.' })
    }

    if (!toDo.complete) {
      return res.status(400).json({ error: 'Todo is already incomplete.' })
    }

    const updateToDo = await Todo.findOneAndUpdate(
      {
        user: req.user._id,
        _id: req.params.toDoId
      },
      { complete: false, completedAt: null },
      { new: true }
    )
    return res.json(updateToDo)
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
})

// @route PUT api/todos/:toDoId
// @desc Update a a ToDo
// @access Private

router.put('/:toDoId', requiresAuth, async (req, res) => {
  try {
    const toDo = await Todo.findOne({
      user: req.user._id,
      _id: req.params.toDoId
    })

    if (!toDo) {
      return res.status(404).json({ error: 'ToDo not found.' })
    }

    const { errors, isValid } = validateToDoInput(req.body)

    if (!isValid) {
      res.status(400).json(errors)
    }

    const updatedToDo = await Todo.findOneAndUpdate(
      {
        user: req.user._id,
        _id: req.params.toDoId
      },
      { content: req.body.content },
      { new: true }
    )

    return res.json(updatedToDo)
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
})

// @route DELETE api/todos/:toDoId/delete
// @desc Delete a ToDo
// @access Private

router.delete('/:toDoId/delete', requiresAuth, async (req, res) => {
  try {
    const toDo = await Todo.findOne({
      user: req.user._id,
      _id: req.params.toDoId
    })

    if (!toDo) {
      return res.status(404).json({ error: 'ToDo not found.' })
    }

    const deleteTodo = await Todo.findByIdAndDelete({
      user: req.body._id,
      _id: req.params.toDoId
    })
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
})

module.exports = router
