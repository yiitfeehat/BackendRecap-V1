const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const router = require('./routes/auth.js');
const errorHandler = require('./middlewares/errorHandler.js');


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use('/api', router)
const PORT = process.env.PORT || 8000;

db();
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
}) 