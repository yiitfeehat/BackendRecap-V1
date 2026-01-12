const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Ürün adı zorunludur"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Açıklama zorunludur"],
        maxLength: [500, "Açıklama çok uzun olamaz"]
    },
    price: {
        type: Number,
        required: [true, "Fiyat zorunludur"],
        min: [0, "Fiyat 0'dan küçük olamaz"]
    },
    category: {
        type: String, 
        required: [true, "Kategori seçiniz"],
        enum: ["Elektronik", "Giyim", "Ev & Yaşam", "Araç", "Diğer"] // Sabit kategoriler
    },
    condition: {
        type: String,
        required: true,
        enum: ["Sıfır", "Az Kullanılmış", "Kullanılmış"], // Ürün durumu
        default: "Kullanılmış"
    },
    images: [
        {
            type: String // Resimlerin URL'leri burada duracak (şimdilik string array)
        }
    ],
    // İŞTE KRİTİK NOKTA: İLİŞKİ KURMA
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // User modeline referans veriyoruz
        required: true
    }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;