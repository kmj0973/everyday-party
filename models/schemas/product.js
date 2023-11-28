const { Schema } = require("mongoose");
const fileSchema = require("./types/file.js");
const ReviewSchema = require("./review.js");

const optionSchema = new Schema({
    size: {
        type: [String],
    },
    color: {
        type: [String],
    },
});

const productInfoSchema = new Schema({
    name: {
        type: String,
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    option: {
        size: {
            type: String,
        },
        color: {
            type: String,
        },
    },
    quantity: {
        type: Number,
        required: true,
    },
});

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stockedAt: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    sales: {
        type: Number,
        required: true,
        default: 0,
    },
    discountRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 1,
    },
    category: {
        type: [Schema.Types.ObjectId] /* categorySchema를 ref */,
        ref: "Category",
    },
    description: {
        type: String,
    },
    option: {
        type: optionSchema,
    },
    review: {
        type: [ReviewSchema],
        default: [],
    },
    file: {
        type: fileSchema,
    },
});

module.exports = { optionSchema, productSchema, productInfoSchema };
