const { Schema, model } = require('mongoose')

const ToDoSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      type: String,
      required: true
    },
    complete: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date
    }
  },
  { timestamps: true }
)

// Create model 'ToDo' using ToDoSchema
const ToDo = model('ToDo', ToDoSchema)
module.exports = ToDo
