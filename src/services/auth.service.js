const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const APIError = require('../utils/APIError');

const register = async (userData) => {
    const { username, email, password } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new APIError("Bu mail adresi zaten var.", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        password: hashedPassword
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    return userResponse;
};

const login = async (credentials) => {
    const { email, password } = credentials;

    const user = await User.findOne({ email });
    if (!user) {
        throw new APIError("Böyle bir kullanıcı yok.", 404);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new APIError("Şifre hatalı.", 400);
    }

    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, token };
};

module.exports = {
    register,
    login
};
