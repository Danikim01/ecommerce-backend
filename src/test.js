const ProductManager = require('./productManager');

const pm = new ProductManager();

const createProducts = async () => {
    //declarate an array of 10 products
    let products = [
        {
            title: 'producto prueba 1',
            description: 'Este es un producto prueba 1',
            price: 200,
            thumbnail: 'Sin imagen',
            code: 'abc123',
            stock: 25
        },
        {
            title: 'producto prueba 2',
            description: 'Este es un producto prueba 2',
            price: 300,
            thumbnail: 'Sin imagen',
            code: 'abc124',
            stock: 30
        },
        {
            title: 'producto prueba 3',
            description: 'Este es un producto prueba 3',
            price: 400,
            thumbnail: 'Sin imagen',
            code: 'abc125',
            stock: 35
        },
        {
            title: 'producto prueba 4',
            description: 'Este es un producto prueba 4',
            price: 500,
            thumbnail: 'Sin imagen',
            code: 'abc126',
            stock: 35
        },
        {
            title: 'producto prueba 5',
            description: 'Este es un producto prueba 5',
            price: 600,
            thumbnail: 'Sin imagen',
            code: 'abc127',
            stock: 35
        },
        {
            title: 'producto prueba 6',
            description: 'Este es un producto prueba 6',
            price: 700,
            thumbnail: 'Sin imagen',
            code: 'abc128',
            stock: 35
        },
        {
            title: 'producto prueba 7',
            description: 'Este es un producto prueba 7',
            price: 800,
            thumbnail: 'Sin imagen',
            code: 'abc129',
            stock: 35
        },
        {
            title: 'producto prueba 8',
            description: 'Este es un producto prueba 8',
            price: 900,
            thumbnail: 'Sin imagen',
            code: 'abc130',
            stock: 35
        },
        {
            title: 'producto prueba 9',
            description: 'Este es un producto prueba 9',
            price: 1000,
            thumbnail: 'Sin imagen',
            code: 'abc131',
            stock: 35
        },
        {
            title: 'producto prueba 10',
            description: 'Este es un producto prueba 10',
            price: 1100,
            thumbnail: 'Sin imagen',
            code: 'abc134',
            stock: 35
        }
    ]
    for (let i = 0; i < products.length; i++) {
        await pm.addProduct(products[i])
    }
    console.log(await pm.getProducts())
}

createProducts()