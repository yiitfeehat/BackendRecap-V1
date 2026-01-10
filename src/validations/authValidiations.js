const { z } = require('zod')

const registerSchema = z.object({
    username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalı."),
    email: z.string().email("Geçerli bir email adresi giriniz."),
    password: z.string().min(6, "Şifre en az 6 karakter olmalı.")
});

module.exports = { registerSchema };