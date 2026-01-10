const express = require('express');
const { register, login } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth');
const { registerSchema } = require('../validations/authValidiations');
const validate = require('../middlewares/validate.js');


const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', login);
router.get('/profile', authMiddleware, (req, res) => {
    res.status(200).json({
        message: "Profil sayfasına hoş geldin!",
        user: req.user
    })
});

module.exports = router;