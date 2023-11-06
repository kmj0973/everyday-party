const { Schema } = require("mongoose");

const categorySchema = new Schema({
    categoryName: {
        type: String,
        required: true,
    },
});

module.exports = categorySchema;
