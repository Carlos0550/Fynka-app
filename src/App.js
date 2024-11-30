import React from 'react'
import "./App.css"
import { Routes, Route } from "react-router-dom"
import AuthWrapper from './pages/Auth/AuthWrapper'
import Dashboard from './pages/dashboard/Dashboard'
import ClientsManager from './pages/Clientes/ClientsManager'
import SucursalesManager from './pages/Sucursales/SucursalesManager'
import UsersManager from './pages/Usuarios/UsersManager'
function App() {
  return (
    <Routes>
      <Route path='/' element={<AuthWrapper/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/clientes/*' element={<ClientsManager/>}/>
      <Route path='/sucursales' element={<SucursalesManager/>}/>
      <Route path='/usuarios' element={<UsersManager/>}/>
    </Routes>
  )
}

export default App