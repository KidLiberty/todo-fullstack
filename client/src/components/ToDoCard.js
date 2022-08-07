import React, { useState, useRef } from 'react'
import axios from 'axios'
import { useGlobalContext } from '../context/GlobalContext'

const ToDoCard = ({ toDo }) => {
  const [content, setContent] = useState(toDo.content)
  const [editing, setEditing] = useState(false)
  const inputRef = useRef(null)
  const { toDoComplete, toDoIncomplete, removeToDo, updateTodo } =
    useGlobalContext()

  const onEdit = e => {
    e.preventDefault()
    setEditing(true)
    inputRef.current.focus()
  }

  const stopEditing = e => {
    if (e) {
      e.preventDefault()
    }
    setEditing(false)
    setContent(toDo.content)
  }

  const markAsComplete = e => {
    e.preventDefault()
    axios.put(`/api/todos/${toDo._id}/complete`).then(res => {
      toDoComplete(res.data)
    })
  }

  const markAsIncomplete = e => {
    e.preventDefault()
    axios.put(`/api/todos/${toDo._id}/incomplete`).then(res => {
      toDoIncomplete(res.data)
    })
  }

  const deleteToDo = e => {
    e.preventDefault()

    if (window.confirm('Are you sure you would like to delete this ToDo?')) {
      axios.delete(`/api/todos/${toDo._id}`).then(res => {
        removeToDo(res.data)
      })
    }
  }

  const editTodo = e => {
    e.preventDefault()
    axios
      .put(`/api/todos/${toDo._id}`, { content })
      .then(res => {
        updateTodo(res.data)
        setEditing(false)
      })
      .catch(() => {
        stopEditing()
      })
  }

  return (
    <div className={`todo ${toDo.complete ? 'todo__complete' : ''}`}>
      <input
        type='checkbox'
        checked={toDo.complete}
        onChange={!toDo.complete ? markAsComplete : markAsIncomplete}
      />
      <input
        type='text'
        ref={inputRef}
        value={content}
        readOnly={!editing}
        onChange={e => setContent(e.target.value)}
      />
      <div className='todo__controls'>
        {!editing ? (
          <>
            {!toDo.complete && <button onClick={onEdit}>Edit</button>}
            <button onClick={deleteToDo}>Delete</button>
          </>
        ) : (
          <>
            <button onClick={stopEditing}>Cancel</button>
            <button onClick={editTodo}>Save</button>
          </>
        )}
      </div>
    </div>
  )
}

export default ToDoCard
