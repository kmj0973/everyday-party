const { Schema } = require("mongoose");
const fileSchema = require("./types/file");
const commentSchema = require("./comment");
const article = require("./types/article");

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        article,
        comments: {
            type: [commentSchema],
            required: true,
            default: [],
        },
        files: {
            type: [fileSchema],
            default: [],
        },
        hits: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = postSchema;
