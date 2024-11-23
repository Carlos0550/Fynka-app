import { createContext, useContext } from "react";
import { baseUrl } from "./api";
import { message, notification } from "antd";
import { apiResponses } from "./apiTexts";

const AppContext = createContext()

export const useAppContext = () => {
    const ctx = useContext(AppContext)
    if (!ctx) throw new Error("UseAppContext must be used within a AppProvider")
    return ctx
}

export const AppContextProvider = ({ children }) => {
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

    const login = async (loginData) => {
        try {
            const response = await fetch(`${baseUrl.api}/login-user`, {
                method: "POST",
                body: loginData
            })

            const data = await response.json()
            if(response.status === 404){
                notification.error({
                    message: "Usuario o contraseña inválido",
                    duration: 3,
                    pauseOnHover: false,
                    showProgress: true
                });
                return;
            };
            if(response.status === 401){
                notification.error({
                    message: data.msg,
                    duration: 3,
                    pauseOnHover: false,
                    showProgress: true
                });
                return;
            };
            if (!response.ok) throw new Error(data.msg)
            message.success(`${data.msg}`)
        console.log(data)
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

    return (
        <AppContext.Provider
            value={{
                registerBusiness,login
            }}
        >
            {children}
        </AppContext.Provider>
    )
}