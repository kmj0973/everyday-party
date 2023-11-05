const mongoose = require("mongoose");

const CategorySchema = require("./schemas/category");
const CommentSchema = require("./schemas/comment");
const OrderSchema = require("./schemas/order");
const PostSchema = require("./schemas/post");
const ProductSchema = require("./schemas/product");
const ReviewSchema = require("./schemas/review");
const UserSchema = require("./schemas/user");

const Category = mongoose.model("Category", CategorySchema);
const Comment = mongoose.model("Comment", CommentSchema);
const Order = mongoose.model("Order", OrderSchema);
const Post = mongoose.model("Post", PostSchema);
const Product = mongoose.model("Product", ProductSchema.ProductSchema); //수정
const Option = mongoose.model("Option", ProductSchema.OptionSchema);
const Review = mongoose.model("Review", ReviewSchema);
const User = mongoose.model("User", UserSchema);

module.exports = {
    Category,
    Comment,
    Order,
    Post,
    Product,
    Option,
    Review,
    User
};