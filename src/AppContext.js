import { createContext, useContext, useRef, useState } from "react";
import { baseUrl } from "./api";
import { message, notification } from "antd";
import { apiResponses } from "./apiTexts";
import { useNavigate } from "react-router-dom";

const AppContext = createContext()

export const useAppContext = () => {
    const ctx = useContext(AppContext)
    if (!ctx) throw new Error("UseAppContext must be used within a AppProvider")
    return ctx
}

export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate()

    const registerBusiness = async (registerData) => {
        try {
            const response = await fetch(`${baseUrl.api}/create-administrator`, {
                method: "POST",
                body: registerData
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.msg)
            notification.success({
                message: "Gracias por registrarte en Fynka",
                description: "Ahora puedes iniciar sesión con los datos que proporcionaste.",
                duration: 5,
                pauseOnHover: false
            });
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No se pudo procesar la solicitud",
                description: error.message || apiResponses.error,
                duration: 4,
                pauseOnHover: false
            });

            return false
        }
    }

    const [loginUserData, setLoginUserData] = useState(null);

    const login = async (loginData) => {
        let attempts = 0;
        const maxAttempts = 2; 
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        while (attempts < maxAttempts) {
            try {
                const response = await fetch(`${baseUrl.api}/login-user`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(loginData), 
                });

                const data = await response.json();

                if (response.status === 404) {
                    notification.error({
                        message: "Usuario o contraseña inválido",
                        duration: 3,
                        pauseOnHover: false,
                        showProgress: true,
                    });
                    return false;
                }

                if (response.status === 401) {
                    notification.error({
                        message: data.msg,
                        duration: 3,
                        pauseOnHover: false,
                        showProgress: true,
                    });
                    return false;
                }

                if (!response.ok) throw new Error(data.msg);

                message.success(`${data.msg}`);
                setLoginUserData(data.usrData);

                localStorage.setItem("userdata", JSON.stringify(data.usrData));
                return true; 

            } catch (error) {
                attempts += 1;
                console.error(`Intento ${attempts} fallido:`, error.message);

                if (attempts >= maxAttempts) {
                    notification.error({
                        message: "No se pudo procesar la solicitud",
                        description: error.message || "Error desconocido",
                        duration: 4,
                        pauseOnHover: false,
                    });
                    return false;
                }

                await delay(2000);
            }
        };
    };

    const alreadyVerified = useRef(false)
    const verifyAuthUser = async () => {
        if (!alreadyVerified.current) {
            const userData = localStorage.getItem("userdata");
            alreadyVerified.current = true

            let attempts = 0
            const maxAttempts = 2
            const delai = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

            while (attempts < maxAttempts) {
                try {
                    if (userData) {
                        const parseData = JSON.parse(userData);
                        if (!parseData.nombre_usuario || !parseData.email) {
                            throw new Error("No se pudo verificar su sesión, Por favor, inicie sesión nuevamente.");
                        }

                        const response = await fetch(
                            `${baseUrl.api}/verifyAuthUser?username=${encodeURIComponent(parseData.nombre_usuario)}&email=${encodeURIComponent(parseData.email)}`
                        );

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData?.msg || "No se pudo verificar su sesión, Por favor, inicie sesión nuevamente.");
                        }
                        if (!loginUserData) setLoginUserData(userData)
                        message.success("Bienvenido nuevamente.");
                        return true
                    }
                } catch (error) {
                    console.error(error);
                    attempts += 1

                    if (attempts >= maxAttempts) {
                        navigate("/")
                        notification.error({
                            message: error.status === 401 ? "Sesión expirada" : "Error al intentar iniciar sesión",
                            description: error.message || apiResponses.error,
                            duration: 5,
                            showProgress: true,
                            pauseOnHover: false,
                        });
                        return false
                    }

                    await delai(2000)
                }
            }
        }
    };


    return (
        <AppContext.Provider
            value={{
                registerBusiness, login, loginUserData,
                verifyAuthUser
            }}
        >
            {children}
        </AppContext.Provider>
    )
}