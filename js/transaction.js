document.addEventListener("DOMContentLoaded", function() {
    let products = [
        { id: 1, name: "Product 1", price: 100 },
        { id: 2, name: "Product 2", price: 200 },
        { id: 3, name: "Product 3", price: 150 },
    ];

    let cart = [];
    const customerId = document.getElementById("customerId").value;

    // Generate unique IDs
    function generateUniqueId(prefix) {
        return prefix + "-" + Date.now();
    }

    // Render Product List
    function renderProductList() {
        const productList = document.getElementById("productList");
        productList.innerHTML = '';
        
        products.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("card", "mb-3", "col-4");
            productDiv.innerHTML = `
                <img src="https://via.placeholder.com/150" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">$${product.price}</p>
                    <button class="btn btn-primary addToCartBtn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
                        Add to Cart
                    </button>
                </div>
            `;
            productList.appendChild(productDiv);
        });
    }

    // Add Product to Cart
    document.getElementById("productList").addEventListener("click", function(e) {
        if (e.target && e.target.classList.contains("addToCartBtn")) {
            const productId = e.target.getAttribute("data-id");
            const productName = e.target.getAttribute("data-name");
            const productPrice = parseInt(e.target.getAttribute("data-price"));

            const productInCart = cart.find(item => item.id == productId);

            if (productInCart) {
                productInCart.quantity++;
            } else {
                cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
            }

            renderCart();
        }
    });

    // Render Cart
    function renderCart() {
        const cartTableBody = document.getElementById("cartTable").getElementsByTagName("tbody")[0];
        cartTableBody.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const row = cartTableBody.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td>
                    <button class="btn btn-danger decreaseBtn" data-id="${item.id}">-</button>
                    ${item.quantity}
                    <button class="btn btn-success increaseBtn" data-id="${item.id}">+</button>
                </td>
                <td>$${item.price * item.quantity}</td>
                <td>
                    <button class="btn btn-danger deleteBtn" data-id="${item.id}">Delete</button>
                </td>
            `;
            total += item.price * item.quantity;
        });

        document.getElementById("totalAmount").textContent = total;
    }

    // Decrease Product Quantity
    document.getElementById("cartTable").addEventListener("click", function(e) {
        if (e.target && e.target.classList.contains("decreaseBtn")) {
            const productId = e.target.getAttribute("data-id");
            const productInCart = cart.find(item => item.id == productId);

            if (productInCart && productInCart.quantity > 1) {
                productInCart.quantity--;
            } else {
                cart = cart.filter(item => item.id != productId);
            }

            renderCart();
        }

        // Increase Product Quantity
        if (e.target && e.target.classList.contains("increaseBtn")) {
            const productId = e.target.getAttribute("data-id");
            const productInCart = cart.find(item => item.id == productId);

            if (productInCart) {
                productInCart.quantity++;
            }

            renderCart();
        }

        // Delete Product from Cart
        if (e.target && e.target.classList.contains("deleteBtn")) {
            const productId = e.target.getAttribute("data-id");
            cart = cart.filter(item => item.id != productId);
            renderCart();
        }
    });

    // Process Payment
    document.getElementById("processPaymentButton").addEventListener("click", function() {
        if (cart.length > 0) {
            const totalAmount = document.getElementById("totalAmount").textContent;

            const transactionId = generateUniqueId("transaction");
            const paymentConfirmationId = generateUniqueId("payment-confirmation");
            const reportId = generateUniqueId("report");

            Swal.fire({
                title: "Confirm Payment",
                text: `Total Amount: $${totalAmount}`,
                icon: "info",
                showCancelButton: true,
                confirmButtonText: "Confirm Payment",
            }).then((result) => {
                if (result.isConfirmed) {
                    // Simulate Payment Processing and save transaction
                    Swal.fire("Success", "Payment has been processed", "success");

                    // Save transaction, payment, and report data (for demo, storing in localStorage)
                    const transactionData = {
                        transactionId,
                        customerId,
                        cart,
                        paymentConfirmationId,
                        totalAmount,
                        reportId,
                    };

                    localStorage.setItem(transactionId, JSON.stringify(transactionData));
                    cart = []; // Clear the cart after payment
                    renderCart();
                }
            });
        } else {
            Swal.fire("Error", "No items in the cart", "error");
        }
    });

    // Initial Render
    renderProductList();
});
