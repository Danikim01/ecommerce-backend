import fs from 'fs'

export default class CartManager {
    constructor(){
        const url = new URL(import.meta.url);
        let pathname = url.pathname;
        if (pathname.startsWith('/')) {
            pathname = pathname.slice(1);
        }
        this.path = pathname.trim().split('/').slice(0, -1).join('/').replace(/%20/g, ' ') + '/cart.json';
    }

    async readFromFile(cart_id) {
        try {
            let content = await fs.promises.readFile(this.path, "utf8");
            if (content.length === 0) return [];
            content = JSON.parse(content);
            for (let i = 0; i < content.length; i++){
                if(cart_id == content[i].cart_id) return content[i].products;
            }
            return new Error('El carrito con id ' + cart_id + ' no existe');
        } catch (err) {
            console.error('Error al leer el archivo:', err);
            return err
        }
    }

    async getProductsFromCart(cart_id){
        try{
            if (!fs.existsSync(this.path)) {
                console.log('El archivo no existe');
                return []; 
            }
            let content = await this.readFromFile(cart_id);
            return content;
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    }

    async writeIntoFile(carts) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
        } catch (err) {
            return console.error('Error al escribir en el archivo');
        }
    }

    async addCart(cart_id){
        try{
            let carts = []
            !fs.existsSync(this.path) ? carts = [] : carts = JSON.parse(await fs.promises.readFile(this.path, "utf8"));
            carts.push({cart_id,products:[]});
            return await this.writeIntoFile(carts);
        }catch(err){
            console.error('Error al agregar carrito:', err);
        }
    }

    async addProductToCart(cart_id,product_id){
        try{
            if (!fs.existsSync(this.path)) {
                console.log('El archivo no existe');
                return;
            }
            let carts = JSON.parse(await fs.promises.readFile(this.path, "utf8"));
            let cart = carts.find(c => c.cart_id == cart_id);
            let indexOfCart = carts.indexOf(cart);
            if (cart){
                let array_of_products = cart.products
                let findProduct = array_of_products.find(p => p.id == product_id);
                if (findProduct){
                    for (let i = 0; i < array_of_products.length; i++){
                        if (product_id == array_of_products[i].id){
                            array_of_products[i].quantity += 1; 
                        }
                    }
                }else{
                    array_of_products.push({id:product_id,quantity:1});
                }
                cart.products = array_of_products;
                carts[indexOfCart] = cart;
                await this.writeIntoFile(carts);
            }else{
                return new Error('El carrito con id ' + cart_id + ' no existe');
            }
        }catch(err){
            return console.error('Error al agregar producto al carrito:', err);
        }
    }
    
}