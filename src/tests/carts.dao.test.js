import { expect } from 'chai';
import connection from '../utils/db.connection.js';

import { cartsService,productsService } from '../repositories/index.js';

const chai_expect = expect;
const testProduct = {
    title: "Test Product",
    description: "Test Description",
    code: "TEST123",
    price: 100,
    status: true,
    stock: 10,
    category: "Test",
    owner: "user",
}
const testCart = {
    products: [],
    owner: "user",
}

connection();

describe("Tests Cart DAO", () => {
     // Se ejecuta ANTES de comenzar el paquete de tests
    before(async function () {
        const result = await productsService.createProduct(testProduct);
        testProduct._id = result._id;
    });
    // Se ejecuta ANTES de CADA test
    beforeEach(function () {});
    // Se ejecuta FINALIZADO el paquete de tests
    after(async function () {
        const result = await productsService.deleteProduct(testProduct._id);
    });
    // Se ejecuta FINALIZADO CADA text
    afterEach(function () {});

    it("addCart() debe retornar un objeto con el carrito creado", async () => {
        const result = await cartsService.addCart();
        testCart._id = result._id;
        chai_expect(result).to.be.an("object");
        chai_expect(result._id).to.be.not.null;
        chai_expect(result.products).to.be.deep.equal([]);
    });

    //test getting cart by id
    it("getProductsFromCart() debe retornar un array con los productos del carrito", async () => {
        const result = await cartsService.getProductsFromCart(testCart._id);
        chai_expect(result).to.be.an("array");
        chai_expect(result.length).to.be.equal(0);
    });


    //test adding product to cart
    it("addProductToCart() debe retornar un objeto con el producto agregado al carrito", async () => {
        //warning, the added product should exist in the database otherwise the test will fail
        const result = await cartsService.addProductToCart(testCart._id, testProduct._id);
        chai_expect(result).to.be.an("object");
        const addresult = await cartsService.getProductsFromCart(testCart._id);
        chai_expect(addresult).to.be.an("array");
        chai_expect(addresult[0].product._id.toString()).to.be.equal(testProduct._id.toString());
        chai_expect(addresult[0].quantity).to.be.equal(1);
    });


    //test update cart with new products
    it("updateCart() debe retornar un objeto con el carrito actualizado", async () => {
        await cartsService.updateCart(testCart._id, [{ product: testProduct._id, quantity: 2 }]);
        const updatedCart = await cartsService.getProductsFromCart(testCart._id);
        chai_expect(updatedCart).to.be.an("array");
        chai_expect(updatedCart[0].product._id.toString()).to.be.equal(testProduct._id.toString());
        chai_expect(updatedCart[0].quantity).to.be.equal(2);
    });

    //test add product quantity
    it("updateProductQuantity() debe retornar un objeto con el producto actualizado", async () => {
        await cartsService.updateProductQuantity(testCart._id, testProduct._id.toString(), 3);
        const updatedCart = await cartsService.getProductsFromCart(testCart._id);
        chai_expect(updatedCart).to.be.an("array");
        chai_expect(updatedCart[0].product._id.toString()).to.be.equal(testProduct._id.toString());
        chai_expect(updatedCart[0].quantity).to.be.equal(3);
    });

    //test delete products from cart
    it("deleteProducts() debe retornar un objeto con los productos eliminados", async () => {
        const result = await cartsService.deleteProducts(testCart._id);
        chai_expect(result).to.be.an("object");
        chai_expect(result.modifiedCount).to.be.equal(1);
        const deletedCart = await cartsService.getProductsFromCart(testCart._id);
        chai_expect(deletedCart).to.be.an("array");
        chai_expect(deletedCart.length).to.be.equal(0);
    });


    it("deleteCart() debe retornar un objeto con el carrito eliminado", async () => {
        const result = await cartsService.deleteCart(testCart._id);
        chai_expect(result).to.be.an("object");
        chai_expect(result.deletedCount).to.be.equal(1);
    });

});