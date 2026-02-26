// localStorage.clear();
import db from "./db.js";
// import { plus, minus, createIcons } from "lucide";

setup();
updateCartCount();
loadProducts();

function setup() {
  //checks if cart exists in localStorage, if not creates it
  if (localStorage.getItem("cart") === null) {
    localStorage.setItem("cart", JSON.stringify({ items: [] }));
  }
  console.log("cart should be in local storage", localStorage.getItem("cart"));

  //adds event listener to all add to cart buttons
  document.querySelectorAll("#add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = e.target.getAttribute("data-product-id");
      manageProductInCart(productId, 1);
    });
  });

  document.querySelectorAll(".cart-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      document
        .querySelector(".cart-drawer")
        .classList.toggle("cart-drawer-show");
    });
  });
}

function getProductFromDB(productId) {
  for (let i = 0; i < db.length; i++) {
    if (db[i].productId == productId) {
      console.log("Found product in DB: ", db[i]);
      return db[i];
    }
  }
  console.log("did not find any products in db with id: ", productId);
}

function updateDrawerProducts(cart) {
  document.querySelector("#cart-items-container").innerHTML = "";
  let emptyCart = true;
  for (let i = 0; i < cart.items.length; i++) {
    if (cart.items[i].amount > 0) {
      emptyCart = false;
      let product = getProductFromDB(cart.items[i].id);
      let productItem = document.createElement("div");
      productItem.innerHTML = `
    <div class="cart-item">
      <img src="${product.image}" alt="${product.name}-image" class="cart-item-image">
      <div class="cart-item-info">
        <h4>${product.name}</h4>
        <p>${product.price} kr</p>
      </div>
      <div class="cart-item-manager">
        <button class="add-item" data-id="${product.id}">
          <i data-lucide="plus"></i>
        </button>
        <p>${cart.items[i].amount}</p>
        <button class="remove-item" data-id="${product.id}">
          <i data-lucide="minus"></i>
        </button>
      </div>
    </div>
  `;

      document.querySelector("#cart-items-container").appendChild(productItem);

      document.querySelector(".add-item").addEventListener("click", (e) => {
        manageProductInCart(cart.items[i].id, 1);
      });
      document.querySelector(".remove-item").addEventListener("click", (e) => {
        manageProductInCart(cart.items[i].id, -1);
      });

      lucide.createIcons();
    }
  }
  if (emptyCart) {
    let emptyCartItem = document.createElement("h2");
    emptyCartItem.textContent = "Cart empty";
    document.querySelector("#cart-items-container").appendChild(emptyCartItem);
  }
}

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart"));
  console.log("cart found when updating cart!", cart);
  let cartCount = 0;
  for (let i = 0; i < cart.items.length; i++) {
    cartCount += cart.items[i].amount;
  }

  document.querySelector("#cart-count").textContent = cartCount
    ? cartCount
    : "";
  updateDrawerProducts(cart);
}

function manageProductInCart(productId, delta) {
  console.log("starting add product seq with productId: ", productId);
  let cart = JSON.parse(localStorage.getItem("cart"));

  let foundIndex = null;
  for (let i = 0; i < cart.items.length; i++) {
    if (cart.items[i].id === productId) {
      foundIndex = i;
      break;
    }
  }
  console.log("foundindex: ", foundIndex);
  if (foundIndex != null) {
    cart.items[foundIndex].amount += delta;
  } else {
    cart.items.push({ id: productId, amount: delta });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function loadProducts() {
  document.querySelectorAll(".product-card").forEach((card, index) => {
    let name;
    let price;
    let description;
    let image;
    let htmlProductId = card.getAttribute("data-product-id");
    for (let i = 0; i < db.length; i++) {
      if (db[i].productId == htmlProductId) {
        name = db[i].name;
        price = db[i].price;
        description = db[i].description;
        image = db[i].image;
      }
    }
    card.querySelector(".product-name").textContent = name;
    card.querySelector(".product-price").textContent = "€" + price;
    card.querySelector(".product-image").src = image;
  });
}
