import React, { useState } from 'react'
import Register from './Register/Register'
import Login from './Login/Login'
import "./AuthWrapper.css"
function AuthWrapper() {
    const [selectedOption, setSelectedOption] = useState(0)

    const RenderForms = ()=>{
        switch (selectedOption) {
            case 0:
                return(
                    <Login changeOption={()=>setSelectedOption(1)}/>
                )
            case 1:
                return(
                    <Register changeOption={()=> setSelectedOption(0)}/>
                )
            default:
                break;
        }
    }
  return (
    <div id='register-wrapper'>
        {RenderForms()}
    </div>
  )
}

export default AuthWrapper