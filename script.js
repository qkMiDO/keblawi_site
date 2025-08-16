const products = [
  { id: 1, name: "فلتر زيت - Toyota", price: 200, type: "toyota" },
  { id: 2, name: "فلتر هواء - Hyundai", price: 150, type: "hyundai" },
];

const productList = document.getElementById("productList");
if (productList) {
  function renderProducts(list) {
    productList.innerHTML = "";
    list.forEach(p => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <h3>${p.name}</h3>
        <p>السعر: ${p.price} EGP</p>
        <button onclick="addToCart(${p.id})">إضافة للسلة</button>
      `;
      productList.appendChild(div);
    });
  }
  renderProducts(products);

  document.getElementById("search").addEventListener("input", (e) => {
    const val = e.target.value.toLowerCase();
    renderProducts(products.filter(p => p.name.toLowerCase().includes(val)));
  });
}

let cart = [];
function addToCart(id) {
  const product = products.find(p => p.id === id);
  cart.push(product);
  alert("تمت الإضافة إلى السلة");
  localStorage.setItem("orders", JSON.stringify(cart));
}

const ordersTable = document.querySelector("#ordersTable tbody");
if (ordersTable) {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.forEach((o, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i+1}</td>
      <td>عميل تجريبي</td>
      <td>${o.name}</td>
      <td>${o.price} EGP</td>
      <td><button>عرض</button></td>
      <td>جديد</td>
    `;
    ordersTable.appendChild(tr);
  });
}
// صفحة الدفع
const paymentForm = document.getElementById("paymentForm");
if (paymentForm) {
  const total = cart.reduce((sum, p) => sum + p.price, 0);
  document.getElementById("totalAmount").textContent = total;

  paymentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const file = document.getElementById("screenshot").files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        orders.push({
          id: Date.now(),
          products: cart,
          total: total,
          screenshot: event.target.result,
          status: "قيد المراجعة"
        });
        localStorage.setItem("orders", JSON.stringify(orders));
        alert("تم إرسال الطلب بنجاح!");
        window.location.href = "index.html";
      };
      reader.readAsDataURL(file);
    }
  });
}

// تحديث Dashboard بالسكرين
if (ordersTable) {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.forEach((o, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i+1}</td>
      <td>عميل تجريبي</td>
      <td>${o.products.map(p => p.name).join(", ")}</td>
      <td>${o.total} EGP</td>
      <td>
        ${o.screenshot ? `<img src="${o.screenshot}" width="100">` : "لا يوجد"}
      </td>
      <td>${o.status}</td>
    `;
    ordersTable.appendChild(tr);
  });
}
