# Backend Recap V1 API 🚀

Bu proje, modern backend geliştirme süreçlerini pekiştirmek amacıyla geliştirilmiş, **Node.js** ve **Express.js** tabanlı kapsamlı bir RESTful API uygulamasıdır. Kullanıcı kimlik doğrulama, ürün yönetimi ve güvenli API yapıları üzerine odaklanılmıştır.

## 🌟 Özellikler

*   **Yetkilendirme & Kimlik Doğrulama (Auth):** JWT (Access & Refresh Token) yapısı ile güvenli giriş, kayıt ve çıkış işlemleri. HTTPOnly Cookie kullanımı.
*   **Ürün Yönetimi:** Ürün ekleme, listeleme ve detay görüntüleme yetenekleri.
*   **Güvenlik:** `Helmet` ile HTTP başlık güvenliği, `Rate Limit` ile istek sınırlama, `Cors` yapılandırması.
*   **Hata Yönetimi:** Merkezi `errorHandler` middleware ve `APIError` sınıfı ile tutarlı hata yönetimi.
*   **Validasyon:** `Zod` kütüphanesi ile request body validasyonları.
*   **Veritabanı:** MongoDB ve Mongoose ile şema tabanlı veri modelleme.

## 🛠 Kullanılan Teknolojiler

### Backend
*   **Core:** Node.js, Express.js
*   **Database:** MongoDB, Mongoose
*   **Authentication:** `jsonwebtoken` (JWT), `bcryptjs` (Password Hashing), `cookie-parser`
*   **Validation:** `zod`
*   **Security:** `helmet`, `cors`, `express-rate-limit`
*   **Utility:** `dotenv`

## 📂 Proje Yapısı

```
/
├── src/
│   ├── app.js              # Express uygulama konfigürasyonu
│   ├── server.js           # Server başlatma noktası
│   ├── config/             # Veritabanı bağlantısı
│   ├── controllers/        # Request/Response mantığı (Auth, Product)
│   ├── middlewares/        # Auth, ErrorHandler, RateLimit, Validate
│   ├── models/             # Mongoose şemaları (User, Product)
│   ├── routes/             # API endpoint tanımları
│   ├── services/           # İş mantığı katmanı (Auth Service)
│   ├── utils/              # Yardımcı araçlar (APIError, SendToken)
│   └── validations/        # Zod şemaları
├── .env                    # Çevresel değişkenler
└── package.json            # Bağımlılıklar
```

## 🚀 Kurulum

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin.

1.  Projeyi indirin (Clone).
2.  Terminali açın ve proje dizinine gidin.
3.  Bağımlılıkları yükleyin:
    ```bash
    npm install
    ```
4.  Ana dizinde `.env` dosyasını oluşturun ve gerekli değişkenleri tanımlayın:
    ```env
    PORT=5000
    MONGODB=mongodb+srv://... (Connection String)
    ACCESS_KEY=your_access_secret
    REFRESH_KEY=your_refresh_secret
    ```
5.  Uygulamayı başlatın:
    ```bash
    # Development modu (Nodemon ile)
    npm run dev

    # Production modu
    npm start
    ```

## 🔌 API Endpointleri

Bu projede Swagger dokümantasyonu henüz yapılandırılmamıştır. Mevcut endpointler aşağıdadır:

### Auth
*   `POST /api/register` - Yeni kullanıcı kaydı
*   `POST /api/login` - Kullanıcı girişi
*   `POST /api/logout` - Çıkış yap (Cookie temizler)
*   `POST /api/refresh` - Refresh token ile yeni access token al
*   `GET /api/profile` - Kullanıcı profili (Login gerekli)

### Products
*   `POST /api/products/add` - Yeni ürün ekle (Login gerekli)
*   `GET /api/products` - Tüm ürünleri listele
*   `GET /api/products/:id` - Ürün detayı getir
