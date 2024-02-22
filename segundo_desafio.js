let fs = require('fs');

class ProductManager{
    constructor(){
        /*El path debera ser modificado segun donde se ejecute*/ 
        this.path = "C:/Users/User/Desktop/Curso Backend/Segundo Desafio/products.txt"
    }
    
    async writeIntoFile(products){
        try{
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
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

/*Tests*/

let pm = new ProductManager()

let Product = {
    title: 'producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25
}

let Product2 = {
    title: 'producto prueba 2',
    description: 'Este es un producto prueba 2',
    price: 300,
    thumbnail: 'Sin imagen',
    code: 'abc124',
    stock: 25
}

//Los productos se agregan correctamente

// pm.addProduct(Product).then(() => {
//     pm.addProduct(Product2).then(() => {
//         pm.getProducts().then((products) => {
//             console.log(products)
//         })
//     })
// })

// pm.getProductById(1).then((product) => {
//     console.log(product)
// })

//pm.updateProduct(1,{title: 'asdfasdfasdvaerg27y27i',description: 'asdfasdfasdfaf',price: 242414,thumbnail: 'Otra imaasdfgenaaaaaaaaaaaaaaaa'})
