import React, { useEffect, useState } from 'react'
import { message, notification } from "antd"
import "./Login.css"
import { useAppContext } from '../../AppContext'

import OpenEye from "../../assets/OpenEye"
function Login({ changeOption }) {
    const { login } = useAppContext()

    const [values, setValues] = useState({
        email: "",
        username: "",
        psw: "",
    })

    const [sendingValues, setSendingValues] = useState(false)
    const [useUsername, setUseUsername] = useState(false)

    const onChangeValues = (e) => {
        const { name, value } = e.target
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }))
    }

    const sendValues = async (e) => {
        e.preventDefault()

        try {
            if (useUsername && values.username.trim() === "") throw new Error("El nombre de usuario es requerido")
            if (!useUsername && values.email.trim() === "") throw new Error("El email es requerido")
            if (values.psw.trim() === "") throw new Error("La contraseña no puede estar vacia")

            const formData = new FormData()

            for (const key in values) {
                formData.append(key, values[key])
            }
            setSendingValues(false)
            const result = await login(formData)

            if (result) {
                for (const key in values) {
                    setSendingValues(prevValues => ({
                        ...prevValues,
                        [key]: ""
                    }))
                }
            }
        } catch (error) {
            notification.error({
                message: "Error al enviar sus datos",
                description: error.message,
                duration: 3,
                showProgress: true,
                pauseOnHover: false
            })
        }
    }

    const toggleShowPassword = () => {
        const pwsInput = document.getElementById("psw")
        if (pwsInput) {
            const inputType = pwsInput.getAttribute("type")
            if (inputType === "password") pwsInput.setAttribute("type", "text")
            else pwsInput.setAttribute("type", "password")
        }
    }
    return (
        <React.Fragment>
            <div id="login-container">
                <h1 id='register-title'>Hola de nuevo!</h1>
                <form id="form-register-wrapper" onSubmit={sendValues}>
                    <h3>Iniciar sesión en Fynka</h3>
                    {!useUsername && (
                        <label htmlFor="email" className='register-label'>Correo:
                            <input type="email" id='email' name='email' placeholder='Ingresá tu correo' value={values.email} onChange={onChangeValues} />
                            <button id='toggleUserName-btn' onClick={() => setUseUsername(!useUsername)}>Usar alias</button>
                        </label>
                    )}
                    {useUsername && (
                        <label htmlFor="email" className='register-label'>Usuario:
                            <input type="text" id='username' name='username' placeholder='Ingresá algún usuario' value={values.username} onChange={onChangeValues} />
                            <button id='toggleUserName-btn' onClick={() => setUseUsername(!useUsername)}>Usar correo</button>
                        </label>
                    )}
                    <label htmlFor="email" className='register-label'>Contraseña:
                        <input type="password" id='psw' name='psw' placeholder='Ingresá tu contraseña' value={values.psw} onChange={onChangeValues} />
                        <span className='showPsw' onClick={toggleShowPassword}><OpenEye /></span>
                    </label>
                    <div className="form-buttons__wrapper">
                        <button id='btn-login' type='submit'>Iniciar sesión</button>
                        <button id='goToLogin-btn' type='button' onClick={() => changeOption(1)}>Crear cuenta</button>
                    </div>
                </form>
            </div>
        </React.Fragment>
    )
}

export default Login