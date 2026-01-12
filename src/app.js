const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth.routes');
const productRouter = require('./routes/product.routes');
const errorHandler = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


/**---------- ROUTES ---------*/

app.use('/api', authRouter);
app.use('/api/products', productRouter)

// Error Handler Middleware en sonda olmalı
app.use(errorHandler);

module.exports = app;
