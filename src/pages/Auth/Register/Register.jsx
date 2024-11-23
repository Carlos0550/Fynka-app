import React, { useEffect, useState } from 'react'
import { message, notification } from "antd"
import "./Register.css"
import { useAppContext } from '../../../AppContext'

function Register({changeOption}) {
    const { registerBusiness } = useAppContext()

    const [values, setValues] = useState({
        email: "",
        username: "",
        psw: "",
        double_psw: ""
    })

    const [sendingValues, setSendingValues] = useState(false)

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
            for (const key in values) {
                if (values[key] === "") {
                    throw new Error("Uno de los campos están vacios, corrobore que todo esté completo")
                }
            }
            const formData = new FormData()

            for (const key in values) {
                formData.append(key, values[key])
            }
            setSendingValues(false)
            const result = await registerBusiness(formData)

            if(result){
                for(const key in values){
                    setSendingValues(prevValues=>({
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
    return (
        <React.Fragment>
                <div id="register-container">
                    <h1 id='register-title'>Bienvenido a Fynka, que gusto tenerte aquí</h1>
                    <form id="form-register-wrapper" onSubmit={sendValues}>
                        <h3>Registrarme en Fynka</h3>
                        <label htmlFor="email" className='register-label'>Correo:
                            <input type="email" id='email' name='email' placeholder='Ingresá tu correo' value={values.email} onChange={onChangeValues} />
                        </label>
                        <label htmlFor="email" className='register-label'>Usuario:
                            <input type="text" id='username' name='username' placeholder='Ingresá algún usuario' value={values.username} onChange={onChangeValues} />

                        </label>
                        <label htmlFor="email" className='register-label'>Contraseña:
                            <input type="password" id='psw' name='psw' placeholder='Ingresá tu contraseña' value={values.psw} onChange={onChangeValues} />
                        </label>
                        <label htmlFor="email" className='register-label'>Una vez más:
                            <input type="password" id='double_psw' name='double_psw' placeholder='Ingresá tu contraseña una vez más' value={values.double_psw} onChange={onChangeValues} />
                        </label>
                        <div className="form-buttons__wrapper">
                            <button id='btn-register' type='submit'>Registrarme</button>
                            <button id='goToLogin-btn' type='button' onClick={()=>changeOption(0)}>Iniciar sesión</button>
                        </div>
                    </form>
                </div>
        </React.Fragment>
    )
}

export default Register