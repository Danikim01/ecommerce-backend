class ProductManager{
    constructor(){
        this.products = []
    }
    getProducts(){
        return this.products
    }
    /*id autoincrementable*/ 
    static id = 0
    addProduct(product){
        /*validar que el campo code del producto no se repita*/
        this.products.forEach(p => {
            if(p.code == product.code){
                throw new Error('El producto ya existe')
            }
        })
        /*validar que todos los campos sean obligatorios*/
        this.products.forEach(p => {
            if(p.title == '' || p.description == '' || p.price == '' || p.thumbnail == '' || p.code == '' || p.stock == ''){
                throw new Error('Todos los campos son obligatorios')
            }
        })
        let id = ProductManager.id++
        this.products.push({id, ...product})
    }
    getProductsById(id){
        let found = this.products.find(p => p.id == id)
        if (found){
            return found
        }else{
            throw new Error('Producto no encontrado')
        }
    }
}

/*Tests*/

let pm = new ProductManager()

/*Test 1*/ 
console.log(pm.getProducts())

/*Test 2*/ 

let Product = {
    title: 'producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25
}

pm.addProduct(Product)
console.log(pm.getProducts())

/*Test 3*/

//pm.addProduct(Product) 

//Error: El producto ya existe

/*Test 4*/

console.log(pm.getProductsById(0))

/*Test 5*/

//console.log(pm.getProductsById(1))

//Error: Producto no encontrado