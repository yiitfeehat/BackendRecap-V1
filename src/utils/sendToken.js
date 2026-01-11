
/**
 * Kullanıcıya Token ve Cookie gönderen yardımcı fonksiyon.
 * @param {Object} user - Kullanıcı objesi (Veritabanından gelen)
 * @param {String} token - JWT Token string'i
 * @param {Object} res - Express Response objesi
 * @param {Number} statusCode - HTTP Statü kodu (Örn: 200, 201)
 */

const sendToken = (user, token, res, statusCode = 200) => {


    const expiresInDays = process.env.COOKIE_EXPIRE || 1;
    const expiresInMs = expiresInDays * 24 * 60 * 60 * 1000;

    const cookieOptions = {
        expires: new Date(Date.now() + expiresInMs),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };

    res.cookie('token', token, cookieOptions);

    const userResponse = user.toObject ? user.toObject() : { ...user };
    delete userResponse.password;

    res.status(statusCode).json({
        success: true,
        message: "İşlem başarılı.",
        user: userResponse,
    })
}

module.exports = sendToken;