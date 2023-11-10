const mongoose = require("mongoose");

const categorySchema = require("./schemas/category");
const commentSchema = require("./schemas/comment");
const { orderSchema, productInfoSchema } = require("./schemas/order");
const postSchema = require("./schemas/post");
const { optionSchema, productSchema } = require("./schemas/product");
const reviewSchema = require("./schemas/review");
const userSchema = require("./schemas/user");
const fileSchema = require("./schemas/types/file");

const Category = mongoose.model("Category", categorySchema);
const Comment = mongoose.model("Comment", commentSchema);
const Order = mongoose.model("Order", orderSchema);
const ProductInfo = mongoose.model("ProductInfo", productInfoSchema);
const Post = mongoose.model("Post", postSchema);
const Product = mongoose.model("Product", productSchema);
const Option = mongoose.model("Option", optionSchema);
const Review = mongoose.model("Review", reviewSchema);
const User = mongoose.model("User", userSchema);
const File = mongoose.model("File", fileSchema);

module.exports = {
    Category,
    Comment,
    Order,
    ProductInfo,
    Post,
    Product,
    Option,
    Review,
    User,
    ProductInfo,
    File,
};
