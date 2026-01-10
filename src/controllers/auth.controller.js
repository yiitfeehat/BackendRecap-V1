const authService = require('../services/auth.service');
const asyncWrapper = require('../utils/asyncWrapper');

const register = asyncWrapper(async (req, res, next) => {
    const user = await authService.register(req.body);

    res.status(201).json({
        status: "OK",
        message: "Kullanıcı başarıyla oluşturuldu",
        user
    })
})

const login = asyncWrapper(async (req, res, next) => {
    const { user, token } = await authService.login(req.body);

    res.status(200).json({
        status: "OK",
        message: "Giriş başarılııı...",
        user,
        token
    })
})

module.exports = { register, login }