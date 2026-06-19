// ===== SUITS YOU — App Logic =====
const API = '/api';
let currentLang = 'uz';
let allProducts = [];
let currentFilter = 'all';
let selectedProduct = null;
let selectedSize = null;
let selectedColor = null;

const categoryLabels = {
  twopiece: { uz: 'Ikki Qismli', en: 'Two-Piece' },
  threepiece: { uz: 'Uch Qismli', en: 'Three-Piece' },
  shirt: { uz: "Ko'ylak", en: 'Shirt' },
  sport: { uz: 'Sport Klass', en: 'Sport Class' }
};

// ----- Format price -----
function formatPrice(num) {
  return num.toLocaleString('en-US').replace(/,/g, ' ') + (currentLang === 'uz' ? " so'm" : ' UZS');
}

// ----- Toast -----
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ----- Language toggle -----
function applyLanguage() {
  document.querySelectorAll('[data-uz]').forEach(el => {
    const text = currentLang === 'uz' ? el.dataset.uz : el.dataset.en;
    if (text) el.textContent = text;
  });
  document.getElementById('langToggle').textContent = currentLang === 'uz' ? 'EN' : "O'Z";
  document.documentElement.lang = currentLang;
  renderProducts();
}

document.getElementById('langToggle').addEventListener('click', () => {
  currentLang = currentLang === 'uz' ? 'en' : 'uz';
  applyLanguage();
});

// ----- Fetch products -----
async function fetchProducts() {
  try {
    const res = await fetch(`${API}/products`);
    allProducts = await res.json();
    renderProducts();
  } catch (err) {
    console.error('Failed to load products', err);
    document.getElementById('productsGrid').innerHTML = '<p style="text-align:center;color:#6b7280;">Mahsulotlarni yuklashda xatolik.</p>';
  }
}

// ----- Render products -----
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const filtered = currentFilter === 'all' ? allProducts : allProducts.filter(p => p.category === currentFilter);

  grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-img">
        <img src="${p.image}" alt="${currentLang === 'uz' ? p.name_uz : p.name_en}" loading="lazy">
        ${p.badge_uz ? `<span class="product-badge">${currentLang === 'uz' ? p.badge_uz : p.badge_en}</span>` : ''}
        <button class="quick-add" data-id="${p.id}">${currentLang === 'uz' ? "Tez Ko'rish" : 'Quick View'}</button>
      </div>
      <div class="product-info">
        <div class="product-name">${currentLang === 'uz' ? p.name_uz : p.name_en}</div>
        <div class="product-desc">${currentLang === 'uz' ? p.desc_uz : p.desc_en}</div>
        <div class="product-footer">
          <div class="product-price">${formatPrice(p.price)}</div>
          <div class="product-colors">
            ${p.colors.map(c => `<span class="color-dot" style="background:${c}"></span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // attach click handlers
  grid.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => openModal(parseInt(card.dataset.id)));
  });
  grid.querySelectorAll('.quick-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(parseInt(btn.dataset.id));
    });
  });
}

// ----- Filters -----
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderProducts();
  });
});

// ----- Modal -----
function openModal(id) {
  const p = allProducts.find(x => x.id === id);
  if (!p) return;
  selectedProduct = p;
  selectedSize = null;
  selectedColor = p.colors[0];

  document.getElementById('modalImg').src = p.image;
  document.getElementById('modalCategory').textContent = categoryLabels[p.category][currentLang];
  document.getElementById('modalTitle').textContent = currentLang === 'uz' ? p.name_uz : p.name_en;
  document.getElementById('modalDesc').textContent = currentLang === 'uz' ? p.desc_uz : p.desc_en;
  document.getElementById('modalPrice').textContent = formatPrice(p.price);

  document.getElementById('modalSizes').innerHTML = p.sizes.map(s =>
    `<button class="size-btn" data-size="${s}">${s}</button>`
  ).join('');

  document.getElementById('modalColors').innerHTML = p.colors.map((c, i) =>
    `<span class="color-pick ${i === 0 ? 'selected' : ''}" style="background:${c}" data-color="${c}"></span>`
  ).join('');

  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSize = btn.dataset.size;
    });
  });

  document.querySelectorAll('.color-pick').forEach(swatch => {
    swatch.addEventListener('click', () => {
      document.querySelectorAll('.color-pick').forEach(s => s.classList.remove('selected'));
      swatch.classList.add('selected');
      selectedColor = swatch.dataset.color;
    });
  });

  document.getElementById('modalOverlay').classList.add('open');
}

document.getElementById('modalClose').addEventListener('click', () => {
  document.getElementById('modalOverlay').classList.remove('open');
});

document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target.id === 'modalOverlay') {
    document.getElementById('modalOverlay').classList.remove('open');
  }
});

// ----- Add to Cart -----
document.getElementById('modalAddCart').addEventListener('click', async () => {
  if (!selectedSize) {
    showToast(currentLang === 'uz' ? "Iltimos, o'lcham tanlang!" : 'Please select a size!');
    return;
  }
  try {
    const res = await fetch(`${API}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: selectedProduct.id,
        size: selectedSize,
        color: selectedColor,
        quantity: 1
      })
    });
    const data = await res.json();
    updateCartCount(data.cartCount);
    showToast(currentLang === 'uz' ? "Savatga qo'shildi!" : 'Added to cart!');
    document.getElementById('modalOverlay').classList.remove('open');
    fetchCart();
  } catch (err) {
    console.error(err);
    showToast(currentLang === 'uz' ? 'Xatolik yuz berdi' : 'Something went wrong');
  }
});

// ----- Cart -----
function updateCartCount(count) {
  const el = document.getElementById('cartCount');
  el.textContent = count;
  if (count > 0) el.classList.add('visible');
  else el.classList.remove('visible');
}

async function fetchCart() {
  try {
    const res = await fetch(`${API}/cart`);
    const items = await res.json();
    renderCart(items);
    const totalCount = items.reduce((s, i) => s + i.quantity, 0);
    updateCartCount(totalCount);
  } catch (err) {
    console.error(err);
  }
}

function renderCart(items) {
  const container = document.getElementById('cartItems');
  if (items.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div style="font-size:3rem;margin-bottom:1rem;">🛒</div>
        <p>${currentLang === 'uz' ? 'Savat bo\'sh' : 'Cart is empty'}</p>
      </div>`;
    document.getElementById('cartTotal').textContent = formatPrice(0);
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.product.image}" alt="">
      <div class="cart-item-info">
        <div class="cart-item-name">${currentLang === 'uz' ? item.product.name_uz : item.product.name_en}</div>
        <div class="cart-item-meta">
          ${currentLang === 'uz' ? "O'lcham" : 'Size'}: ${item.size} · ${currentLang === 'uz' ? 'Soni' : 'Qty'}: ${item.quantity}
        </div>
        <div class="cart-item-price">${formatPrice(item.product.price * item.quantity)}</div>
      </div>
      <button class="cart-item-remove" data-id="${item.id}">✕</button>
    </div>
  `).join('');

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  document.getElementById('cartTotal').textContent = formatPrice(total);

  container.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', async () => {
      await fetch(`${API}/cart/${btn.dataset.id}`, { method: 'DELETE' });
      fetchCart();
    });
  });
}

document.getElementById('cartBtn').addEventListener('click', () => {
  document.getElementById('cartSidebar').classList.add('open');
});

document.getElementById('cartClose').addEventListener('click', () => {
  document.getElementById('cartSidebar').classList.remove('open');
});

document.getElementById('checkoutBtn').addEventListener('click', () => {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
});

// ----- Order Submit -----
document.getElementById('submitOrder').addEventListener('click', async () => {
  const name = document.getElementById('orderName').value.trim();
  const phone = document.getElementById('orderPhone').value.trim();
  const address = document.getElementById('orderAddress').value.trim();

  if (!name || !phone) {
    showToast(currentLang === 'uz' ? 'Ism va telefon raqamni kiriting!' : 'Please enter name and phone!');
    return;
  }

  try {
    const res = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, address })
    });
    const data = await res.json();
    if (data.success) {
      showToast(currentLang === 'uz' ? `Buyurtma qabul qilindi! ID: ${data.orderId}` : `Order placed! ID: ${data.orderId}`);
      document.getElementById('orderName').value = '';
      document.getElementById('orderPhone').value = '';
      document.getElementById('orderAddress').value = '';
      document.getElementById('orderNote').value = '';
      updateCartCount(0);
      fetchCart();
    } else {
      showToast(data.error || 'Error');
    }
  } catch (err) {
    console.error(err);
    showToast(currentLang === 'uz' ? 'Xatolik yuz berdi' : 'Something went wrong');
  }
});

// ----- Init -----
fetchProducts();
fetchCart();

// ----- 3D Logo Tilt Effect -----
const logoImg = document.getElementById('heroLogoImg');
if (logoImg) {
  document.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    logoImg.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
  });
  
  // Sichqoncha ekrandan chiqqanda asl holatiga qaytish
  document.addEventListener('mouseleave', () => {
    logoImg.style.transform = `rotateY(0deg) rotateX(0deg)`;
  });
}

