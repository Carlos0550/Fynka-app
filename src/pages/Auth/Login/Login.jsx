import React, { useEffect, useState } from 'react';
import { message, notification, Spin } from "antd";
import { useAppContext } from "../../../AppContext.js";
import { useNavigate } from 'react-router-dom';
import OpenEye from "../../../assets/OpenEye";
import CloseEye from "../../../assets/CloseEye"; // Un ícono de ojo cerrado que debes agregar
import "./Login.css";

function Login({ changeOption }) {
    const { login, loginUserData, retryCountDown, serverWithDelay } = useAppContext();
    const navigate = useNavigate();

    const [values, setValues] = useState({
        email: "",
        psw: "",
    });
    const [sendingValues, setSendingValues] = useState(false);
    const [userLoged, setUserLoged] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setUserLoged(!!loginUserData.id);
    }, [loginUserData]);

    const onChangeValues = (e) => {
        const { name, value } = e.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const sendValues = async (e) => {
        e.preventDefault();
        setSendingValues(true);

        try {
            if (values.email.trim() === "") throw new Error("El email es requerido.");
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
                throw new Error("El formato del correo es inválido.");
            }
            if (values.psw.trim() === "") throw new Error("La contraseña no puede estar vacía.");

            const formData = new FormData();
            for (const key in values) {
                formData.append(key, values[key]);
            }

            const result = await login(formData);

            if (result) {
                setValues({ email: "", psw: "" }); 
                navigate("/dashboard"); 
            }
        } catch (error) {
            notification.error({
                message: "Error al iniciar sesión",
                description: error.message,
                duration: 3,
                showProgress: true,
                pauseOnHover: false,
            });
        } finally {
            setSendingValues(false);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <React.Fragment>
            <div id="login-container">
                <h1 id="register-title">¡Hola de nuevo!</h1>
                <form id="form-register-wrapper" onSubmit={sendValues}>
                    <h3>Iniciar sesión en Fynka</h3>
                    
                    <label htmlFor="email" className="register-label">
                        Correo:
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Ingresá tu correo"
                            value={values.email}
                            onChange={onChangeValues}
                            disabled={userLoged}
                        />
                    </label>
                    
                    <label htmlFor="psw" className="register-label">
                        Contraseña:
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="psw"
                                name="psw"
                                placeholder="Ingresá tu contraseña"
                                value={values.psw}
                                onChange={onChangeValues}
                                disabled={userLoged}
                            />
                            <span className="showPsw" onClick={toggleShowPassword}>
                                {showPassword ? <CloseEye /> : <OpenEye />}
                            </span>
                        </div>
                    </label>

                    {serverWithDelay && (
                        <p style={{ color: "red" }}>Reintentar en {retryCountDown}</p>
                    )}

                    <div className="form-buttons__wrapper">
                        {userLoged ? (
                            <button
                                id="btn-login"
                                type="button"
                                onClick={() => navigate("/dashboard")}
                            >
                                Ir al dashboard
                            </button>
                        ) : (
                            <>
                                {!serverWithDelay && (
                                    <React.Fragment>
                                        <button
                                            id="btn-login"
                                            type="submit"
                                            disabled={serverWithDelay || sendingValues}
                                        >
                                            {sendingValues ? <Spin size="small" /> : "Iniciar sesión"}
                                        </button>
                                        <button
                                            id="goToLogin-btn"
                                            type="button"
                                            onClick={() => changeOption(1)}
                                        >
                                            Crear cuenta
                                        </button>
                                    </React.Fragment>
                                )}
                            </>
                        )}
                    </div>
                </form>
            </div>
        </React.Fragment>
    );
}

export default Login;
