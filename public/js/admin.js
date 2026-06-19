// ===== SUITS YOU — Admin Panel JS =====
const API = '/api';
const ADMIN_API = '/api/admin';

// ===== AUTH =====
function doLogin() {
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value.trim();
  const errEl = document.getElementById('loginError');

  if (user === 'admin' && pass === 'admin123') {
    sessionStorage.setItem('sy_admin', '1');
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminWrap').style.display = 'flex';
    initAdmin();
  } else {
    errEl.classList.add('show');
    setTimeout(() => errEl.classList.remove('show'), 3000);
  }
}

function doLogout() {
  sessionStorage.removeItem('sy_admin');
  document.getElementById('adminWrap').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
}

// Enter key on login
document.getElementById('loginPass').addEventListener('keydown', e => {
  if (e.key === 'Enter') doLogin();
});

document.getElementById('loginUser').addEventListener('keydown', e => {
  if (e.key === 'Enter') doLogin();
});

// Check session on load
if (sessionStorage.getItem('sy_admin')) {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminWrap').style.display = 'flex';
  initAdmin();
}

// ===== PAGE NAVIGATION =====
const pageTitles = {
  dashboard: 'Dashboard',
  products: 'Mahsulotlar Boshqaruvi',
  orders: 'Buyurtmalar',
  cart: 'Joriy Savat'
};

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(`page-${name}`).classList.add('active');
  document.querySelector(`[data-page="${name}"]`).classList.add('active');
  document.getElementById('topbarTitle').textContent = pageTitles[name];

  if (name === 'dashboard') loadDashboard();
  if (name === 'products') loadProducts();
  if (name === 'orders') loadOrders();
  if (name === 'cart') loadCart();
}

// ===== INIT =====
function initAdmin() {
  loadDashboard();
}

// ===== TOAST =====
function toast(msg, isError = false) {
  const t = document.getElementById('aToast');
  t.textContent = msg;
  t.style.borderColor = isError ? 'rgba(239,68,68,0.4)' : '#2e2e2e';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ===== FORMAT =====
function fmt(num) {
  return num.toLocaleString('en-US').replace(/,/g, ' ') + " so'm";
}

function fmtDate(iso) {
  return new Date(iso).toLocaleString('uz-UZ', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

// ===== DASHBOARD =====
async function loadDashboard() {
  try {
    const [statsRes, ordersRes, productsRes] = await Promise.all([
      fetch(`${API}/stats`),
      fetch(`${ADMIN_API}/orders`),
      fetch(`${API}/products`)
    ]);
    const stats = await statsRes.json();
    const orders = await ordersRes.json();
    const products = await productsRes.json();

    // Stats cards
    document.getElementById('stat-products').textContent = stats.totalProducts;
    document.getElementById('stat-orders').textContent = stats.totalOrders;
    document.getElementById('stat-cart').textContent = stats.cartItems;

    const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    document.getElementById('stat-revenue').textContent = revenue > 0
      ? (revenue / 1000000).toFixed(1) + ' mln'
      : '0';

    // Category bars
    const total = stats.totalProducts || 1;
    const cats = [
      { key: 'twopiece', label: 'Ikki Qismli', count: stats.categories.twopiece },
      { key: 'threepiece', label: 'Uch Qismli', count: stats.categories.threepiece },
      { key: 'shirt', label: "Ko'ylak", count: stats.categories.shirt },
      { key: 'sport', label: 'Sport Klass', count: stats.categories.sport },
    ];
    document.getElementById('categoryBars').innerHTML = cats.map(c => `
      <div class="cat-bar-item">
        <div class="cat-bar-label">
          <span>${c.label}</span>
          <span>${c.count} ta</span>
        </div>
        <div class="cat-bar-track">
          <div class="cat-bar-fill" style="width:${(c.count / total * 100).toFixed(0)}%"></div>
        </div>
      </div>
    `).join('');

    // Recent orders
    if (orders.length === 0) {
      document.getElementById('recentOrders').innerHTML = '<div class="empty-msg">Hali buyurtmalar yo\'q</div>';
    } else {
      document.getElementById('recentOrders').innerHTML = orders.slice(-5).reverse().map(o => `
        <div class="order-row">
          <div>
            <div class="order-id">${o.id}</div>
            <div class="order-name">${o.name}</div>
          </div>
          <div class="order-amount">${fmt(o.total)}</div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error(err);
  }
}

// ===== PRODUCTS =====
let productsCache = [];

async function loadProducts() {
  try {
    const res = await fetch(`${API}/products`);
    productsCache = await res.json();
    renderProductsTable(productsCache);
  } catch (err) {
    toast('Mahsulotlarni yuklashda xatolik', true);
  }
}

const catLabels = {
  twopiece: "Ikki Qismli",
  threepiece: "Uch Qismli",
  shirt: "Ko'ylak",
  sport: "Sport Klass"
};

function renderProductsTable(products) {
  const tbody = document.getElementById('productsBody');
  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7"><div class="empty-msg">Mahsulotlar yo\'q</div></td></tr>';
    return;
  }
  tbody.innerHTML = products.map(p => `
    <tr>
      <td><img class="prod-img-thumb" src="${p.image}" alt="${p.name_uz}" onerror="this.src='https://via.placeholder.com/48'"></td>
      <td>
        <div style="font-weight:600;font-size:0.85rem;">${p.name_uz}</div>
        <div style="color:#888;font-size:0.75rem;">${p.name_en}</div>
      </td>
      <td><span class="cat-badge cat-${p.category}">${catLabels[p.category]}</span></td>
      <td style="color:#c9a84c;font-weight:600;">${fmt(p.price)}</td>
      <td>${p.colors.map(c => `<span class="color-swatch-sm" style="background:${c}" title="${c}"></span>`).join('')}</td>
      <td style="color:${p.stock < 5 ? '#ef4444' : '#22c55e'};font-weight:600;">${p.stock} dona</td>
      <td>
        <div class="action-btns">
          <button class="edit-btn-sm" onclick="openProductModal(${p.id})">✏️ Tahrir</button>
          <button class="del-btn-sm" onclick="openDeleteModal(${p.id})">🗑️ O'chir</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ===== PRODUCT MODAL =====
let editingId = null;

function openProductModal(id = null) {
  editingId = id;
  const modal = document.getElementById('productModal');
  document.getElementById('modalTitle').textContent = id ? 'Mahsulotni Tahrirlash' : 'Yangi Mahsulot';

  if (id) {
    const p = productsCache.find(x => x.id === id);
    if (!p) return;
    document.getElementById('editId').value = p.id;
    document.getElementById('pNameUz').value = p.name_uz;
    document.getElementById('pNameEn').value = p.name_en;
    document.getElementById('pDescUz').value = p.desc_uz;
    document.getElementById('pDescEn').value = p.desc_en;
    document.getElementById('pCategory').value = p.category;
    document.getElementById('pPrice').value = p.price;
    document.getElementById('pStock').value = p.stock;
    document.getElementById('pImage').value = p.image;
    document.getElementById('pSizes').value = p.sizes.join(',');
    document.getElementById('pColors').value = p.colors.join(',');
    document.getElementById('pBadgeUz').value = p.badge_uz || '';
    document.getElementById('pBadgeEn').value = p.badge_en || '';
  } else {
    document.getElementById('editId').value = '';
    ['pNameUz','pNameEn','pDescUz','pDescEn','pPrice','pStock','pImage','pSizes','pColors','pBadgeUz','pBadgeEn'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById('pCategory').value = 'twopiece';
  }

  modal.style.display = 'flex';
}

function closeProductModal() {
  document.getElementById('productModal').style.display = 'none';
  editingId = null;
}

async function saveProduct() {
  const nameUz = document.getElementById('pNameUz').value.trim();
  const nameEn = document.getElementById('pNameEn').value.trim();
  const price = parseInt(document.getElementById('pPrice').value);
  const stock = parseInt(document.getElementById('pStock').value);

  if (!nameUz || !nameEn || !price) {
    toast('Majburiy maydonlarni to\'ldiring!', true);
    return;
  }

  const productData = {
    name_uz: nameUz,
    name_en: nameEn,
    desc_uz: document.getElementById('pDescUz').value.trim(),
    desc_en: document.getElementById('pDescEn').value.trim(),
    category: document.getElementById('pCategory').value,
    price: price,
    stock: stock || 0,
    image: document.getElementById('pImage').value.trim(),
    sizes: document.getElementById('pSizes').value.split(',').map(s => s.trim()).filter(Boolean),
    colors: document.getElementById('pColors').value.split(',').map(c => c.trim()).filter(Boolean),
    badge_uz: document.getElementById('pBadgeUz').value.trim() || null,
    badge_en: document.getElementById('pBadgeEn').value.trim() || null,
  };

  try {
    let res;
    if (editingId) {
      res = await fetch(`${ADMIN_API}/products/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
    } else {
      res = await fetch(`${ADMIN_API}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
    }

    const data = await res.json();
    if (data.success) {
      toast(editingId ? '✅ Mahsulot yangilandi!' : '✅ Yangi mahsulot qo\'shildi!');
      closeProductModal();
      loadProducts();
    } else {
      toast(data.error || 'Xatolik', true);
    }
  } catch (err) {
    toast('Server bilan bog\'lanishda xatolik', true);
  }
}

// ===== DELETE =====
let deleteTargetId = null;

function openDeleteModal(id) {
  deleteTargetId = id;
  document.getElementById('deleteModal').style.display = 'flex';
  document.getElementById('confirmDeleteBtn').onclick = async () => {
    try {
      const res = await fetch(`${ADMIN_API}/products/${deleteTargetId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast('🗑️ Mahsulot o\'chirildi!');
        closeDeleteModal();
        loadProducts();
      }
    } catch (err) {
      toast('Xatolik yuz berdi', true);
    }
  };
}

function closeDeleteModal() {
  document.getElementById('deleteModal').style.display = 'none';
  deleteTargetId = null;
}

// Close modals on backdrop click
document.getElementById('productModal').addEventListener('click', e => {
  if (e.target === document.getElementById('productModal')) closeProductModal();
});
document.getElementById('deleteModal').addEventListener('click', e => {
  if (e.target === document.getElementById('deleteModal')) closeDeleteModal();
});

// ===== ORDERS =====
async function loadOrders() {
  try {
    const res = await fetch(`${ADMIN_API}/orders`);
    const orders = await res.json();
    const tbody = document.getElementById('ordersBody');

    if (orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7"><div class="empty-msg">Hali buyurtmalar yo\'q</div></td></tr>';
      return;
    }

    tbody.innerHTML = [...orders].reverse().map(o => `
      <tr>
        <td style="color:#c9a84c;font-weight:600;font-size:0.78rem;">${o.id}</td>
        <td style="font-weight:600;">${o.name}</td>
        <td>${o.phone}</td>
        <td style="color:#888;">${o.address || '—'}</td>
        <td style="color:#22c55e;font-weight:700;">${fmt(o.total)}</td>
        <td><span class="status-badge status-${o.status === 'done' ? 'done' : 'pending'}">
          ${o.status === 'done' ? '✅ Bajarildi' : '⏳ Kutilmoqda'}
        </span></td>
        <td style="color:#888;font-size:0.78rem;">${fmtDate(o.createdAt)}</td>
      </tr>
    `).join('');
  } catch (err) {
    toast('Buyurtmalarni yuklashda xatolik', true);
  }
}

// ===== CART =====
async function loadCart() {
  try {
    const res = await fetch(`${API}/cart`);
    const items = await res.json();
    const container = document.getElementById('cartContent');

    if (items.length === 0) {
      container.innerHTML = '<div class="empty-msg">🛒 Savat bo\'sh</div>';
      return;
    }

    const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
    container.innerHTML = `
      <div style="margin-bottom:1rem;color:#888;font-size:0.85rem;">
        Jami <b style="color:#c9a84c">${items.length} xil</b> mahsulot, 
        umumiy: <b style="color:#22c55e">${fmt(total)}</b>
      </div>
      <div class="cart-grid">
        ${items.map(i => `
          <div class="cart-card">
            <img src="${i.product.image}" alt="${i.product.name_uz}">
            <div>
              <div class="cart-card-name">${i.product.name_uz}</div>
              <div class="cart-card-meta">O'lcham: ${i.size} · Soni: ${i.quantity}</div>
              <div class="cart-card-price">${fmt(i.product.price * i.quantity)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (err) {
    toast('Savatni yuklashda xatolik', true);
  }
}
