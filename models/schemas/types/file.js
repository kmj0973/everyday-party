const { Schema } = require("mongoose");

const fileSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        path: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = fileSchema;
