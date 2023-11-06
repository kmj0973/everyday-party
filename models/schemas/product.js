const { Schema } = require("mongoose");
const fileSchema = require("./types/file");
const ReviewSchema = require("./review");

const optionSchema = new Schema({
    size: {
        type: [String],
    },
    color: {
        type: [String],
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
        type: Schema.Types.ObjectId, /* categorySchema를 ref*/
    },
    description: {
        type: String,
    },
    option: {
        type: [optionSchema],
    },
    review: {
        type: [ReviewSchema],
        default: [],
    },
    file: {
        type: fileSchema,
    },
});

module.exports = {optionSchema, productSchema};
