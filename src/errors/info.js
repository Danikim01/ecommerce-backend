export const generateProductErrorInfo = (product) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * name : needs to be a String, received ${product.name}
    * price : needs to be a Number, received ${product.price}
    * stock : needs to be a Number, received ${product.stock}
    * category : needs to be a String, received ${product.category}
    * description : needs to be a String, received ${product.description}
    * thumbnail : needs to be a String, received ${product.thumbnail}
    * code: needs to be a String, received ${product.code}`;
}

export const generateDuplicatePasswordErrorInfo = () => {
    return `The new password cannot be the same as the previous one`;
}

export const generateUserNotFoundErrorInfo = () => {
    return `The user does not exist`;
}

export const generateNotEnoughDocumentsErrorInfo = () => {
    return `The user does not have enough documents`;
}