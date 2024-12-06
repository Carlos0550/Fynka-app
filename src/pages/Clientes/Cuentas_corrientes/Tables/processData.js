export const processData = (data) => {
    if(!data || typeof data !== "string") return []

    return JSON.parse(data)
}