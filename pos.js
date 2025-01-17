document.addEventListener("DOMContentLoaded", function () {
    const productTable = document.getElementById("productTable").getElementsByTagName('tbody')[0];
    const cartTable = document.getElementById("cartTable").getElementsByTagName('tbody')[0];
    const totalAmountElement = document.getElementById("totalAmount");
    const checkoutButton = document.getElementById("checkoutButton");

    let products = JSON.parse(localStorage.getItem("products")) || [];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Sample products (if localStorage is empty)
    if (products.length === 0) {
        products = [
            
        ];
        localStorage.setItem("products", JSON.stringify(products));
    }

    // Render product table
    function renderProductTable() {
        productTable.innerHTML = "";
        products.forEach((product, index) => {
            const row = productTable.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${product.name}</td>
                <td>$${product.price}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="addToCart('${product.id}')">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </td>
            `;
        });
    }

    // Render cart table
    function renderCartTable() {
        cartTable.innerHTML = "";
        let totalAmount = 0;

        cart.forEach((item, index) => {
            const row = cartTable.insertRow();
            const subtotal = item.price * item.quantity;
            totalAmount += subtotal;

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td>${item.quantity}</td>
                <td>$${subtotal}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash-alt"></i> Remove
                    </button>
                </td>
            `;
        });

        totalAmountElement.textContent = totalAmount.toFixed(2);
    }

    // Add to cart
    window.addToCart = function (productId) {
        const product = products.find((p) => p.id === productId);

        if (product && product.stock > 0) {
            const cartItem = cart.find((item) => item.id === productId);

            if (cartItem) {
                cartItem.quantity += 1;
            } else {
                cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
            }

            product.stock -= 1;
            localStorage.setItem("products", JSON.stringify(products));
            localStorage.setItem("cart", JSON.stringify(cart));

            renderProductTable();
            renderCartTable();

            Swal.fire("Success", "Product added to cart!", "success");
        } else {
            Swal.fire("Error", "Product is out of stock!", "error");
        }
    };

    // Remove from cart
    window.removeFromCart = function (index) {
        const cartItem = cart[index];
        const product = products.find((p) => p.id === cartItem.id);

        if (cartItem && product) {
            product.stock += cartItem.quantity;
            cart.splice(index, 1);

            localStorage.setItem("products", JSON.stringify(products));
            localStorage.setItem("cart", JSON.stringify(cart));

            renderProductTable();
            renderCartTable();

            Swal.fire("Success", "Product removed from cart!", "success");
        }
    };

    // Checkout
    checkoutButton.addEventListener("click", function () {
        if (cart.length === 0) {
            Swal.fire("Error", "Your cart is empty!", "error");
        } else {
            Swal.fire("Success", "Transaction completed!", "success").then(() => {
                cart = [];
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCartTable();
            });
        }
    });

    // Load initial data
    renderProductTable();
    renderCartTable();
});
