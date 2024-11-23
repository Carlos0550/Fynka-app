import React, { useEffect } from 'react'
import "./Dashboard.css"
import { useAppContext } from '../../AppContext'
function Dashboard() {
    const { loginUserData, verifyAuthUser } = useAppContext()
    
    useEffect(()=>{
        verifyAuthUser()
    },[])

    
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard