const { Schema } = require("mongoose");
const fileSchema = require("./types/file");
const CommentSchema = require("./comment");

const ReviewSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    file: {
        type: fileSchema,
    },
    comment: {
        type: CommentSchema,
    },
});

module.exports = ReviewSchema;
