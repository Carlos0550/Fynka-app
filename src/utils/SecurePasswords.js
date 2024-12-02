export const generatePassword = () =>{
    const caracteres = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZabcdefghijklmnñopqrstuvwxyz0123456789/&%$#"

    let contraseña = ""

    for (let i = 0; i < 16; i++) {
        const indice = Math.floor(Math.random() * caracteres.length)
        contraseña += caracteres[indice]
    }

    return contraseña
}

