# SUITS YOU — Premium Men's Fashion (Full-Stack)

Erkaklar kiyim do'koni: ikki/uch qismli kostyumlar, ko'ylaklar, sport klass.
O'zbek va Ingliz tillarida ishlaydi.

## Ishga tushirish / How to run

```bash
npm install
node server.js
```

Keyin brauzerda ochish: **http://localhost:3000**

## Texnologiyalar
- Backend: Node.js + Express
- Frontend: Vanilla HTML/CSS/JS (build kerak emas)
- Ma'lumotlar: `data/products.js` ichida (9 ta mahsulot)

## Xususiyatlar
- 🇺🇿 / 🇬🇧 til almashtirish (yuqori o'ng burchakdagi tugma)
- Kategoriya bo'yicha filtr: Ikki qismli, Uch qismli, Ko'ylak, Sport klass
- Mahsulot kartochkasi: rang va o'lcham tanlash
- Savat (cart) — qo'shish/o'chirish, real vaqtda hisoblash
- Buyurtma formasi — ism, telefon, manzil bilan

## API Endpoints
- `GET /api/products` — barcha mahsulotlar (?category=twopiece bilan filtr)
- `GET /api/products/:id` — bitta mahsulot
- `GET /api/cart` — savat tarkibi
- `POST /api/cart` — savatga qo'shish `{productId, size, color, quantity}`
- `DELETE /api/cart/:id` — savatdan o'chirish
- `POST /api/orders` — buyurtma berish `{name, phone, address}`
- `GET /api/stats` — statistika

## Keyingi qadamlar (tavsiya)
- Ma'lumotlar bazasi qo'shish (MongoDB/PostgreSQL) — hozir xotirada (in-memory)
- Admin panel — mahsulot qo'shish/tahrirlash
- To'lov tizimi integratsiyasi (Click, Payme)
- Foydalanuvchi autentifikatsiyasi
- Rasm yuklash funksiyasi (hozir Unsplash linklari ishlatilgan)
