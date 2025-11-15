// home.js — load menu dynamically and handle Add to Cart

const menuContainer = document.getElementById("menuContainer");

// Load menu items from menu.json
async function loadMenu() {
  try {
    const res = await fetch("../data/menu.json");
    const menu = await res.json();

    menuContainer.innerHTML = "";

    menu.forEach((item) => {
      const card = document.createElement("div");
      card.className = "border rounded p-4 flex flex-col items-center hover:shadow-xl transition max-h-96";

      card.innerHTML = `<div class="w-full h-[13rem] flex-shrink-0 mb-2">
    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover rounded"></div><h2 class="font-bold text-lg text-center">${item.name}</h2>
  <p class="text-sm text-gray-600 text-center mb-1">${item.description}</p>
  <p class="font-semibold text-center mb-2">$${item.price.toFixed(2)}</p>
  <button 
  class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full" 
  data-id="${item.id}" 
  data-name="${item.name}" 
  data-price="${item.price}" 
  data-image="${item.image}">Add to Cart</button>`;
      menuContainer.appendChild(card);
    });

    // Attach click events to Add to Cart buttons
    const buttons = menuContainer.querySelectorAll("button");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => addToCart(btn));
    });
  } catch (err) {
    menuContainer.innerHTML = "<p class='text-red-500'>Failed to load menu.</p>";
    console.error(err);
  }
}

// Toggle dropdown
document.addEventListener("click", (e) => {
  const menu = document.getElementById("profileMenu");
  const btn = document.getElementById("profileBtn");
  if (btn && btn.contains(e.target)) {
    menu.classList.toggle("hidden");
  } else if (menu && !menu.contains(e.target)) {
    menu.classList.add("hidden");
  }
});

// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      window.location.href = "./login.html";
    }
  });
}


// Add item to cart (localStorage)
function addToCart(btn) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const id = btn.dataset.id;
  const name = btn.dataset.name;
  const price = parseFloat(btn.dataset.price);
  const image = btn.dataset.image || btn.closest("div").querySelector("img").src;
  // fallback: grab image from card

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id,
      name,
      price,
      image,
      qty: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`Added ${name} to cart!`);
}
// Initialize
loadMenu();