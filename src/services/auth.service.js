// services/auth.service.js

const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const APIError = require('../utils/APIError'); // Hata yakalayıcın

const register = async (userData) => {
    const { username, email, password } = userData;

    // 1. Mail kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new APIError("Bu mail adresi zaten kullanımda.", 400);
    }

    // 2. Şifreleme
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Kullanıcı oluşturma
    const user = await User.create({
        username,
        email,
        password: hashedPassword
    });

    // 4. Şifreyi objeden çıkarıp döndür
    const userResponse = user.toObject();
    delete userResponse.password;

    return userResponse;
};

const login = async (credentials) => {
    const { email, password } = credentials;

    // 1. Kullanıcı var mı?
    const user = await User.findOne({ email });
    if (!user) {
        throw new APIError("Hatalı e-posta veya şifre.", 401);
    }

    // 2. Şifre doğru mu?
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new APIError("Hatalı e-posta veya şifre.", 401);
    }

    // 3. Tokenları Üret
    // Access Token (Kısa ömürlü: Frontend hafızasında duracak)
    const accessToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '15m' } 
    );

    // Refresh Token (Uzun ömürlü: Cookie'ye ve DB'ye gidecek)
    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET_KEY,
        { expiresIn: '7d' }
    );

    // 4. Token Rotation İçin Kayıt (KRİTİK ADIM)
    // Refresh token'ı veritabanına kaydediyoruz.
    user.refreshToken = refreshToken;
    await user.save();

    // 5. Yanıtı hazırla
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken; // Token'ı user objesi içinde dönmeye gerek yok, ayrı dönüyoruz

    return { 
        user: userResponse, 
        token: accessToken, // Controller'da 'token' diye karşıladığın için bu ismi kullandım
        refreshToken 
    };
};

const refreshAccessToken = async (incomingRefreshToken) => {
    // 1. Veritabanında bu token var mı?
    const user = await User.findOne({ refreshToken: incomingRefreshToken });

    // Eğer token veritabanında YOKSA ama süresi bitmemişse -> GÜVENLİK RİSKİ (Token Reuse)
    // Biri eski bir token'ı kullanmaya çalışıyor olabilir.
    if (!user) {
        throw new APIError("Geçersiz veya kullanılmış token. Lütfen tekrar giriş yapın.", 403);
    }

    // 2. Token Süresini Kontrol Et (JWT Verify)
    try {
        jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET_KEY);
    } catch (err) {
        throw new APIError("Oturum süresi dolmuş.", 403);
    }

    // 3. YENİ Tokenları Üret (Rotation)
    const newAccessToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '15m' }
    );

    const newRefreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET_KEY,
        { expiresIn: '7d' }
    );

    // 4. Eskiyi sil, yeniyi kaydet
    user.refreshToken = newRefreshToken;
    await user.save();

    return { 
        newAccessToken, 
        newRefreshToken 
        
    };
};

const logout = async (incomingRefreshToken) => {
    // Token'a sahip kullanıcıyı bul
    const user = await User.findOne({ refreshToken: incomingRefreshToken });
    
    // Eğer varsa, veritabanındaki token alanını temizle
    if (user) {
        user.refreshToken = null;
        await user.save();
    }
    
    return true;
};

module.exports = {
    register,
    login,
    refreshAccessToken,
    logout
};