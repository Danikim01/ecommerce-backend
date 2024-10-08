import productModel from "../models/productModel.js";
import { generateProductErrorInfo } from "../../../errors/info.js";
import CustomError from "../../../errors/CustomError.js";
import { ErrorCodes } from "../../../errors/enums.js";

export default class productManagerDB {

    async getAllProducts() {
        try {
            return await productModel.find().lean();
        } catch (error) {
            console.error(error.message);
            throw new Error("Error al buscar los productos");
        }
    }

    async getProductByID(pid) {
        const product = await productModel.findOne({_id: pid});
        if (!product) throw new Error(`El producto ${pid} no existe!`);
        return product;
    }

    async createProduct(product) {
        const {title, description, code, price, stock, category, thumbnails,image,owner} = product;
        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error('Campo incompleto, por favor complete todos los campos');
        }

        try {
            const result = await productModel.create({title, description, code, price, stock, category,thumbnails,image,owner});
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error('Error al crear el producto desde product manager');
        }
    }

    async updateProduct(pid, productUpdate) {
        try {
            const result = await productModel.updateOne({_id: pid}, productUpdate);

            return result;
        } catch(error) {
            console.error(error.message);
            throw new Error('Error al actualizar el producto');
        }
    }

    async buyProduct(pid, quantity) {
        try {
            const product = await productModel.findOne({_id: pid});
            if (!product) throw new Error(`El producto ${pid} no existe!`);
            if (product.stock < quantity) throw new Error(`No hay suficiente stock para el producto ${pid}`);
            product.stock -= quantity;
            if (product.stock <= 0) {
                const deleteResult = await this.deleteProduct(pid);
                return deleteResult;
            }
            return await productModel.updateOne({_id: pid}, product);
        } catch(error) {
            console.error(error.message);
            throw new Error(`Error al comprar el producto ${pid}`);
        }
    }

    async deleteProduct(pid) {
        try {
            const result = await productModel.deleteOne({_id: pid});
            if (result.deletedCount === 0) throw new Error(`El producto ${pid} no existe!`);
            return result;
        } catch(error) {
            console.error(error.message);
            throw new Error(`Error al eliminar el producto desde product manager ${pid}`);
        }
    }

    async paginateProducts(filter, options,baseURL){
        try {
            let paginateResult = await productModel.paginate(filter, options);
            paginateResult.prevLink = paginateResult.hasPrevPage ? `${baseURL}?page=${paginateResult.prevPage}` : null;
            paginateResult.nextLink = paginateResult.hasNextPage ? `${baseURL}?page=${paginateResult.nextPage}` : null;
            paginateResult.isValid = !(options.page <= 0 || options.page > paginateResult.totalPages);
            paginateResult.style = "index.css"

            return paginateResult;
        } catch (error) {
            console.error(error.message);
            throw new Error("Error al buscar los productos paginados");
        }
    }
}
