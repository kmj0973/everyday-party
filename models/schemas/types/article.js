const { Schema } = require("mongoose");

const article = {
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
};

module.exports = article;
