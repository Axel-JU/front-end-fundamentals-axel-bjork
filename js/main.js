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
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = e.target.getAttribute("data-product-id");
      if (productId == null) {
        console.error("could not find product id in button dataset");
        return;
      }
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

  document.querySelectorAll(".mobile-menu-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      document
        .querySelector(".mobile-header-menu")
        .classList.toggle("mobile-menu-show");
    });
  });

  document.querySelectorAll(".arrow").forEach((button) => {
    button.addEventListener("click", (e) => {
      changeImage(e.currentTarget);
    });
  });
}

function changeImage(target) {
  const image = document.querySelector(".product-container img");
  const src = image.src;
  const direction = target.getAttribute("data-slide-direction");
  const id = new URLSearchParams(window.location.search).get("id");
  let num;
  let filename = src.split("/")[src.split("/").length - 1];
  for (let i = 0; i < db[id - 1].images.length; i++) {
    if (
      filename ===
      db[id - 1].images[i].split("/")[
        db[id - 1].images[i].split("/").length - 1
      ]
    ) {
      num = i;
      break;
    }
  }
  if (direction == 1) {
    if (num < 3) {
      image.src = db[id - 1].images[num + 1];
    } else {
      image.src = db[id - 1].images[0];
    }
  } else {
    if (num === 0) {
      image.src = db[id - 1].images[3];
    } else {
      image.src = db[id - 1].images[num - 1];
    }
  }
}

function getProductFromDB(productId) {
  for (let i = 0; i < db.length; i++) {
    if (db[i].productId == productId) {
      console.log("Found product in DB: ", db[i]);
      return db[i];
    }
  }
  console.log("did not find any products in db with id: ", productId);
  console.log("localStorage: ", localStorage.getItem("cart"));
}

function updateDrawerProducts(cart) {
  // Updates the html in the cart, with the products in localstorage cart
  document.querySelector("#cart-items-container").innerHTML = "";
  let emptyCart = true;
  for (let i = 0; i < cart.items.length; i++) {
    if (cart.items[i].amount > 0) {
      emptyCart = false;
      let product = getProductFromDB(cart.items[i].id);
      let productItem = document.createElement("div");
      productItem.innerHTML = `
    <div class="cart-item">
      <div class="cart-item-image-container">
        <img src="${product.images[0]}" alt="${product.name}-image" class="cart-item-image">
      </div>
      <div class="cart-item-info">
        <h3>${product.name}</h3>
        <p>€${product.price}</p>
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

      productItem.querySelector(".add-item").addEventListener("click", (e) => {
        manageProductInCart(cart.items[i].id, 1);
      });
      productItem
        .querySelector(".remove-item")
        .addEventListener("click", (e) => {
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
  //Updates the cart count in the header and the products in the cart drawer
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
  //Adds or removes a product from shopping cart
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
  console.log("cart updated in localStorage: ", cart);
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
        image = db[i].images[0];
      }
    }
    card.querySelector(".product-name").textContent = name;
    card.querySelector(".product-price").textContent = "€" + price;
    card.querySelector(".product-image").src = image;
  });
}

function loadProductPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  let name;
  let price;
  let description;
  let image;
  for (let i = 0; i < db.length; i++) {
    if (db[i].productId == productId) {
      name = db[i].name;
      price = db[i].price;
      description = db[i].description;
      image = db[i].images[0];
    }
  }
  document.querySelector(".product-info h1").textContent = name;
  document.querySelector(".product-info p").textContent = description;
  document.querySelector(".product-info p:nth-child(3)").textContent =
    "€" + price;
  document.querySelector(".product-container img").src = image;
}

if (window.location.pathname == "/product.html") {
  console.log(window.location.pathname);
  loadProductPage();
}
