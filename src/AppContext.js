import { createContext, useContext, useEffect, useRef, useState } from "react";
import { baseUrl } from "./api";
import { message, notification } from "antd";
import { apiResponses } from "./apiTexts";
import { useNavigate } from "react-router-dom";
import { processResponseData } from "./utils/ProcessResponseData";

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
    const [doNotVerify, setDoNotVerify] = useState(false);
    const verifyAuthUser = async () => {
        try {
            const userData = localStorage.getItem("userdata");

            if (!userData) {
                setDoNotVerify(true);
                return;
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
                    return notification.info({ message: "Sesión caducada", duration: 2 });
                }
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.msg || "No se pudo verificar su sesión.");
            }
            setDoNotVerify(false)
            setLoginUserData(parseData);
        } catch (error) {
            console.error(error);
            setDoNotVerify(true)
            startRetryCountdown()
            setLoginUserData({});
            localStorage.removeItem("userdata");
            navigate("/");

            notification.error({
                message: error.status === 401 ? "Error al verificar la sesión" : "Sesión caducada",
                description:
                    error.status !== 401
                        ? error.message
                        : "No fue posible verificar la sesión, probablemente el servidor esté inactivo. Intente nuevamente más tarde.",
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
        try {
            const response = await fetch(`${baseUrl.api}/get-clients`)

            const responseData = await processResponseData(response)
            if (response.status === 404) return notification.info({ message: responseData.msg })
            if (!response.ok) throw new Error(responseData.msg)
            setClients(responseData.clients)
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No se pudo obtener la lista de clientes",
                description: error.message || apiResponses.error,
                duration: 5,
                showProgress: true,
                pauseOnHover: false
            })
            return false
        }
    }

    const saveClient = async (clientData) => {
        try {
            const response = await fetch(`${baseUrl.api}/save-client?branchId=${loginUserData.sucursal_id}`, {
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

    const deletClient = async (clientID) => {
        try {
            const response = await fetch(`${baseUrl.api}/delete-client/${clientID}`, {
                method: "DELETE"
            })

            const responseData = await response.json()
            if (!response.ok) throw new Error(responseData.msg)
            await getClients()
            message.success(`${responseData.msg}`)
            return true;
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No se pudo eliminar el cliente",
                description: error.message || apiResponses.error,
                duration: 5,
                showProgress: true,
                pauseOnHover: false
            })
            return false
        }
    }

    const [adminUsers, setAdminUsers] = useState([])
    const getUsers = async () => {
        if (!loginUserData?.id) return notification.info({ message: "Aún estamos cargando tus datos, espere unos segundos e intente nuevamente." })

        try {
            const response = await fetch(`${baseUrl.api}/get-users/${loginUserData.id}`)
            const responseData = await processResponseData(response)
            if (response.status === 404) {
                setAdminUsers(responseData.admData)
                return notification.info({ message: "No tiene usuarios asociados." })
            }
            if (!response.ok) throw new Error(responseData.msg)


            setAdminUsers(responseData.users)
            message.success(`${responseData.msg}`)
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "Error al obtener la lista de usuarios",
                description: error.message,
                duration: 5,
                showProgress: true,
                pauseOnHover: false
            })
            return false
        }
    };

    const saveUser = async (userData) => {
        try {
            const response = await fetch(`${baseUrl.api}/create-associate-user`, {
                method: "POST",
                body: userData
            })

            if (!response.ok) {
                let errorResp = await processResponseData(response)
                return notification.warning({ message: errorResp.msg })
            }
            const responseData = await processResponseData(response)
            await getUsers()
            message.success(responseData.msg)
            return true
        } catch (error) {
            console.log(error)
            notification.success({
                message: "Error de conexión o de servidor",
                description: "Verifique su red o espere unos segundos e intente nuevamente.",
                duration: 3,
                pauseOnHover: false
            })

            return false
        }
    }

    const assignBranch = async (branchId, userId) => {
        try {
            const response = await fetch(`${baseUrl.api}/assign-branch?branchId=${branchId}&userId=${userId}`, {
                method: "PUT"
            });

            const responseData = await processResponseData(response)
            if (!response.ok) throw new Error(responseData.msg)
            await getUsers()
            message.success(responseData.msg)
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "Error al asignar la sucursal",
                description: error.message,
                duration: 5,
                showProgress: true,
                pauseOnHover: false
            })
            return false
        }
    };

    const [clientDebts, setClientDebts] = useState([])
    const [clientMoneyDelivers, setClientMoneyDelivers] = useState([])
    const [totalAccount, setTotalAccount] = useState(0)
    const [gettingAccount, setGettingAccount] = useState(false)
    const getClientAccount = async (clientId, branchId) => {
        if (!loginUserData?.sucursal_id) return notification.info({ message: "Aún estamos cargando tus datos, espere unos segundos e intente nuevamente." })
            setGettingAccount(true)
        try {
            const response = await fetch(`${baseUrl.api}/clients/get-client-account?clientId=${clientId}&branchId=${branchId || loginUserData.sucursal_id}`);
            const responseData = await processResponseData(response)
            if (response.status === 404){

                setClientDebts([])
                setClientMoneyDelivers([])
                setTotalAccount(0)

                return notification.info({ message: responseData.msg })
            }

            if (!response.ok) throw new Error(responseData.msg)
                
            setClientDebts(responseData.debts)
            setClientMoneyDelivers(responseData.delivers)
            setTotalAccount(responseData.totalAccount)
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "Error al obtener la cuenta del cliente",
                description: error.message,
                duration: 5,
                showProgress: true,
                pauseOnHover: false
            })
            return false
        }finally{
            setTimeout(() => {
                setGettingAccount(false)
            }, 1000);
        }
    }

    const saveDebt = async(debtValues) => {
        try {
            const response = await fetch(`${baseUrl.api}/save-debt`, {
                method: "POST",
                body: debtValues
            })

            const responseData = await processResponseData(response)
            if (!response.ok) throw new Error(responseData.msg)
            message.success(`${responseData.msg}`)
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "Error al guardar la deuda",
                description: error.message,
                duration: 5,
                showProgress: true,
                pauseOnHover: false
            })
            return false
        }
    }

    const saveDeliver = async(deliverValues) => {
        console.log(deliverValues)
        try {
            const response = await fetch(`${baseUrl.api}/clients/save-deliver`, {
                method: "POST",
                body: deliverValues
            })

            const responseData = await processResponseData(response)
            if (!response.ok) throw new Error(responseData.msg)
            message.success(`${responseData.msg}`)
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "Error al guardar la entrega",
                description: error.message,
                duration: 5,
                showProgress: true,
                pauseOnHover: false
            })
            return false
        }
    }

    const deleteDebt = async(debtID) => {
        try {
            const response = await fetch(`${baseUrl.api}/clients/delete-debt/${debtID}`, {
                method: "DELETE"
            })
            const responseData = await processResponseData(response)
            if (!response.ok) throw new Error(responseData.msg)
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "Error al eliminar la deuda",
                description: error.message,
                duration: 5,
                showProgress: true,
                pauseOnHover: false
            })
            return false
        }
    }

    const editDebt = async(debtValues,debtToEdit) => {
        try {
            const response = await fetch(`${baseUrl.api}/clients/edit-debt/${debtToEdit}`, {
                method: "PUT",
                body: debtValues
            })
            const responseData = await processResponseData(response)
            if (!response.ok) throw new Error(responseData.msg)
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "Error al editar la deuda",
                description: error.message,
                duration: 5,
                showProgress: true,
                pauseOnHover: false
            })
            return false
        }
    }

    const [debtId, setDebtId] = useState(null)
    const [action, setAction] = useState(null)
    const [editingDebt, setEditing] = useState(false)
    const [openFormsDebtsModal, setOpenFormsDebtsModal] = useState(false)
    const [showAlertsDebtsModal, setShowAlertsDebtsModal] = useState(false)
    const handlerDebts = (debtId = null, action = null, editing = false, isForm = false, isAlert = false) => {
        setDebtId(debtId)
        setAction(action)
        setEditing(editing)
        setOpenFormsDebtsModal(isForm)
        setShowAlertsDebtsModal(isAlert)
    }

    useEffect(() => {
        if (loginUserData && !doNotVerify) {
            const interval = setInterval(() => {

                verifyAuthUser()
            }, 5 * 60 * 1000);
            return () => clearInterval(interval)
        }
    }, [loginUserData, doNotVerify])

    //aL cargar el sistema, iniciar una comprobacion inicial
    useEffect(() => {
        (async () => {
            await verifyAuthUser()
        })()
    }, [])

    const [state, setState] = useState({
        branchID: "",
        clientID: "",
        branchName: "",
        adminID: "",
        userID: ""
    })

    useEffect(()=>{
        console.log(
            "debtId: ", debtId,
            "action: ", action,
            "editingDebt: ", editingDebt,
            "openFormsDebtsModal: ", openFormsDebtsModal,
            "showAlertsDebtsModal: ", showAlertsDebtsModal
        )
    },[debtId, action, editingDebt, openFormsDebtsModal, showAlertsDebtsModal])
    return (
        <AppContext.Provider
            value={{
                registerBusiness, login, loginUserData,
                verifyAuthUser, saveBranch, retryCountDown, serverWithDelay,
                getAllBranches, sucursales, deleteBranch,
                saveClient, getClients, clients,
                deletClient, getUsers, adminUsers, saveUser,
                assignBranch, getClientAccount, clientDebts, clientMoneyDelivers,
                setState, state, saveDebt, gettingAccount,
                saveDeliver, totalAccount, deleteDebt, editDebt,
                handlerDebts, debtId, action, editingDebt, openFormsDebtsModal, showAlertsDebtsModal
            }}
        >
            {children}
        </AppContext.Provider>
    )
}