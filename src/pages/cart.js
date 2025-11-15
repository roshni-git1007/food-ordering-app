const cartContainer = document.getElementById("cartContainer");

function loadCart() {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p class="text-gray-500">Your cart is empty.</p>`;
    return;
  }

  let total = 0;
  let html = "";

  cart.forEach((item) => {
    const subtotal = item.price * item.qty;
    total += subtotal;

    html += `
      <div class="flex items-center justify-between border-b py-3">
        <div class="flex items-center space-x-4">
          <img src="${item.image}" alt="${item.name}" class="w-12 h-12 rounded">
          <div>
            <p class="font-semibold">${item.name}</p>
            <p class="text-sm text-gray-600">$${item.price.toFixed(2)} × ${item.qty}</p>
            <p class="text-sm font-medium text-gray-800">Subtotal: $${subtotal.toFixed(2)}</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button class="px-2 py-1 bg-gray-200 rounded" data-action="minus" data-id="${item.id}">-</button>
          <span>${item.qty}</span>
          <button class="px-2 py-1 bg-gray-200 rounded" data-action="plus" data-id="${item.id}">+</button>
          <button class="ml-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" data-action="delete" data-id="${item.id}">
            Delete
          </button>
        </div>
      </div>
    `;
  });

  html += `
    <div class="mt-6 flex justify-between items-center">
      <span class="font-bold text-lg">Total: $${total.toFixed(2)}</span>
      <button id="placeOrderBtn" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Place Order
      </button>
    </div>
  `;

  cartContainer.innerHTML = html;
  attachCartButtons();
}

function attachCartButtons() {
  const buttons = cartContainer.querySelectorAll("button[data-action]");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      const id = btn.dataset.id;
      updateCart(action, id);
    });
  });

  const placeOrderBtn = document.getElementById("placeOrderBtn");
  if (placeOrderBtn) placeOrderBtn.addEventListener("click", placeOrder);
}

function updateCart(action, id) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const index = cart.findIndex((i) => i.id === id);
  if (index === -1) return;

  const item = cart[index];

  if (action === "plus") {
    item.qty += 1;
  } else if (action === "minus") {
    if (item.qty === 1) {
      if (!confirm(`Qty is 1. Delete "${item.name}" from cart?`)) return;
      cart.splice(index, 1);
    } else {
      item.qty -= 1;
    }
  } else if (action === "delete") {
    if (!confirm(`Are you sure you want to delete "${item.name}" from cart?`)) return;
    cart.splice(index, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function placeOrder() {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  if (cart.length === 0) return;
  if (!confirm("Are you sure you want to place the order?")) return;

  // Get current user
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  if (!currentUser.email) {
    alert("You must be logged in to place an order.");
    return;
  }

  // Use per-user orders key
  const ordersKey = `orders_${currentUser.email}`;
  let orders = JSON.parse(localStorage.getItem(ordersKey) || "[]");

  // Generate random short Order ID
  const orderId = "#ORD" + Math.floor(10000 + Math.random() * 90000);

  // Clone cart items
  const orderItems = cart.map(item => ({ ...item }));

  orders.push({
    id: orderId,
    items: orderItems,
    date: new Date().toISOString(),
    status: "Accepted",
  });

  localStorage.setItem(ordersKey, JSON.stringify(orders));
  localStorage.removeItem("cart");

  // alert("Order placed! View your order status in 'Your Orders' page.");
  window.location.href = "orders.html";
}

// Initialize
loadCart();