const products = [
  // IKKI QISMLI KOSTYUMLAR / TWO-PIECE SUITS
  {
    id: 1,
    category: "twopiece",
    name_uz: "Klassik Qora Kostyum",
    name_en: "Classic Black Suit",
    desc_uz: "Sifatli jun mato, slim fit, barcha rasmiy tadbirlar uchun ideal.",
    desc_en: "Premium wool blend, slim fit, ideal for all formal occasions.",
    price: 1490000,
    colors: ["#1a1a1a", "#2c2c54", "#3d3d3d"],
    sizes: ["46", "48", "50", "52", "54"],
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
    badge_uz: "Eng Ko'p Sotilgan",
    badge_en: "Best Seller",
    stock: 12
  },
  {
    id: 2,
    category: "twopiece",
    name_uz: "Moviy Biznes Kostyum",
    name_en: "Navy Business Suit",
    desc_uz: "Italyan matosi, to'g'ri kesilgan, ish muhiti uchun mukammal.",
    desc_en: "Italian fabric, regular cut, perfect for business environments.",
    price: 1890000,
    colors: ["#1e3a5f", "#2e4a7f", "#0a2342"],
    sizes: ["46", "48", "50", "52", "54", "56"],
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4052?w=600&q=80",
    badge_uz: "Yangi",
    badge_en: "New",
    stock: 8
  },
  {
    id: 3,
    category: "twopiece",
    name_uz: "Kulrang Slim Fit",
    name_en: "Grey Slim Fit Suit",
    desc_uz: "Zamonaviy kesim, nozik chiziqlar, har qanday tanaga mos.",
    desc_en: "Modern cut, fine lines, fits every body type.",
    price: 1290000,
    colors: ["#6b7280", "#9ca3af", "#374151"],
    sizes: ["46", "48", "50", "52"],
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80",
    badge_uz: null,
    badge_en: null,
    stock: 15
  },

  // UCH QISMLI KOSTYUMLAR / THREE-PIECE SUITS
  {
    id: 4,
    category: "threepiece",
    name_uz: "Qirollik Uch Qismli",
    name_en: "Royal Three-Piece",
    desc_uz: "Kostyum + jilet + shim. To'y va tantanali marosimlar uchun.",
    desc_en: "Jacket + vest + trousers. For weddings and ceremonies.",
    price: 2490000,
    colors: ["#1a1a1a", "#1e3a5f", "#2d2d2d"],
    sizes: ["48", "50", "52", "54"],
    image: "https://images.unsplash.com/photo-1600091166971-7f9faad6c2d2?w=600&q=80",
    badge_uz: "Premium",
    badge_en: "Premium",
    stock: 6
  },
  {
    id: 5,
    category: "threepiece",
    name_uz: "Vintaj Jigarrang",
    name_en: "Vintage Brown Three-Piece",
    desc_uz: "Klassik jigarrang, zamonaviy kesim bilan uyg'unlashgan.",
    desc_en: "Classic brown with a modern twist cut.",
    price: 2190000,
    colors: ["#6b3f1e", "#8b5e3c", "#4a2c0a"],
    sizes: ["48", "50", "52"],
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80",
    badge_uz: "Cheklangan",
    badge_en: "Limited",
    stock: 4
  },

  // KO'YLAKLAR / SHIRTS
  {
    id: 6,
    category: "shirt",
    name_uz: "Oq Klassik Ko'ylak",
    name_en: "White Classic Shirt",
    desc_uz: "100% paxta, qulay va nafis. Kostyum ostida mukammal.",
    desc_en: "100% cotton, comfortable and elegant. Perfect under suits.",
    price: 290000,
    colors: ["#ffffff", "#f0f0f0"],
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
    badge_uz: null,
    badge_en: null,
    stock: 30
  },
  {
    id: 7,
    category: "shirt",
    name_uz: "Ko'k Oksford Ko'ylak",
    name_en: "Blue Oxford Shirt",
    desc_uz: "Oksford mato, rasmiy va norasmiy uslub uchun.",
    desc_en: "Oxford fabric, for formal and casual styles.",
    price: 320000,
    colors: ["#1e40af", "#3b82f6", "#93c5fd"],
    sizes: ["38", "39", "40", "41", "42", "43"],
    image: "https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=600&q=80",
    badge_uz: "Ommabop",
    badge_en: "Popular",
    stock: 20
  },

  // SPORT KLASS / SPORT CLASS
  {
    id: 8,
    category: "sport",
    name_uz: "Sport Klass Kostyum",
    name_en: "Sport Class Suit",
    desc_uz: "Cho'ziluvchi mato, harakat erkinligi. Ish va sport orasida.",
    desc_en: "Stretch fabric, freedom of movement. Between office and sport.",
    price: 990000,
    colors: ["#1a1a1a", "#1e3a5f", "#374151"],
    sizes: ["46", "48", "50", "52", "54"],
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80",
    badge_uz: "Trend",
    badge_en: "Trending",
    stock: 18
  },
  {
    id: 9,
    category: "sport",
    name_uz: "Aktiv Fit Blazer Set",
    name_en: "Active Fit Blazer Set",
    desc_uz: "Yengil va dam o'tadigan mato. Zamonaviy erkak uchun.",
    desc_en: "Lightweight breathable fabric. For the modern man.",
    price: 890000,
    colors: ["#374151", "#6b7280", "#0f172a"],
    sizes: ["46", "48", "50", "52"],
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80",
    badge_uz: "Yangi",
    badge_en: "New",
    stock: 10
  }
];

module.exports = products;
