const express = require('express');
const { register, login, logout } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth');
const { registerSchema } = require('../validations/authValidations.js');
const validate = require('../middlewares/validate.js');


const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', authMiddleware, (req, res) => {
    res.status(200).json({
        message: "Profil sayfasına hoş geldin!",
        user: req.user
    })
});

module.exports = router;