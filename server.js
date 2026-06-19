const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- DATA (in-memory) ---
let products = require('./data/products');
let cart = [];
let orders = [];
let nextId = products.length + 1;

// =========================================
//  PUBLIC API
// =========================================

// GET all products
app.get('/api/products', (req, res) => {
  const { category } = req.query;
  let result = products;
  if (category && category !== 'all') {
    result = result.filter(p => p.category === category);
  }
  res.json(result);
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
});

// GET cart
app.get('/api/cart', (req, res) => {
  const enriched = cart.map(item => {
    const prod = products.find(p => p.id === item.productId);
    return { ...item, product: prod };
  });
  res.json(enriched);
});

// POST add to cart
app.post('/api/cart', (req, res) => {
  const { productId, size, color, quantity = 1 } = req.body;
  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const existing = cart.find(i => i.productId === productId && i.size === size && i.color === color);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: Date.now(), productId, size, color, quantity });
  }
  res.json({ success: true, cartCount: cart.reduce((s, i) => s + i.quantity, 0) });
});

// DELETE from cart
app.delete('/api/cart/:id', (req, res) => {
  cart = cart.filter(i => i.id !== parseInt(req.params.id));
  res.json({ success: true });
});

// POST order
app.post('/api/orders', (req, res) => {
  const { name, phone, address } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Name and phone required' });

  const total = cart.reduce((sum, item) => {
    const prod = products.find(p => p.id === item.productId);
    return sum + (prod ? prod.price * item.quantity : 0);
  }, 0);

  const order = {
    id: `SY-${Date.now()}`,
    name, phone, address,
    items: [...cart],
    total,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  orders.push(order);
  cart = [];
  res.json({ success: true, orderId: order.id, total });
});

// GET stats
app.get('/api/stats', (req, res) => {
  res.json({
    totalProducts: products.length,
    categories: {
      twopiece:   products.filter(p => p.category === 'twopiece').length,
      threepiece: products.filter(p => p.category === 'threepiece').length,
      shirt:      products.filter(p => p.category === 'shirt').length,
      sport:      products.filter(p => p.category === 'sport').length,
    },
    totalOrders: orders.length,
    cartItems: cart.reduce((s, i) => s + i.quantity, 0)
  });
});

// =========================================
//  ADMIN API
// =========================================

// GET all orders (admin)
app.get('/api/admin/orders', (req, res) => {
  res.json(orders);
});

// POST new product (admin)
app.post('/api/admin/products', (req, res) => {
  const { name_uz, name_en, desc_uz, desc_en, category, price, stock, image, sizes, colors, badge_uz, badge_en } = req.body;

  if (!name_uz || !name_en || !price) {
    return res.status(400).json({ error: 'name_uz, name_en va price majburiy' });
  }

  const newProduct = {
    id: nextId++,
    category: category || 'twopiece',
    name_uz, name_en,
    desc_uz: desc_uz || '',
    desc_en: desc_en || '',
    price: parseInt(price),
    colors: Array.isArray(colors) ? colors : (colors || ['#1a1a1a']),
    sizes: Array.isArray(sizes) ? sizes : (sizes || ['48', '50', '52']),
    image: image || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80',
    badge_uz: badge_uz || null,
    badge_en: badge_en || null,
    stock: parseInt(stock) || 0
  };

  products.push(newProduct);
  res.json({ success: true, product: newProduct });
});

// PUT edit product (admin)
app.put('/api/admin/products/:id', (req, res) => {
  const idx = products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });

  const { name_uz, name_en, desc_uz, desc_en, category, price, stock, image, sizes, colors, badge_uz, badge_en } = req.body;

  products[idx] = {
    ...products[idx],
    name_uz:  name_uz  || products[idx].name_uz,
    name_en:  name_en  || products[idx].name_en,
    desc_uz:  desc_uz  !== undefined ? desc_uz  : products[idx].desc_uz,
    desc_en:  desc_en  !== undefined ? desc_en  : products[idx].desc_en,
    category: category || products[idx].category,
    price:    price    ? parseInt(price)   : products[idx].price,
    stock:    stock    !== undefined ? parseInt(stock) : products[idx].stock,
    image:    image    || products[idx].image,
    sizes:    Array.isArray(sizes)  ? sizes  : products[idx].sizes,
    colors:   Array.isArray(colors) ? colors : products[idx].colors,
    badge_uz: badge_uz !== undefined ? (badge_uz || null) : products[idx].badge_uz,
    badge_en: badge_en !== undefined ? (badge_en || null) : products[idx].badge_en,
  };

  res.json({ success: true, product: products[idx] });
});

// DELETE product (admin)
app.delete('/api/admin/products/:id', (req, res) => {
  const before = products.length;
  products = products.filter(p => p.id !== parseInt(req.params.id));
  if (products.length === before) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
});

// UPDATE order status (admin)
app.patch('/api/admin/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.status = req.body.status || order.status;
  res.json({ success: true, order });
});

// =========================================
//  FRONTEND catch-all
// =========================================
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ SUITS YOU server running at http://localhost:${PORT}`);
  console.log(`🔐 Admin panel: http://localhost:${PORT}/admin.html`);
});

module.exports = app;
