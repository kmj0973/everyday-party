const mongoose = require("mongoose");

const categorySchema = require("./schemas/category.js");
const { orderSchema } = require("./schemas/order.js");
const { optionSchema, productSchema, productInfoSchema } = require("./schemas/product.js");
const reviewSchema = require("./schemas/review.js");
const userSchema = require("./schemas/user.js");
const fileSchema = require("./schemas/types/file.js");

const Category = mongoose.model("Category", categorySchema);
const Order = mongoose.model("Order", orderSchema);
const ProductInfo = mongoose.model("ProductInfo", productInfoSchema);
const Product = mongoose.model("Product", productSchema);
const Option = mongoose.model("Option", optionSchema);
const Review = mongoose.model("Review", reviewSchema);
const User = mongoose.model("User", userSchema);
const File = mongoose.model("File", fileSchema);

module.exports = {
    Category,
    Order,
    ProductInfo,
    Product,
    Option,
    Review,
    User,
    File,
};
