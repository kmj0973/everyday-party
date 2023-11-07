const { Schema } = require("mongoose");
const article = require("./types/article");

const commentSchema = new Schema(article);
commentSchema.set("timestamps", { createdAt: true, updatedAt: false });

module.exports = commentSchema;
