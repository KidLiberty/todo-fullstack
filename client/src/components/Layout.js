import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Header from './Header'
import AuthBox from './AuthBox'

const Layout = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path='/' element={<AuthBox />} />
        <Route path='/test' element={<h1>Test</h1>} />
      </Routes>
    </Router>
  )
}

export default Layout
