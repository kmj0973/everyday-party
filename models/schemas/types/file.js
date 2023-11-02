const { mongoose, Schema } = require("mongoose");

const fileSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    file: {
        type: Buffer,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
    },
});

module.exports = fileSchema;
