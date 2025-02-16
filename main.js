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
  addEvents();
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

  // Buy Order
  const buy_btn = document.querySelector(".btn-buy");
  buy_btn.addEventListener("click", handle_buyOrder);

  // Clear Cart
  const clearCart_btn = document.querySelector(".btn-clear-cart");
  clearCart_btn.addEventListener("click", handle_clearCart);
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
  total = total.toFixed(2);
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

// ============= PRODUCT DESCRIPTION=============
document.querySelectorAll('.product-box').forEach(box => {
  box.addEventListener('click', function () {
      let desc = this.querySelector('.product-description');
      desc.style.display = (desc.style.display === 'block') ? 'none' : 'block';
  });

  box.addEventListener('mouseleave', function () {
      let desc = this.querySelector('.product-description');
      desc.style.display = 'none';
  });
});


// ============= CHECKOUT DETAILS=============
document.querySelector('.btn-buy').addEventListener('click', function () {
  let cartItems = document.querySelectorAll('.cart-box');
  if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
  }

  let summary = "Your Order Summary:\n\n";
  let totalPrice = 0;

  cartItems.forEach(item => {
      let title = item.querySelector('.cart-product-title').innerText;
      let price = parseFloat(item.querySelector('.cart-price').innerText.replace('$', ''));
      let quantity = item.querySelector('.cart-quantity').value;
      let totalItemPrice = price * quantity;

      summary += `${title} - $${price} x ${quantity} = $${totalItemPrice.toFixed(2)}\n`;
      totalPrice += totalItemPrice;
  });

  summary += `\nTotal Price: $${totalPrice.toFixed(2)}`;

  alert(summary);
});

// Function to show notification
function showNotification(productName, price) {
  let notification = document.createElement("div");
  notification.classList.add("notification");
  notification.innerText = `${productName} added to cart ($${price})`;

  document.body.appendChild(notification);


  setTimeout(() => {
      notification.remove();
  }, 3000);
}

document.querySelectorAll('.add-cart').forEach(button => {
  button.addEventListener('click', function () {
      let productBox = this.parentElement;
      let productName = productBox.querySelector('.product-title').innerText;
      let productPrice = productBox.querySelector('.product-price').innerText.replace('$', '');


      showNotification(productName, productPrice);

  });
});

document.querySelectorAll('.product-box').forEach(box => {
  let desc = box.querySelector('.product-description');

  box.addEventListener('mouseenter', function () {
      desc.style.display = 'block';
      setTimeout(() => {
          desc.style.opacity = '1';
          desc.style.transform = 'translateY(0)';
      }, 10); // Small delay to trigger transition properly
  });

  box.addEventListener('mouseleave', function () {
      desc.style.opacity = '0';
      desc.style.transform = 'translateY(10px)';
      setTimeout(() => {
          desc.style.display = 'none';
      }, 300); // Wait for animation to finish before hiding
  });
});
