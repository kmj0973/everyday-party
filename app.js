const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const router = require("./routers/index.js");

const app = express();
dotenv.config();

mongoose.connect(process.env.MONGODB_URL);

app.get("/", (req, res) => {
    res.redirect("/main/main.html");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.static(path.join(__dirname, "views")));

app.use(cookieParser());

app.use("/api", router.router);

app.use((req, res) => {
    res.status(404);
    res.send({
        result: "fail",
        error: `Page not found ${req.path}`,
    });
});

app.use((err, req, res, next) => {
    return res.status(err.status || 500).json({
        message: err.message,
    });
});

app.listen(process.env.PORT);
