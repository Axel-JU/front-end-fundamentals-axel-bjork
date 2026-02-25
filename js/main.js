setup();
updateCartCount();
loadProducts();

import db from "./db.js";

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
      addProductToCart(productId);
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

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart"));
  console.log("cart found when updating cart!", cart);
  let cartCount = cart.items.length;
  document.querySelector("#cart-count").textContent = cartCount
    ? cartCount
    : "";
}

function addProductToCart(ProductId) {
  let cart = JSON.parse(localStorage.getItem("cart"));

  cart.items.push(ProductId);
  localStorage.setItem("cart", JSON.stringify(cart));

  alert(`Product added to cart!`);
  console.log(localStorage.getItem("cart"));
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
// localStorage.clear();
