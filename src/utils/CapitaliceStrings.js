export const CapitaliceStrings = (word) => {
    if (!word) return ""
    const letters = word.trim().split(" ")
    const capitalicedWord = letters
    .map(letter => letter.charAt(0).toUpperCase() + letter.slice(1).toLowerCase())
    .join(" ")
    return capitalicedWord
}