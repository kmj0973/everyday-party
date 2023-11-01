const { Schema } = require("mongoose");
const fileSchema = require("./types/file");
const ReviewSchema = require("./review");

const OptionSchema = new Schema({
    size: {
        type: [String],
        default: undefined,
    },
    color: {
        type: [String],
        default: undefined,
    },
});

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    entryDate: {
        type: Date,
        required: true,
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
        type: String,
    },
    description: {
        type: String,
    },
    option: {
        type: OptionSchema,
    },
    review: {
        type: [ReviewSchema],
        default: [],
    },
    file: {
        type: fileSchema,
    },
});

module.exports = ProductSchema;
