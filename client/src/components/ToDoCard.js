import React, { useState, useRef } from 'react'
import axios from 'axios'

const ToDoCard = ({ toDo }) => {
  const [content, setContent] = useState(toDo.content)
  const [editing, setEditing] = useState(false)
  const inputRef = useRef(null)

  const onEdit = e => {
    e.preventDefault()
    setEditing(true)
    inputRef.current.focus()
  }

  const stopEditing = () => {
    setEditing(false)
    setContent(toDo.content)
    inputRef.current.blur()
  }

  const saveEdit = () => {
    axios.put()
  }

  return (
    <div className={`todo ${toDo.complete ? 'todo__complete' : ''}`}>
      <input type='checkbox' checked={toDo.complete} />
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
            <button>Delete</button>
          </>
        ) : (
          <>
            <button onClick={stopEditing}>Cancel</button>
            <button onClick={saveEdit}>Save</button>
          </>
        )}
      </div>
    </div>
  )
}

export default ToDoCard
