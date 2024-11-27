import { createContext, useContext, useEffect, useRef, useState } from "react";
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
            const response = await fetch(`${baseUrl.api}/create-user`, {
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

    const [loginUserData, setLoginUserData] = useState(null)
    const login = async (loginData) => {
        const maxAttempts = 2
        let attemps = 0
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

        while (attemps <= maxAttempts) {
            attemps += 1
            try {
                const response = await fetch(`${baseUrl.api}/login-user`, {
                    method: "POST",
                    body: loginData
                })

                const data = await response.json()
                if (response.status === 404) {
                    notification.error({
                        message: "Usuario o contraseña inválido",
                        duration: 3,
                        pauseOnHover: false,
                        showProgress: true
                    });
                    return false;
                };
                if (response.status === 401) {
                    notification.error({
                        message: data.msg,
                        duration: 3,
                        pauseOnHover: false,
                        showProgress: true
                    });
                    return false;
                };
                if (!response.ok) throw new Error(data.msg)
                message.success(`${data.msg}`)
                setLoginUserData(data.usrData)
                const dataUser = JSON.parse(localStorage.getItem("userdata"))
                if (!dataUser) {
                    localStorage.setItem("userdata", JSON.stringify(data.usrData));
                } else {
                    localStorage.removeItem("userdata");
                    localStorage.setItem("userdata", JSON.stringify(data.usrData));
                }
                return true
            } catch (error) {
                console.log(error)
                if (attemps >= maxAttempts) {
                    notification.error({
                        message: "No se pudo procesar la solicitud",
                        description: error.message || apiResponses.error,
                        duration: 4,
                        pauseOnHover: false
                    });
                    return false
                }
            };
            await delay(3000)
        };
    };

    const [notLogged, setNotLogged] = useState(false);
    const alreadyShownMessage = useRef(false);

    const verifyAuthUser = async () => {
        const userData = localStorage.getItem("userdata");

        const maxAttempts = 2;
        let attempts = 0;
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

                    if (response.status === 401) {
                        if (!alreadyShownMessage.current) {
                            alreadyShownMessage.current = true;
                            notification.success({ message: "Sesión caducada" });
                        }
                        setNotLogged(true);
                        navigate("/");
                        break;
                    }

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData?.msg || "No se pudo verificar su sesión, Por favor, inicie sesión nuevamente.");
                    }

                    if (!loginUserData) setLoginUserData(JSON.parse(userData));
                    break;
                } else {
                    console.log("No hay datos en el local storage, termina el bucle");
                    break;
                }
            } catch (error) {
                console.error(error);
                attempts += 1;

                if (attempts >= maxAttempts && !alreadyShownMessage.current) {
                    notification.error({
                        message: error.status === 401 ? "Sesión expirada" : "Error al intentar iniciar sesión",
                        description: error.message || "Error desconocido",
                        duration: 5,
                        showProgress: true,
                        pauseOnHover: false,
                    });
                }

                await delay(3000);

                if (attempts >= maxAttempts) {
                    alreadyShownMessage.current = true;
                    navigate("/");
                }
            }
        }
    };

    const saveBranch = async (branchValues) => {
        try {
            const response = await fetch(`${baseUrl.api}/save-branch`, {
                method: "POST",
                body: branchValues
            });

            if (!response.ok) {
                let errorData = {}
                try {
                    errorData = await response.json()
                } catch (error) {
                    console.log(error)
                }

                return notification.error({ message: errorData.msg || "No fue posible completar la solicitud" })
            }
            const data = await response.json()
            notification.success({ message: data.msg })
            await getAllBranches()
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "Error al guardar la sucursal",
                description: error.message || "Error desconocido",
                duration: 5,
                showProgress: true,
                pauseOnHover: false,
            });
            return false
        }
    }

    const [sucursales, setSucursales] = useState([])

    const getAllBranches = async () => {
        if (!loginUserData?.id) {
            notification.warning({
                message: "Usuario no listo",
                description: "Es posible que las sucursales no se carguen, espere mientras cargamos los datos de su usuario, luego de este mensaje podrá reintentar esta operación",
                duration: 5
            });
            return false;
        }

        try {
            const response = await fetch(`${baseUrl.api}/get-branches/${loginUserData.id}`);
            if (!response.ok) {
                const responseData = await response.json();
                throw new Error(responseData.msg || "Error en la solicitud.");
            }

            const responseData = await response.json();
            setSucursales(responseData.sucursales);
            return true;
        } catch (error) {
            console.error("Error al obtener sucursales:", error);
            notification.error({
                message: "Error al obtener las sucursales",
                description: error.message || "Error desconocido.",
            });
            return false;
        }
    };

    const deleteBranch = async (branchId) => {
        if (!branchId) return notification.error({ message: "Ocurrió algo inesperado al intentar eliminar la sucuresal" })
        try {
            const response = await fetch(`${baseUrl.api}/delete-branch/${branchId}`,{
                method: "DELETE"
            })
            const responseData = await response.json()

            if (!response.ok) throw new Error(responseData.msg)
            await getAllBranches()
            message.success(`${response.msg}`)

        }catch (error) {
            console.log(error)
            notification.error({
                message: "Error al eliminar la sucursal",
                description: error.message || "Error desconocido",
                duration: 5,
                showProgress: true,
                pauseOnHover: false,
            });
            return false
        }
    }
    return (
        <AppContext.Provider
            value={{
                registerBusiness, login, loginUserData,
                verifyAuthUser, saveBranch, notLogged,
                getAllBranches, sucursales, deleteBranch
            }}
        >
            {children}
        </AppContext.Provider>
    )
}