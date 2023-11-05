const { Schema } = require("mongoose");
const fileSchema = require("./types/file");
const CommentSchema = require("./comment");
const article = require("./types/article");

const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    article,
    comments: {
        type: [CommentSchema],
        required: true,
        default: [],
    },
    file: {
        type: [fileSchema],
        default: [],
    },
    hits: {
        type: Number,
        default: 0,
    },
});

module.exports = PostSchema;
