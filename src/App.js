import React from 'react'
import "./App.css"
import { Routes, Route } from "react-router-dom"
import AuthWrapper from './pages/Auth/AuthWrapper'
import Dashboard from './pages/dashboard/Dashboard'
function App() {
  return (
    <Routes>
      <Route path='/' element={<AuthWrapper/>}/>
      <Route path='/dashboard/*' element={<Dashboard/>}/>
    </Routes>
  )
}

export default App