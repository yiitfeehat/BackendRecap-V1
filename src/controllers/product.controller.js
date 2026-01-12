const asyncWrapper = require('../utils/asyncWrapper');
const APIError = require("../utils/APIError");
const Product = require('../models/product.model');

const createProduct = asyncWrapper(async (req, res) => {
    const product = await Product.create({
        ...req.body,
        seller: req.user._id
    });


    res.status(201).json({
        success: true,
        message: "Ürün başarıyla oluşturuldu.",
        data: product
    })


})


const getAllProducts = asyncWrapper(async (req, res) => {

    const products = await Product.find()
        .populate("seller", "username email")
        .sort({ createdAt: -1 }) // En yenisi için sıralama ayarı.

    res.status(201).json({
        success: true,
        data: products
    })
})


const getProductDetail = asyncWrapper(async (req, res) => {

    const { id } = req.params;

    const product = await Product.findById(id)
        .populate("seller", "username email")

    if (!product) {
        throw new APIError("Ürün bulunamadı.", 404);
    }

    res.status(201).json({
        success: true,
        data: product
    })
});

module.exports = {
    createProduct,
    getAllProducts,
    getProductDetail
};