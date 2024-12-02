import React, { useEffect, useState } from 'react'
import { message, notification } from "antd"
import "./Register.css"
import { useAppContext } from '../../../AppContext'
import { generatePassword } from '../../../utils/SecurePasswords'
import OpenEye from '../../../assets/OpenEye'
import CloseEye from '../../../assets/CloseEye'
function Register({ changeOption }) {
    const { registerBusiness } = useAppContext()

    const [values, setValues] = useState({
        email: "",
        username: "",
        userdni: "",
        psw: "",
        double_psw: ""
    })

    const [sendingValues, setSendingValues] = useState(false)
    const [showPassword, setShowPassword] = useState(false);

    const onChangeValues = (e) => {
        const { name, value } = e.target
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }))
    }

    const sendValues = async (e) => {
        e.preventDefault();
        setSendingValues(true);

        try {
            // Validación de campos
            for (const key in values) {
                if (values[key].trim() === "") {
                    throw new Error(`El campo "${key}" está vacío. Por favor, complétalo.`);
                }
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
                throw new Error("El formato del correo es inválido.");
            }

            if (values.psw !== values.double_psw) {
                throw new Error("Las contraseñas no coinciden. Por favor, verifica e inténtalo nuevamente.");
            }

            const formData = new FormData();
            for (const key in values) {
                formData.append(key, values[key]);
            }

            const result = await registerBusiness(formData);

            if (result) {
                notification.success({
                    message: "Registro exitoso",
                    description: "¡Tu cuenta fue creada con éxito!",
                    duration: 3,
                });
                setValues({ email: "", username: "", psw: "", double_psw: "", userdni: "" });
                changeOption(0); 
            }
        } catch (error) {
            notification.error({
                message: "Error al registrarse",
                description: error.message,
                duration: 3,
            });
        } finally {
            setSendingValues(false);
        }
    };

    function GeneratePassword() {
        const securepsw = generatePassword()
        setValues((prevValues) => ({
            ...prevValues,
            psw: securepsw,
            double_psw: securepsw
        }))
    }
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    return (
        <React.Fragment>
            <div id="register-container">
                <h1 id='register-title'>Bienvenido a Fynka, que gusto tenerte aquí</h1>
                <form id="form-register-wrapper" onSubmit={sendValues}>
                    <h3>Registrarme en Fynka</h3>
                    <label htmlFor="email" className='register-label'>Correo:
                        <input type="email" id='email' name='email' placeholder='Ingresá tu correo' value={values.email} onChange={onChangeValues} />
                    </label>
                    <label htmlFor="email" className='register-label'>Nombre completo:
                        <input type="text" id='username' name='username' placeholder='Ingresá tu nombre' value={values.username} onChange={onChangeValues} />
                    </label>

                    <label htmlFor="email" className='register-label'>DNI:
                        <input type="text" id='userdni' name='userdni' placeholder='Ingresá tu DNI' value={values.userdni} onChange={onChangeValues} />
                    </label>

                    <label htmlFor="email" className='register-label password'>Contraseña:
                        <input type={showPassword ? "text" : "password"} id='psw' name='psw' placeholder='Ingresá tu contraseña' value={values.psw} onChange={onChangeValues} />
                        <span className="showPswRegister" onClick={toggleShowPassword}>
                                {showPassword ? <CloseEye /> : <OpenEye />}
                            </span>
                    </label>
                    
                    <button id='secure-psw-btn' type='button' onClick={() => GeneratePassword()}>Generar contraseña segura</button>
                    <label htmlFor="email" className='register-label'>Una vez más:
                        <input type={showPassword ? "text" : "password"} id='double_psw' name='double_psw' placeholder='Ingresá tu contraseña una vez más' value={values.double_psw} onChange={onChangeValues} />
                    </label>
                    <div className="form-buttons__wrapper">
                        <button id='btn-register' type='submit'>Registrarme</button>
                        <button id='goToLogin-btn' type='button' onClick={() => changeOption(0)}>Iniciar sesión</button>
                    </div>
                </form>
            </div>
        </React.Fragment>
    )
}

export default Register