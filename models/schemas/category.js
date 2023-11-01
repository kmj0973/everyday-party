const { Schema } = require("mongoose");

const CategorySchema = new Schema({
    cateNum: {
        type: Number,
        required: true,
        unique: true,
    },
    cateName: {
        type: String,
        required: true,
    },
});

module.exports = CategorySchema;
