import { fakerES as faker } from "@faker-js/faker"

export const generateProduct = () => {
    let products = [];
    let thumbnails = [];
    for (let i = 0; i < 5; i++) {
        thumbnails.push(faker.image.url());
    }
    for (let i = 0; i < 100; i++) {
        let product = {
            id: faker.database.mongodbObjectId(),
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            code: faker.internet.password(),
            price: faker.commerce.price(),
            status: (faker.number.int({min: 0, max: 1}) == 1) ? true: false,
            stock: faker.number.int({min: 0, max: 100}),
            category: faker.commerce.department(),
            thumbnails: thumbnails
        }
        products.push(product);
    }

    return products;
}