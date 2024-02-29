let fs = require('fs');

module.exports = class ProductManager{
    constructor(){
        this.path = `${__dirname}/productos.json` // Ruta del archivo de productos
    }
    
    async writeIntoFile(products){
        try{
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        }catch(err){
            console.error('Error al escribir en el archivo')
        }
    }

    async readFromFile() {
        try {
            let content = await fs.promises.readFile(this.path, "utf8");
            return JSON.parse(content);
        } catch (err) {
            console.error('Error al leer el archivo:', err);
            return []; // Devolver un array vacío si no se pudo leer el archivo
        }
    }

    async getProducts() {
        try {
            if (!fs.existsSync(this.path)) {
                console.log('El archivo no existe');
                return [] // Si el archivo no existe, devolver un array vacío
            }
            let content = await this.readFromFile();
            return content
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            return []; // Devolver un array vacío si ocurre algún error
        }
    }
    
    static id = 0
    async addProduct(product){
        try {
            let id = ProductManager.id++
            let products = await this.getProducts(); // Leer productos existentes
            products.forEach(p => {
                if (p.code == product.code) throw new Error('El producto ya existe')
            });
            products.push({id,...product}); // Agregar el nuevo producto
            await this.writeIntoFile(products); // Escribir todos los productos de vuelta al archivo
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    }

    async getProductById(id){
        try{
            let products = await this.getProducts()
            let p = products.find(p => p.id == id)
            if (p){
                return p
            }else{
                throw new Error('Producto no encontrado')
            }
        }catch(err){
            console.error('Error al obtener el producto:', err)
        }
    }

    updateProduct(id,fields){
        this.getProducts().then((products) => {
            this.getProductById(id).then((product) => {
                let index = products.findIndex(p => p.id == id)
                Object.assign(product,fields)
                products[index] = product 
                this.writeIntoFile(products)
            })
        }).catch((err) => {
            console.error('Error al obtener los productos:', err);
        })
    }

    deleteProduct(id){
        this.getProducts().then((products) => {
            let index = products.findIndex(p => p.id == id)
            if (index == -1) throw new Error('Producto no encontrado')
            products.splice(index,1)
            this.writeIntoFile(products)   
        })
    }
}


// let pm = new ProductManager();



// let Product = {

//     title: 'producto prueba',

//     description: 'Este es un producto prueba',

//     price: 200,

//     thumbnail: 'Sin imagen',

//     code: 'abc123',

//     stock: 25

// };



// let Product2 = {

//     title: 'producto prueba 2',

//     description: 'Este es un producto prueba 2',

//     price: 300,

//     thumbnail: 'Sin imagen',

//     code: 'abc124',

//     stock: 25

// };



// // Primero, agregamos el primer producto

// pm.addProduct(Product).then(() => {

//     // Después de agregar el primer producto, agregamos el segundo

//     pm.addProduct(Product2).then(() => {

//         // Una vez ambos productos han sido agregados, obtenemos todos los productos

//         pm.getProducts().then((products) => {

//             console.log('Todos los productos:', products);

//             // Ahora intentamos obtener el producto por ID

//             pm.getProductById(1).then((product) => {

//                 console.log('Producto obtenido por ID:', product);

//             }).catch((error) => {

//                 // Manejo de errores si el producto no se encuentra

//                 console.error(error);

//             });

//         });

//     });

// }).catch((error) => {

//     // Manejo de errores para las operaciones de agregar productos

//     console.error(error);

// });


