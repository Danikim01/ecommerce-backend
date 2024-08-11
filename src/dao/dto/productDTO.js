export default class ProductDTO{
    constructor(product){
        this.title = product.title ?? ' ';
        this.description = product.description ?? ' ';
        this.price = product.price ?? 0;
        this.stock = product.stock ?? 0;
        this.category = product.category ?? ' ';
        this.code = product.code ?? ' ';
        this.image = product.image ?? ' ';
        this.owner = product.owner ?? ' ';
        this.thumbnails = product.thumbnails ?? [];
    }
}