const { Schema } = require("mongoose");

const categorySchema = new Schema({
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

module.exports = categorySchema;
