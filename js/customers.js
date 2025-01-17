document.addEventListener("DOMContentLoaded", function () {
    const customerSelect = document.getElementById("customerSelect");
    const customerRole = document.getElementById("customerRole");
    const productTable = document.getElementById("productTable").getElementsByTagName('tbody')[0];
    const cartTable = document.getElementById("cartTable").getElementsByTagName('tbody')[0];
    const totalAmountElement = document.getElementById("totalAmount");
    const checkoutButton = document.getElementById("checkoutButton");
    const paymentSection = document.getElementById("paymentSection");
    const paymentAmountInput = document.getElementById("paymentAmount");
    const confirmPaymentButton = document.getElementById("confirmPaymentButton");

    let customers = JSON.parse(localStorage.getItem("customers")) || [];
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let transaction = null;

    // Default Customers
    if (customers.length === 0) {
        customers = [
            { id: "cust-1", name: "John Doe", role: "Umum" },
            { id: "cust-2", name: "Jane Smith", role: "PelSem" },
            { id: "cust-3", name: "Mike Johnson", role: "PelMem" }
        ];
        localStorage.setItem("customers", JSON.stringify(customers));
    }

    // Default Products
    if (products.length === 0) {
        products = [
            { id: "prod-1", name: "Product 1", price: 100, stock: 50 },
            { id: "prod-2", name: "Product 2", price: 200, stock: 30 }
        ];
        localStorage.setItem("products", JSON.stringify(products));
    }

    // Load Customers
    function loadCustomers() {
        customers.forEach((customer) => {
            const option = document.createElement("option");
            option.value = customer.id;
            option.textContent = `${customer.name} (${customer.role})`;
            customerSelect.appendChild(option);
        });
    }

    // Update Customer Role
    customerSelect.addEventListener("change", function () {
        const selectedCustomer = customers.find((c) => c.id === this.value);
        if (selectedCustomer) {
            customerRole.textContent = selectedCustomer.role;
            calculateTotal();
        }
    });

    // Load Products
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
                        Add
                    </button>
                </td>
            `;
        });
    }

    // Render Cart Table
    function renderCartTable() {
        cartTable.innerHTML = "";
        let totalAmount = 0;

        cart.forEach((item, index) => {
            const subtotal = item.price * item.quantity;
            totalAmount += subtotal;

            const row = cartTable.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td>${item.quantity}</td>
                <td>$${subtotal}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Remove</button>
                </td>
            `;
        });

        const discount = getDiscount();
        totalAmount = totalAmount - (totalAmount * discount) / 100;
        totalAmountElement.textContent = totalAmount.toFixed(2);
    }

    // Get Discount
    function getDiscount() {
        const selectedCustomer = customers.find((c) => c.id === customerSelect.value);
        if (selectedCustomer) {
            return selectedCustomer.role === "PelSem" ? 5 : selectedCustomer.role === "PelMem" ? 10 : 0;
        }
        return 0;
    }

    // Add to Cart
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
        }
    };

    // Remove from Cart
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
        }
    };

    // Checkout
    checkoutButton.addEventListener("click", function () {
        if (cart.length === 0) {
            Swal.fire("Error", "Cart is empty!", "error");
        } else {
            // Show Payment Section
            paymentSection.style.display = "block";
            transaction = {
                customerId: customerSelect.value,
                cart: [...cart],
                totalAmount: parseFloat(totalAmountElement.textContent)
            };
        }
    });

    // Confirm Payment
    confirmPaymentButton.addEventListener("click", function () {
        const paymentAmount = parseFloat(paymentAmountInput.value);

        if (isNaN(paymentAmount) || paymentAmount <= 0) {
            Swal.fire("Error", "Invalid payment amount!", "error");
            return;
        }

        const totalAmount = transaction.totalAmount;
        if (paymentAmount < totalAmount) {
            Swal.fire("Error", "Insufficient payment!", "error");
        } else {
            // Mark the transaction as Paid
            transaction.status = "Paid";
            Swal.fire("Success", "Payment successful! Thank you for your purchase.", "success");

            // Clear Cart
            cart = [];
            localStorage.setItem("cart", JSON.stringify(cart));

            // Hide Payment Section
            paymentSection.style.display = "none";

            // Render updated cart and transaction
            renderCartTable();
        }
    });

    // Initial Load
    loadCustomers();
    renderProductTable();
    renderCartTable();
});
