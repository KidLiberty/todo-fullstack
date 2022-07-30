import { createContext, useContext, useEffect, useReducer } from 'react'
import axios from 'axios'

// Initial State
const initialState = {
  user: null,
  fetchingUser: true,
  completeToDos: [],
  incompleteToDos: []
}

// Reducer
const globalReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, fetchingUser: false }
    case 'SET_COMPLETE_TODOS':
      return { ...state, completeToDos: action.payload }
    case 'SET_INCOMPLETE_TODOS':
      return { ...state, incompleteToDos: action.payload }
    case 'RESET_USER':
      return {
        ...state,
        user: null,
        fetchingUser: false,
        completeToDos: [],
        incompleteToDos: []
      }
    default:
      return state
  }
}

// Create Global Context
export const GlobalContext = createContext()

// Provider Component
export const GlobalProvider = props => {
  const [state, dispatch] = useReducer(globalReducer, initialState)

  useEffect(() => {
    getCurrentUser()
  }, [])

  // Action: Get current user
  const getCurrentUser = async () => {
    try {
      const res = await axios.get('/api/auth/current')

      if (res.data) {
        const toDosRes = axios.get('/api/todos/current')

        if (toDosRes.data) {
          dispatch({ type: 'SET_USER', payload: res.data })
          dispatch({
            type: 'SET_COMPLETE_TODOS',
            payload: toDosRes.data.complete
          })
          dispatch({
            type: 'SET_INCOMPLETE_TODOS',
            payload: toDosRes.data.incomplete
          })
        }
      } else {
        dispatch({ type: 'RESET_USER' })
      }
    } catch (err) {
      console.log(err)
      dispatch({ type: 'RESET_USER' })
    }
  }

  const logout = async () => {
    try {
      await axios.put('/api/auth/logout')

      dispatch({ type: 'RESET_USER' })
    } catch (err) {
      console.log(err)
      dispatch({ type: 'RESET_USER' })
    }
  }

  const GlobalContextValue = {
    ...state,
    getCurrentUser,
    logout
  }

  return (
    <GlobalContext.Provider value={GlobalContextValue}>
      {props.children}
    </GlobalContext.Provider>
  )
}

export function useGlobalContext() {
  return useContext(GlobalContext)
}
