import React, { useEffect } from 'react'
import { useGlobalContext } from '../context/GlobalContext'
import { useNavigate } from 'react-router-dom'
import ToDoCard from './ToDoCard'

const Dashboard = () => {
  const { user, completeToDos, incompleteToDos } = useGlobalContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user && navigate) {
      navigate('/')
    }
  }, [user, navigate])

  return (
    <div className='dashboard'>
      <div className='todos'>
        {incompleteToDos.map(toDo => {
          return <ToDoCard key={toDo._id} toDo={toDo} />
        })}
      </div>

      {completeToDos.length > 0 && (
        <div className='todos'>
          <h1 className='todos__title'>Complete Todos</h1>
          {completeToDos.map(toDo => {
            return <ToDoCard key={toDo._id} toDo={toDo} />
          })}
        </div>
      )}
    </div>
  )
}

export default Dashboard
