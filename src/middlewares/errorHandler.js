const APIError = require("../utils/APIError");

const errorHandler = (err, req, res, next) => {
    // Hata objesinin kopyasını alalım (üzerinde değişiklik yapacağız)
    let error = { ...err };

    // JS Error nesnesinin 'message' özelliği enumerable olmadığı için kopyalanmaz, elle alalım
    error.message = err.message;

    // --- ÖZEL HATA YAKALAMA ALANI ---

    // 1. Mongoose: Geçersiz ID Hatası (CastError)
    // Örn: /users/123 (MongoDB ID'si 24 karakterli hex olmalı, 123 gelirse patlar)
    if (err.name === "CastError") {
        const message = `Geçersiz ID formatı: ${err.path}`;
        error = new APIError(message, 400);
    }

    // 2. Mongoose: Tekrar Eden Veri (Duplicate Key Error - Kod: 11000)
    // Örn: unique: true olan email alanına aynı mail gelirse
    if (err.code === 11000) {
        const message = `Bu değer zaten kullanımda. Lütfen farklı bir bilgi girin.`;
        error = new APIError(message, 400); // 400 Bad Request veya 409 Conflict
    }

    // 3. Mongoose: Validation Hatası
    // Zod kullanıyoruz ama yine de DB seviyesinde bir validation patlarsa (Yedek önlem)
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new APIError(message, 400);
    }

    // 4. JWT Hataları (Token geçersiz veya süresi dolmuş)
    if (err.name === 'JsonWebTokenError') {
        error = new APIError("Geçersiz token. Lütfen tekrar giriş yapın.", 401);
    }
    if (err.name === "TokenExpiredError") {
        error = new APIError("Oturum süreniz doldu. Lütfen tekrar giriş yapın.", 401);
    }
    // Bu kodu kopyala yapıştır (Bilerek çift tırnak ve bozuk boşluklar koyduk)

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Sunucu Hatası",
        // Stack trace sadece development ortamında görünsün
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
}

module.exports = errorHandler;