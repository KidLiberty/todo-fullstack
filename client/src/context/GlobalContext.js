import { createContext, useContext, useReducer } from 'react'
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
    default:
      return state
  }
}

// Create Global Context
export const GlobalContext = createContext()

// Provider Component
export const GlobalProvider = props => {
  const [state, dispatch] = useReducer(globalReducer, initialState)

  const value = {
    ...state
  }

  // Action: Get current user
  return (
    <GlobalContext.Provider value={value}>
      {props.children}
    </GlobalContext.Provider>
  )
}

export function useGlobalContext() {
  return useContext(GlobalContext)
}
