const Auth = require('../models/auth.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');




const register = async (req, res) => {

    const { username, email, password } = req.body;

    try {
        const user = await Auth.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "Bu mail adresi zaten var." })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await (await Auth.create({ username, password: hashedPassword, email })).toObject();
        delete newUser.password;


        res.status(201).json({
            status: "OK",
            message: "Kullanıcı başarıyla oluşturuldu",
            user: newUser
        })
    } catch (error) {
        res.status(500).json({ message: "Register işleminde bir hata oldu." })
    }

}

const login = async (req, res) => {
    const { email, password } = req.body;


    try {

        const user = await Auth.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Böyle bir kullanıcı yok." })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Şifre hatalı." })
        }

        const token = jwt.sign(
            {id : user._id, email: user.email},
            process.env.SECRET_KEY,
            {expiresIn: '1h'}
        )




        const userObject = user.toObject();
        delete userObject.password;

        res.status(200).json({
            status: "OK",
            message: "Giriş başarılııı...",
            user: userObject,
            token
        })



    } catch (error) {
        res.status(500).json({ message: "Login işleminde bir hata oldu." })

    }

}

module.exports = { register, login }