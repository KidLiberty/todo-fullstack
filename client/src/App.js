import React from 'react'
import './main.scss'
import { GlobalProvider } from './context/GlobalContext'

import Layout from './components/Layout'

function App() {
  return (
    <GlobalProvider>
      <Layout />
    </GlobalProvider>
  )
}

export default App
