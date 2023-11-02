const mongoose = require("mongoose");

const CommentSchema = require("./schemas/comment");
const OrderSchema = require("./schemas/order");
const PostSchema = require("./schemas/post");
const ProductSchema = require("./schemas/product");
const ReviewSchema = require("./schemas/review");
const UserSchema = require("./schemas/user");

exports.Comment = mongoose.model("Comment", CommentSchema);
exports.Order = mongoose.model("Order", OrderSchema);
exports.Post = mongoose.model("Post", PostSchema);
exports.Product = mongoose.model("Product", ProductSchema); //수정
exports.Review = mongoose.model("Review", ReviewSchema);
exports.User = mongoose.model("User", UserSchema);
