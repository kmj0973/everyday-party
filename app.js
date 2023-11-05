const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const router = require("./routers/index");


const app = express();
dotenv.config();

mongoose.connect(process.env.MONGODB_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "views")));
app.use(cookieParser());

app.use("/api", router.router);

app.use((req, res, next) => {
    res.status(404);
    res.send({
        result: "fail",
        error: `Page not found ${req.path}`,
    });
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json(err);
});

app.listen(process.env.PORT, () => {
    console.log(`server on port ${process.env.PORT}`);
});

console.log(path.join(__dirname, "views"));
