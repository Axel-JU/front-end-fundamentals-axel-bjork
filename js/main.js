document.querySelectorAll("#add-to-cart-btn").forEach((button) => {
  button.addEventListener("click", addProductToCart);
});

function addProductToCart() {
    cart = localStorage.getItem("cart");
    if (cart !== null) {
        cart = JSON.parse(cart);
        cart.items.push("Product Name");
        localStorage.setItem("cart", JSON.stringify(cart));
    } else {
        localStorage.setItem("cart", JSON.stringify({ items: ["Product Name"] }));
    }
    alert(`Product added to cart!`);
    console.log(localStorage.getItem("cart"));
}