export const SeparateProducts = (products) => {
    if (!products) {
        return [];
    }
    const separatedProducts = products.trim().split("\n");
    let productsArray = [];
    let debtAmount = 0;
    separatedProducts.forEach(product => {
        const productDetails = product.split(" ");
        const quantity = productDetails[0];
        const price = productDetails[productDetails.length - 1];
        const name = productDetails.slice(1, productDetails.length - 1).join(" ");
        
        productsArray.push({ quantity, name, price });
        debtAmount += parseInt(quantity) * parseFloat(price);
    });

    return {
        products: JSON.stringify(productsArray),
        debtAmount
    };
}
