import { expect } from 'chai';
import connection from '../utils/db.connection.js';
import { productsService } from '../repositories/index.js';


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

describe("Tests Product DAO", () => {
    // Se ejecuta ANTES de comenzar el paquete de tests
    before(function () {
    });
    // Se ejecuta ANTES de CADA test
    beforeEach(function () {});
    // Se ejecuta FINALIZADO el paquete de tests
    after(function () {});
    // Se ejecuta FINALIZADO CADA text
    afterEach(function () {});

    it("getAllProducts() debe retornar un array con los productos", async () => {
        const result = await productsService.getAllProducts();
        chai_expect(result).to.be.an("array");
    });

    it("createProduct() debe retornar un objeto con el producto creado", async () => {
        const result = await productsService.createProduct(testProduct);
        testProduct._id = result._id;
        chai_expect(result).to.be.an("object");
        chai_expect(result._id).to.be.not.null;
        chai_expect(result.thumbnails).to.be.deep.equal([]);
    });

    it("getProductByID() debe retornar un objeto con el producto", async () => {
        const result = await productsService.getProductByID(testProduct._id);
        chai_expect(result).to.be.an("object");
        chai_expect(result._id).to.be.not.null;
        chai_expect(result.title).to.be.equal(testProduct.title);
    });

   
    it("updateProduct() debe retornar un objeto con el producto actualizado", async () => {
        const result = await productsService.updateProduct(testProduct._id, { title: "Test Product Updated" });
        const updatedProduct = await productsService.getProductByID(testProduct._id);
        chai_expect(updatedProduct).to.be.an("object");
        chai_expect(updatedProduct._id).to.be.not.null;
        chai_expect(updatedProduct.title).to.be.equal("Test Product Updated");
    });

    
    it("deleteProduct() debe retornar un objeto con el producto eliminado", async () => {
        const result = await productsService.deleteProduct(testProduct._id);
        chai_expect(result).to.be.an("object");
    });
})