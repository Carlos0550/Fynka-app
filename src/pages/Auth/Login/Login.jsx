import React, { useEffect, useState } from 'react'
import { message, notification, Spin } from "antd"
import "./Login.css"
import { useAppContext } from "../../../AppContext.js"


import OpenEye from "../../../assets/OpenEye"
import { useNavigate } from 'react-router-dom'
import { baseUrl } from '../../../api.js'
function Login({ changeOption }) {
    const { login, verifyAuthUser, loginUserData } = useAppContext()
    const navigate = useNavigate()
    const [values, setValues] = useState({
        email: "",
        username: "",
        psw: "",
    })

    const [sendingValues, setSendingValues] = useState(false)
    const [useUsername, setUseUsername] = useState(false)
    const [userLoged, setUserLoged] = useState(Boolean(false))

    useEffect(() => {
        if (loginUserData) setUserLoged(true)
    }, [loginUserData])
    const onChangeValues = (e) => {
        const { name, value } = e.target
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }))
    }

    const sendValues = async (e) => {
        e.preventDefault()
        setSendingValues(true)
        try {
            if (useUsername && values.username.trim() === "") throw new Error("El nombre de usuario es requerido")
            if (!useUsername && values.email.trim() === "") throw new Error("El email es requerido")
            if (values.psw.trim() === "") throw new Error("La contraseña no puede estar vacia")

            const formData = new FormData()

            for (const key in values) {
                formData.append(key, values[key])
            }

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
        } finally {
            setSendingValues(false)
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

    useEffect(() => {
        verifyAuthUser()
    }, [])
    return (
        <React.Fragment>
            <div id="login-container">
                <h1 id='register-title'>Hola de nuevo!</h1>
                <form id="form-register-wrapper" onSubmit={sendValues}>
                    <h3>Iniciar sesión en Fynka</h3>
                    <label htmlFor="email" className='register-label'>Correo:
                        <input type="email" id='email' name='email' placeholder='Ingresá tu correo' value={values.email} onChange={onChangeValues} disabled={userLoged} />
                    </label>
                    <label htmlFor="email" className='register-label'>Contraseña:
                        <input type="password" id='psw' name='psw' placeholder='Ingresá tu contraseña' value={values.psw} onChange={onChangeValues} disabled={userLoged} />
                        <span className='showPsw' onClick={toggleShowPassword}><OpenEye /></span>
                    </label>
                    <div className="form-buttons__wrapper">
                        {userLoged ? <button id='btn-login' onClick={() => navigate("/dashboard")}>Ir al dashboard</button>
                            :
                            <>
                                <button id='btn-login' type='submit'>{sendingValues ? <Spin size='small' /> : "Iniciar sesión"}</button>
                                <button id='goToLogin-btn' type='button' onClick={() => changeOption(1)}>Crear cuenta</button>
                            </>

                        }
                    </div>
                </form>
            </div>
        </React.Fragment>
    )
}

export default Login