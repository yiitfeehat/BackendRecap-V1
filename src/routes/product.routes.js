const express = require('express');
const authMiddleware = require('../middlewares/auth');
const validate = require('../middlewares/validate.js');
const { productSchema } = require('../validations/authValidations.js');
const { createProduct, getAllProducts, getProductDetail } = require('../controllers/product.controller.js');


const router = express.Router();


router.post('/add', authMiddleware, validate(productSchema), createProduct)

router.get('/:id', getProductDetail)

router.get('/', getAllProducts)




module.exports = router;