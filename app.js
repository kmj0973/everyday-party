const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const router = require('./routers/index');

const app = express();
dotenv.config();

mongoose.connect(process.env.MONGODB_URL);

// app.set('views', path.join(__dirname, 'views'));
// app.set("view engine", "pug")

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'src/views'))); // 폴더 경로를 local과 동일하게.
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('main page');
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT, () => {
  console.log('server on port 8080');
});
