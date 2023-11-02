const { Router } = require("express");
const router = Router();

const ProductService = require("../services/productService");

router.get("/", async (req, res, next) => {
    const { products } = req.query;

    if (products) {
        const arrOfProductId = [].concat(products);
        const arrOfProductData = [];
        const arrOfNotExistProductId = [];
        let eachProduct = 0;

        try {
            for (eachProduct = 0; eachProduct < arrOfProductId.length; eachProduct++) {
                arrOfProductData.push(await ProductService.getProductById(arrOfProductId.at(eachProduct)));
            }
        } catch (error) {
            arrOfNotExistProductId.push(arrOfProductId.at(eachProduct));
        }

        if (arrOfNotExistProductId.length > 0) {
            return res.json({
                status: 404,
                notExistProduct: arrOfNotExistProductId,
            });
        } else {
            return res.json({
                status: 200,
                products: arrOfProductData,
            });
        }
    } else {
        return res.json({
            status: 200,
            products: [],
        });
    }
});

module.exports = router;
