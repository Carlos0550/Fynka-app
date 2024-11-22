import React from 'react'
import "./App.css"
import { Routes, Route } from "react-router-dom"
import AuthWrapper from './pages/AuthWrapper'
function App() {
  return (
    <Routes>
      <Route path='/' element={<AuthWrapper/>}/>
    </Routes>
  )
}

export default App