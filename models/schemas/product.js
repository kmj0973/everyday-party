const { Schema } = require("mongoose");
const fileSchema = require("./types/file");

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
    discountRate: {
        type: Number,
        default: 0,
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
        type: Schema.Types.ObjectId,
        ref: "Review",
    },
    file: {
        type: fileSchema,
    },
});

module.exports = ProductSchema;
