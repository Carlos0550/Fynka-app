export const processResponseData = async(response) => {
    try {
        return await response.json()
    } catch (error) {
        return {msg: "Error al procesar la solicitud."}
    }
}