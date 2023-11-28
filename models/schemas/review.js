const { Schema } = require("mongoose");
const fileSchema = require("./types/file.js");
const article = require("./types/article.js");

const reviewSchema = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        file: {
            type: fileSchema,
        },
        article,
    },
    {
        timestamps: true,
    },
);

module.exports = reviewSchema;
