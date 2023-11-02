const { Product } = require("../models/index");

class ProductService {
    async getProductById(id) {
        const product = await Product.findById(id);
        if (!product) {
            throw new Error("Not Exist Product");
        } else {
            return product;
        }
    }
}

module.exports = new ProductService();
