const { z } = require('zod')

const registerSchema = z.object({
    username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalı."),
    email: z.string().email("Geçerli bir email adresi giriniz."),
    password: z.string().min(6, "Şifre en az 6 karakter olmalı.")
});

const productSchema = z.object({
    name: z.string()
        .min(1, "Ürün adı zorunludur.")
        .trim(), 

    description: z.string()
        .min(1, "Açıklama zorunludur.")
        .max(500, "Açıklama 500 karakterden uzun olamaz."), 

    // Formdan string olarak gelse bile sayıya çevir (coerce) ve kontrol et
    price: z.coerce.number({ invalid_type_error: "Fiyat sayısal olmalıdır." })
        .min(0, "Fiyat 0'dan küçük olamaz."),

    // Kategori için Enum kontrolü (Sadece izin verilenleri kabul eder)
    category: z.enum(["Elektronik", "Giyim", "Ev & Yaşam", "Araç", "Diğer"], {
        errorMap: () => ({ message: "Lütfen geçerli bir kategori seçiniz." })
    }),

    // Condition Enum ve Default değeri
    condition: z.enum(["Sıfır", "Az Kullanılmış", "Kullanılmış"], {
        errorMap: () => ({ message: "Geçerli bir ürün durumu seçiniz." })
    }).default("Kullanılmış"), // Eğer gelmezse varsayılanı kullanır

    // Resimler string array (URL kontrolü ile)
    images: z.array(z.string().url("Geçerli bir resim linki olmalıdır.")).optional()
});

module.exports = { registerSchema, productSchema };
