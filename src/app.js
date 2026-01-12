const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth.routes');
const productRouter = require('./routes/product.routes');
const errorHandler = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');


const app = express();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 100, // Limit
    message: "Çok fazla istek attınız, lütfen biraz bekleyin."
});


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(limiter);


/**---------- ROUTES ---------*/

app.use('/api', authRouter);
app.use('/api/products', productRouter)

// Error Handler Middleware en sonda olmalı
app.use(errorHandler);

module.exports = app;
