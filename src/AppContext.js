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

    const [loginUserData, setLoginUserData] = useState({});
    const login = async (loginData) => {
        try {
            const response = await fetch(`${baseUrl.api}/login-user`, {
                method: "POST",
                body: loginData,
            });

            const data = await response.json();

            notification.info({
                message: "Procesando inicio de sesión...",
                duration: 2,
                pauseOnHover: true,
            });

            if (response.status === 404) {
                notification.error({
                    message: "Usuario o contraseña inválido",
                    duration: 3,
                    pauseOnHover: false,
                    showProgress: true,
                });
                throw new Error("Error 404: Credenciales inválidas");
            }

            if (response.status === 401) {
                notification.error({
                    message: data.msg,
                    duration: 3,
                    pauseOnHover: false,
                    showProgress: true,
                });
                throw new Error("Error 401: Autenticación fallida");
            }

            if (!response.ok) {
                throw new Error(
                    "No fue posible iniciar sesión, probablemente el servidor esté inactivo. Intente nuevamente una vez más."
                );
            }

            message.success(`${data.msg}`);
            setLoginUserData(data.usrData);

            const dataUser = JSON.parse(localStorage.getItem("userdata"));
            if (!dataUser) {
                localStorage.setItem("userdata", JSON.stringify(data.usrData));
            } else {
                localStorage.removeItem("userdata");
                localStorage.setItem("userdata", JSON.stringify(data.usrData));
            }

            return true;
        } catch (error) {
            console.error(error);
            startRetryCountdown()
            localStorage.removeItem("userdata");
            setLoginUserData({});
            navigate("/");

            notification.error({
                message: "No se pudo procesar la solicitud",
                description: error.message || "Error inesperado. Inténtelo más tarde.",
                duration: 4,
                pauseOnHover: false,
            });

            return false;
        }
    };

    const [alreadyShownMessage, setAlreadyShownMessage] = useState(false);

    const verifyAuthUser = async () => {
        console.log("Ejecuta verifyAuthUser")
        try {
            const userData = localStorage.getItem("userdata");

            if (!userData) {
                throw new Error("No hay datos en el local storage. Por favor, inicie sesión nuevamente.");
            }

            const parseData = JSON.parse(userData);
            if (!parseData.nombre_usuario || !parseData.email) {
                throw new Error("No se pudo verificar su sesión. Por favor, inicie sesión nuevamente.");
            }

            const response = await fetch(
                `${baseUrl.api}/verifyAuthUser?username=${encodeURIComponent(parseData.nombre_usuario)}&email=${encodeURIComponent(parseData.email)}`
            );

            if (response.status === 401) {
                if (!alreadyShownMessage) {
                    setAlreadyShownMessage(true);
                    notification.info({ message: "Sesión caducada", duration: 4 });
                }
                throw new Error("Sesión expirada. Por favor, inicie sesión nuevamente.");
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.msg || "No se pudo verificar su sesión.");
            }

            setLoginUserData(parseData);
        } catch (error) {
            console.error(error);
            startRetryCountdown()
            setLoginUserData({});
            localStorage.removeItem("userdata");
            navigate("/");

            notification.error({
                message: error.status === 401 ? "Sesión expirada" : "Error al verificar la sesión",
                description:
                    error.status !== 401
                        ? "No fue posible verificar la sesión, probablemente el servidor esté inactivo. Intente nuevamente más tarde."
                        : error.message,
                duration: 5,
                pauseOnHover: false,
            });
        }
    };

    const [retryCountDown, setRetryCountDown] = useState(0)
    const [serverWithDelay, setServerWithDelay] = useState(false)
    const startRetryCountdown = () => {
        let remainingTime = 5; 
        setServerWithDelay(true)
        setRetryCountDown(remainingTime);

        const interval = setInterval(() => {
            remainingTime -= 1;
            setRetryCountDown(remainingTime);

            if (remainingTime <= 0) {
                setServerWithDelay(false)
                clearInterval(interval); 
            }
        }, 1000); 
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
        const hiddenMessage = message.loading("Obteniendo sucursales...")
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
        } finally {
            hiddenMessage()
        }
    };

    const deleteBranch = async (branchId) => {
        if (!branchId) return notification.error({ message: "Ocurrió algo inesperado al intentar eliminar la sucuresal" })
        try {
            const response = await fetch(`${baseUrl.api}/delete-branch/${branchId}`, {
                method: "DELETE"
            })
            const responseData = await response.json()

            if (!response.ok) throw new Error(responseData.msg)
            await getAllBranches()
            message.success(`${response.msg}`)

        } catch (error) {
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

    const [clients, setClients] = useState([])
    const getClients = async () => {
        console.log("Ejecuta la funcion GetClients")
        try {
            const response = await fetch(`${baseUrl.api}/get-clients`)

            const responseData = await response.json()
            if (!response.ok) throw new Error(responseData.msg)
            setClients(responseData.clients)
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No se pudo obtener la lista de clientes",
                description: error.message || apiResponses.error,
                duration: 5,
                showProgress: true,
                pauseOnHover: false
            })
        }
    }

    const saveClient = async (clientData) => {
        try {
            const response = await fetch(`${baseUrl.api}/save-client`, {
                method: "POST",
                body: clientData
            });

            const responseData = await response.json()
            if (!response.ok) throw new Error(responseData.msg)
            await getClients()
            message.success(`${responseData.msg}`)
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No se pudo crear/actualizar el cliente",
                description: error.message || apiResponses.error,
                duration: 5,
                showProgress: true,
                pauseOnHover: false
            })
            return false
        }
    }

    useEffect(() => {
        if (loginUserData) {
            const interval = setInterval(() => {

                verifyAuthUser()
            }, 120000);
            return () => clearInterval(interval)
        }
        console.log("No se hace la comprobación")
    }, [loginUserData])

    //aL cargar el sistema, iniciar una comprobacion inicial
    useEffect(() => {
        (async () => {
            await verifyAuthUser()
        })()
    }, [])
    return (
        <AppContext.Provider
            value={{
                registerBusiness, login, loginUserData,
                verifyAuthUser, saveBranch, retryCountDown, serverWithDelay,
                getAllBranches, sucursales, deleteBranch,
                saveClient, getClients, clients
            }}
        >
            {children}
        </AppContext.Provider>
    )
}