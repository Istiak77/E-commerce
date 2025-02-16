// OPEN & CLOSE CART
const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const closeCart = document.querySelector("#cart-close");

cartIcon.addEventListener("click", () => {
  cart.classList.toggle("active");
});

closeCart.addEventListener("click", () => {
  cart.classList.remove("active");
});

// Start when the document is ready
if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}

// =============== START ====================
function start() {
  fetchProducts();
}

// ============= FETCH PRODUCTS FROM JSON ===========
function fetchProducts() {
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      // Dynamically create product boxes
      const shopContent = document.querySelector(".shop-content");
      data.forEach((product) => {
        const productBox = document.createElement("div");
        productBox.classList.add("product-box");

        productBox.innerHTML = `
          <img src="${product.image}" alt="${product.name}" class="product-img">
          <h2 class="product-title">${product.name}</h2>
          <span class="product-price">$${product.price}</span>
          <p class="product-description">${product.description}</p>
          <i class='bx bx-shopping-bag add-cart'></i>
        `;

        shopContent.appendChild(productBox);
      });

      // Add event listeners after products are loaded
      addEvents();
    })
    .catch((error) => console.error("Error loading products:", error));
}

// ============= UPDATE & RERENDER ===========
function update() {
  addEvents();
  updateTotal();
}

// =============== ADD EVENTS ===============
function addEvents() {
  // Remove items from cart
  let cartRemove_btns = document.querySelectorAll(".cart-remove");
  cartRemove_btns.forEach((btn) => {
    btn.addEventListener("click", handle_removeCartItem);
  });

  // Change item quantity
  let cartQuantity_inputs = document.querySelectorAll(".cart-quantity");
  cartQuantity_inputs.forEach((input) => {
    input.addEventListener("change", handle_changeItemQuantity);
  });

  // Add item to cart
  let addCart_btns = document.querySelectorAll(".add-cart");
  addCart_btns.forEach((btn) => {
    btn.addEventListener("click", handle_addCartItem);
  });

  const buy_btn = document.querySelector(".btn-buy");
  if (buy_btn) {
    buy_btn.addEventListener("click", handle_buyOrder);
  }

  const clearCart_btn = document.querySelector(".btn-clear-cart");
  if (clearCart_btn) {
    clearCart_btn.addEventListener("click", handle_clearCart);
  }

  // Product Description Hover
  document.querySelectorAll(".product-box").forEach((box) => {
    let desc = box.querySelector(".product-description");

    // Show on hover
    box.addEventListener("mouseenter", () => {
      if (desc.style.display !== "block") {
        desc.style.display = "block";
        setTimeout(() => {
          desc.style.opacity = "1";
          desc.style.transform = "translateY(0)";
        }, 10);
      }
    });

    // Hide on mouse leave (only if not toggled open)
    box.addEventListener("mouseleave", () => {
      if (!box.classList.contains("desc-open")) {
        desc.style.opacity = "0";
        desc.style.transform = "translateY(10px)";
        setTimeout(() => {
          desc.style.display = "none";
        }, 300);
      }
    });

    // Toggle on click (anywhere except the add-to-cart button)
    box.addEventListener("click", (e) => {
      // Don't toggle if clicking the add-to-cart button
      if (!e.target.closest(".add-cart")) {
        if (box.classList.contains("desc-open")) {
          // Hide description
          desc.style.opacity = "0";
          desc.style.transform = "translateY(10px)";
          setTimeout(() => {
            desc.style.display = "none";
          }, 300);
          box.classList.remove("desc-open");
        } else {
          // Show description
          desc.style.display = "block";
          setTimeout(() => {
            desc.style.opacity = "1";
            desc.style.transform = "translateY(0)";
          }, 10);
          box.classList.add("desc-open");
        }
      }
    });
  });
}

// ============= HANDLE EVENTS FUNCTIONS =============
let itemsAdded = [];

function handle_addCartItem() {
  let product = this.parentElement;
  let title = product.querySelector(".product-title").innerHTML;
  let price = product.querySelector(".product-price").innerHTML;
  let imgSrc = product.querySelector(".product-img").src;

  let newToAdd = { title, price, imgSrc };

  // Check if the item already exists
  if (itemsAdded.find((el) => el.title == newToAdd.title)) {
    alert("This Item Is Already In The Cart!");
    return;
  } else {
    itemsAdded.push(newToAdd);
    showNotification(title, price.replace("$", ""));
  }

  // Add product to cart
  let cartBoxElement = CartBoxComponent(title, price, imgSrc);
  let newNode = document.createElement("div");
  newNode.innerHTML = cartBoxElement;
  const cartContent = cart.querySelector(".cart-content");
  cartContent.appendChild(newNode);

  update();
}

function handle_removeCartItem() {
  this.parentElement.remove();
  itemsAdded = itemsAdded.filter(
    (el) =>
      el.title !=
      this.parentElement.querySelector(".cart-product-title").innerHTML
  );

  update();
}

function handle_changeItemQuantity() {
  if (isNaN(this.value) || this.value < 1) {
    this.value = 1;
  }
  this.value = Math.floor(this.value); // To keep it an integer

  update();
}

function handle_buyOrder() {
  if (itemsAdded.length <= 0) {
    alert("There is No Order to Place Yet! \nPlease Make an Order first.");
    return;
  }
  const cartContent = cart.querySelector(".cart-content");
  cartContent.innerHTML = "";
  alert("Your Order is Placed Successfully :)");
  itemsAdded = [];

  update();
}

// =========== CLEAR CART FUNCTION ===========
function handle_clearCart() {
  const cartContent = cart.querySelector(".cart-content");
  cartContent.innerHTML = ""; // Clear all items
  itemsAdded = []; // Reset the cart items array
  update(); // Update the UI
}

// =========== UPDATE & RERENDER FUNCTIONS =========
function updateTotal() {
  let cartBoxes = document.querySelectorAll(".cart-box");
  const totalElement = cart.querySelector(".total-price");
  let total = 0;
  cartBoxes.forEach((cartBox) => {
    let priceElement = cartBox.querySelector(".cart-price");
    let price = parseFloat(priceElement.innerHTML.replace("$", ""));
    let quantity = cartBox.querySelector(".cart-quantity").value;
    total += price * quantity;
  });

  // Keep 2 digits after the decimal point
  totalElement.innerHTML = `$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  totalElement.innerHTML = "$" + total;
}

// ============= HTML COMPONENTS =============
function CartBoxComponent(title, price, imgSrc) {
  return `
    <div class="cart-box">
        <img src=${imgSrc} alt="" class="cart-img">
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" value="1" class="cart-quantity">
        </div>
        <!-- REMOVE CART  -->
        <i class='bx bxs-trash-alt cart-remove'></i>
    </div>`;
}

// ============= NOTIFICATION FUNCTION =============
function showNotification(productName, price) {
  let notification = document.createElement("div");
  notification.classList.add("notification");
  notification.innerText = `${productName} added to cart ($${price})`;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

//promo-code


const promoCodes = {
  ostad10: 0.1, // 10% discount
  ostad5: 0.05, // 5% discount
};

// Function to apply promo code
function applyPromoCode() {
  const promoCodeInput = document.getElementById("promo-code-input").value.trim();
  const promoMessage = document.querySelector(".promo-message");
  const discountElement = document.getElementById("discount");
  const finalTotalElement = document.getElementById("final-total");
  const subtotalElement = document.getElementById("subtotal");

 
  if (promoCodes.hasOwnProperty(promoCodeInput)) {
    const discountRate = promoCodes[promoCodeInput];
    const subtotal = parseFloat(subtotalElement.innerHTML.replace("$", ""));
    const discount = subtotal * discountRate;
    const finalTotal = subtotal - discount;


    discountElement.innerHTML = `$${discount.toFixed(2)}`;
    finalTotalElement.innerHTML = `$${finalTotal.toFixed(2)}`;
    promoMessage.innerHTML = "Promo code applied successfully!";
    promoMessage.style.color = "green";
  } else {
  
    promoMessage.innerHTML = "Invalid promo code. Please try again.";
    promoMessage.style.color = "red";
  }
}


document.getElementById("apply-promo-btn").addEventListener("click", applyPromoCode);


function updateCartSummary() {
  const subtotalElement = document.getElementById("subtotal");
  const discountElement = document.getElementById("discount");
  const finalTotalElement = document.getElementById("final-total");

  let subtotal = 0;
  document.querySelectorAll(".cart-box").forEach((cartBox) => {
    const price = parseFloat(cartBox.querySelector(".cart-price").innerHTML.replace("$", ""));
    const quantity = parseInt(cartBox.querySelector(".cart-quantity").value);
    subtotal += price * quantity;
  });

  subtotalElement.innerHTML = `$${subtotal.toFixed(2)}`;

  // Check if a promo code is applied
  const promoCodeInput = document.getElementById("promo-code-input").value.trim();
  if (promoCodes.hasOwnProperty(promoCodeInput)) {
    const discountRate = promoCodes[promoCodeInput];
    const discount = subtotal * discountRate;
    const finalTotal = subtotal - discount;

    discountElement.innerHTML = `$${discount.toFixed(2)}`;
    finalTotalElement.innerHTML = `$${finalTotal.toFixed(2)}`;
  } else {

    discountElement.innerHTML = "$0.00";
    finalTotalElement.innerHTML = `$${subtotal.toFixed(2)}`;
  }
}


function update() {
  addEvents();
  updateTotal();
  updateCartSummary(); // Add this line
}