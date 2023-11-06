const { Schema } = require("mongoose");
const article = require("./types/article");

const commentSchema = new Schema(article);

module.exports = commentSchema;
