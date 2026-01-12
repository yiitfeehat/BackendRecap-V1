const authService = require('../services/auth.service');
const asyncWrapper = require('../utils/asyncWrapper');
const sendToken = require('../utils/sendToken')

const register = asyncWrapper(async (req, res, next) => {
    const user = await authService.register(req.body);

    res.status(201).json({
        status: "OK",
        message: "Kullanıcı başarıyla oluşturuldu",
        user
    })
})

const login = asyncWrapper(async (req, res, next) => {
    const { user, token, refreshToken } = await authService.login(req.body);
    sendToken(user, token, refreshToken, res);

})

const refresh = asyncWrapper(async (req, res) => {

    const { newAccessToken, newRefreshToken } = await authService.refreshAccessToken(req.cookies.jwt);

    // Cookie ayarları (sendToken ile aynı olmalı)
    const cookieOptions = {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };

    // Yeni Refresh Token'ı cookie'ye yaz
    res.cookie('jwt', newRefreshToken, cookieOptions);

    res.status(200).json({
        success: true,
        message: "Token başarıyla yenilendi.",
        token: newAccessToken
    });
})

const logout = asyncWrapper(async (req, res) => {
    // 1. Service üzerinden DB'deki refresh tokenı sil
    await authService.logout(req.cookies.jwt);

    // 2. Cookie'yi temizle
    res.cookie('jwt', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        status: "OK!",
        message: "Başarıyla çıkış yapıldı.",
    });
})

module.exports = { register, login, logout, refresh }