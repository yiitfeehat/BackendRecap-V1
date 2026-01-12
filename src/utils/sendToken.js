/**
 * Kullanıcıya Token ve Cookie gönderen yardımcı fonksiyon.
 * @param {Object} user - Kullanıcı objesi
 * @param {String} accessToken - JSON olarak dönecek token
 * @param {String} refreshToken - Cookie'ye konacak token
 * @param {Object} res - Response objesi
 * @param {Number} statusCode - Opsiyonel durum kodu
 */
const sendToken = (user, accessToken, refreshToken, res, statusCode = 200) => {

    const cookieOptions = {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün (Refresh token ömrüyle aynı olsun)
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };

    // Cookie ismini 'jwt' veya 'refreshToken' yapmak daha iyidir.
    // Çünkü 'token' ismi genelde Access Token için kullanılır, kafa karıştırır.
    res.cookie('jwt', refreshToken, cookieOptions);

    // Kullanıcı şifresini gizle
    const userResponse = user.toObject ? user.toObject() : { ...user };
    delete userResponse.password;

    // Access Token'ı JSON Body içinde gönder (Mülakatın istediği yer)
    res.status(statusCode).json({
        success: true,
        message: "İşlem başarılı.",
        user: userResponse,
        token: accessToken // Frontend bunu alıp değişkene atacak
    });
}

module.exports = sendToken;