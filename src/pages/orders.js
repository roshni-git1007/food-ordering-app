const recentOrdersDiv = document.getElementById("recentOrders");
const pastOrdersDiv = document.getElementById("pastOrders");
const togglePastOrdersBtn = document.getElementById("togglePastOrders");

function getOrders() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const ordersKey = `orders_${currentUser.email}`;
  return orders = JSON.parse(localStorage.getItem(ordersKey) || "[]");
}

// Render recent orders
function renderRecentOrders() {
  const orders = getOrders();
  const recentOrders = orders.filter(o => o.status !== "Delivered");

  recentOrdersDiv.innerHTML = "";
  if (recentOrders.length === 0) {
    recentOrdersDiv.innerHTML = `<p class="text-gray-500">No recent orders.</p>`;
    return;
  }

  recentOrders.forEach(order => {
    const total = order.items.reduce((sum, i) => sum + i.price * i.qty, 0);

    const card = document.createElement("div");
    card.className = "bg-white shadow rounded-lg p-6 border";

    card.innerHTML = `
      <div class="flex justify-between mb-4">
        <h3 class="font-bold">Order ID: ${order.id}</h3>
        <span class="text-sm text-gray-500">${new Date(order.date).toLocaleString()}</span>
      </div>

      <div class="space-y-3">
  ${order.items.map(i => `
    <div class="flex justify-between items-center border-b pb-2">
      <div class="flex items-center space-x-2">
        <img src="${i.image || 'https://via.placeholder.com/40'}" class="w-10 h-10 object-cover rounded">
        <span>${i.name}</span>
      </div>
      <span class="text-sm text-gray-700">
        ${i.qty} × $${i.price.toFixed(2)} = 
        <b>$${(i.qty * i.price).toFixed(2)}</b>
      </span>
    </div>
  `).join("")}
</div>


      <div class="mt-4 flex justify-end">
        <span class="font-bold text-lg">Total: $${total.toFixed(2)}</span>
      </div>

      <div class="mt-4">
        <p class="mb-2">Status: <b>${order.status}</b></p>
        <div class="w-full bg-gray-200 rounded h-2">
          <div class="bg-green-500 h-2 rounded progress" style="width: ${getProgress(order.status)}%"></div>
        </div>
      </div>
    `;

    recentOrdersDiv.appendChild(card);

    simulateProgress(order);
  });
}

// Render past orders
function renderPastOrders() {
  const orders = getOrders();
  const pastOrders = orders.filter(o => o.status === "Delivered");

  pastOrdersDiv.innerHTML = "";
  if (pastOrders.length === 0) {
    pastOrdersDiv.innerHTML = `<p class="text-gray-500">No past orders.</p>`;
    return;
  }

  // Show newest first
  pastOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

  pastOrders.forEach(order => {
    const total = order.items.reduce((sum, i) => sum + i.price * i.qty, 0);

    const card = document.createElement("div");
    card.className = "bg-white shadow rounded-lg p-6 border";

    card.innerHTML = `
      <div class="flex justify-between mb-4">
        <h3 class="font-bold">Order ID: ${order.id}</h3>
        <span class="text-sm text-gray-500">${new Date(order.date).toLocaleString()}</span>
      </div>

      <div class="space-y-3">
        ${order.items.map(i => `
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <img src="${i.image || 'https://via.placeholder.com/40'}" class="w-10 h-10 object-cover rounded">
              <span>${i.name}</span>
            </div>
            <span class="text-sm text-gray-700">${i.qty} × $${i.price.toFixed(2)} = <b>$${(i.qty * i.price).toFixed(2)}</b></span>
          </div>
        `).join("")}
      </div>

      <div class="mt-4 font-semibold">Total: $${total.toFixed(2)}</div>
    `;
    pastOrdersDiv.appendChild(card);
  });
}

// Toggle past orders
togglePastOrdersBtn.addEventListener("click", () => {
  pastOrdersDiv.classList.toggle("hidden");
  togglePastOrdersBtn.textContent = pastOrdersDiv.classList.contains("hidden")
    ? "Show Past Orders"
    : "Hide Past Orders";
});

// Progress simulation
function simulateProgress(order) {
  if (order.status === "Accepted") {
    setTimeout(() => {
      updateOrderStatus(order.id, "Preparing");
      simulateProgress({ ...order, status: "Preparing" });
    }, 5000);
  } 
  else if (order.status === "Preparing") {
    setTimeout(() => {
      updateOrderStatus(order.id, "Ready for pickup");
      simulateProgress({ ...order, status: "Ready for pickup" });
    }, 5000);
  } 
  else if (order.status === "Ready for pickup") {
    setTimeout(() => {
      updateOrderStatus(order.id, "Out for Delivery");
      simulateProgress({ ...order, status: "Out for Delivery" });
    }, 5000);
  } else if (order.status === "Out for Delivery") {
  setTimeout(() => {
    updateOrderStatus(order.id, "Delivered");

    // Show one-time message 
    const msg = document.createElement("div");
    msg.textContent = "✅ Your order has been delivered! Click 'Show Past Orders' for more details.";
    msg.className = "bg-green-100 text-green-700 p-3 rounded mt-4";

    const recentOrdersDiv = document.getElementById("recentOrders");
    if (recentOrdersDiv) recentOrdersDiv.prepend(msg);

    // Auto-hide after 5 seconds
    setTimeout(() => msg.remove(), 5000);
  }, 5000);
}
}

function updateOrderStatus(orderId, newStatus) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const ordersKey = `orders_${currentUser.email}`;
  let orders = JSON.parse(localStorage.getItem(ordersKey) || "[]");

  const index = orders.findIndex(o => o.id === orderId);
  if (index === -1) return;

  orders[index].status = newStatus;
  localStorage.setItem(ordersKey, JSON.stringify(orders));

  renderRecentOrders();
  renderPastOrders();
}
function getProgress(status) {
  switch (status.toLowerCase()) {
    case "accepted": return 20;
    case "preparing": return 50;
    case "ready for pickup": return 70;
    case "out for delivery": return 90;
    case "delivered": return 100;
    default: return 0;
  }
}

// Initialize
renderRecentOrders();
renderPastOrders();
