const { Schema } = require("mongoose");
const article = require("./types/article");

const CommentSchema = new Schema(article);

module.exports = CommentSchema;
