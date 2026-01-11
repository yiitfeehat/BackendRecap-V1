const express = require('express');
const cors = require('cors');
const router = require('./routes/auth.routes');
const errorHandler = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use('/api', router);

// Error Handler Middleware en sonda olmalı
app.use(errorHandler);

module.exports = app;
