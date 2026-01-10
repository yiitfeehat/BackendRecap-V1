const app = require('./app');
const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config();

// Veritabanı bağlantısı
db();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
