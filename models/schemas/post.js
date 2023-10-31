const { Schema } = require("mongoose");
const fileSchema = require("./types/file");
const CommentSchema = require("./comment");

const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    comments: {
        type: [CommentSchema],
        required: true,
        default: [],
    },
    file: {
        type: fileSchema,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    hits: {
        type: Number,
        default: 0,
    },
});

module.exports = PostSchema;
