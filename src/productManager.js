import fs from 'fs';

export default class ProductManager {
    constructor() {
        const url = new URL(import.meta.url);
        let pathname = url.pathname;
        if (pathname.startsWith('/')) {
            pathname = pathname.slice(1);
        }
        this.path = pathname.trim().split('/').slice(0, -1).join('/').replace(/%20/g, ' ') + '/products.json';
    }

    async writeIntoFile(products) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        } catch (err) {
            console.error('Error al escribir en el archivo');
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
                return []; // Si el archivo no existe, devolver un array vacío
            }
            let content = await this.readFromFile();
            return content;
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            return []; // Devolver un array vacío si ocurre algún error
        }
    }

    async addProduct(product,id) {
        try {
            let products = await this.getProducts(); // Leer productos existentes
            products.forEach(p => {
                if (p.code == product.code) throw new Error('El producto ya existe');
            });
            products.push({ id, ...product }); // Agregar el nuevo producto
            await this.writeIntoFile(products); // Escribir todos los productos de vuelta al archivo
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    }

    async getProductById(id) {
        try {
            let products = await this.getProducts();
            let p = products.find(p => p.id == id);
            if (p) {
                return p;
            } else {
                throw new Error('Producto no encontrado');
            }
        } catch (err) {
            console.error('Error al obtener el producto:', err);
        }
    }

    async updateProduct(id, fields) {
        try {
            let products = await this.getProducts();
            let product = await this.getProductById(id);
            let index = products.findIndex(p => p.id == id);
            Object.assign(product, fields);
            products[index] = product;
            this.writeIntoFile(products);
        } catch (err) {
            console.error('Error al obtener los productos:', err);
        }
    }

    async deleteProduct(id) {
        try {
            let products = await this.getProducts();
            let index = products.findIndex(p => p.id == id);
            if (index == -1) {
                throw new Error('Producto no encontrado');
            };
            products.splice(index, 1);
            this.writeIntoFile(products);
        } catch (err) {
            console.error('Error al obtener los productos:', err);
        }
    }
}
