const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Yetkisiz erişim, token bulunamadı." });
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Geçersiz veya süresi dolmuş token." });
            }

            req.user = {
                ...decoded,
                _id: decoded.id || decoded._id
            }
            next();
        });

    } catch (error) {
        return res.status(500).json({ message: "Sunucu hatası." });
    }
};

module.exports = authMiddleware;