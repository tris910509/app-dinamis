document.addEventListener("DOMContentLoaded", function () {
    const customerSelect = document.getElementById("customerSelect");
    const paymentSection = document.getElementById("paymentSection");
    const paymentMethod = document.getElementById("paymentMethod");
    const confirmPaymentButton = document.getElementById("confirmPaymentButton");
    const invoiceSection = document.getElementById("invoiceSection");
    const invoiceCustomer = document.getElementById("invoiceCustomer");
    const invoicePaymentMethod = document.getElementById("invoicePaymentMethod");
    const invoiceTableBody = document.getElementById("invoiceTableBody");
    const invoiceTotal = document.getElementById("invoiceTotal");
    const totalAmountElement = document.getElementById("totalAmount");

    let customers = JSON.parse(localStorage.getItem("customers")) || [];
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Default Customers and Products (if localStorage is empty)
    if (customers.length === 0) {
        customers = [
            
        ];
        localStorage.setItem("customers", JSON.stringify(customers));
    }

    if (products.length === 0) {
        products = [
            
        ];
        localStorage.setItem("products", JSON.stringify(products));
    }

    // Load Customers
    function loadCustomers() {
        customerSelect.innerHTML = '';
        customers.forEach((customer) => {
            const option = document.createElement("option");
            option.value = customer.id;
            option.textContent = `${customer.name} (${customer.role})`;
            customerSelect.appendChild(option);
        });
    }

    // Render Product Table
    function renderProductTable() {
        const productTable = document.getElementById("productTable").getElementsByTagName('tbody')[0];
        productTable.innerHTML = '';
        products.forEach((product, index) => {
            const row = productTable.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${product.name}</td>
                <td>$${product.price}</td>
                <td>${product.stock}</td>
                <td><button class="btn btn-primary btn-sm" onclick="addToCart('${product.id}')">Add</button></td>
            `;
        });
    }

    // Render Cart Table
    function renderCartTable() {
        const cartTable = document.getElementById("cartTable").getElementsByTagName('tbody')[0];
        cartTable.innerHTML = '';
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
                <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Remove</button></td>
            `;
        });

        totalAmountElement.textContent = totalAmount.toFixed(2);
    }

    // Add Product to Cart
    window.addToCart = function (productId) {
        const product = products.find(p => p.id === productId);
        if (product && product.stock > 0) {
            const cartItem = cart.find(item => item.id === productId);
            if (cartItem) {
                cartItem.quantity += 1;
            } else {
                cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
            }
            product.stock -= 1;
            localStorage.setItem("products", JSON.stringify(products));
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCartTable();
            renderProductTable();
        }
    };

    // Remove Product from Cart
    window.removeFromCart = function (index) {
        const product = cart[index];
        const prodIndex = products.findIndex(p => p.id === product.id);
        products[prodIndex].stock += product.quantity;
        cart.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(products));
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCartTable();
        renderProductTable();
    };

    // Checkout Button Event
    checkoutButton.addEventListener("click", function () {
        if (cart.length === 0) {
            Swal.fire("Error", "Cart is empty!", "error");
        } else if (!customerSelect.value) {
            Swal.fire("Error", "Please select a customer!", "error");
        } else {
            paymentSection.style.display = "block";
        }
    });

    // Confirm Payment Button Event
    confirmPaymentButton.addEventListener("click", function () {
        if (!paymentMethod.value) {
            Swal.fire("Error", "Please select a payment method!", "error");
        } else {
            // Generate Invoice
            const selectedCustomer = customers.find(c => c.id === customerSelect.value);
            invoiceCustomer.textContent = selectedCustomer.name;
            invoicePaymentMethod.textContent = paymentMethod.value.toUpperCase();

            invoiceTableBody.innerHTML = "";
            let totalAmount = 0;

            cart.forEach((item, index) => {
                const subtotal = item.price * item.quantity;
                totalAmount += subtotal;

                const row = invoiceTableBody.insertRow();
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>$${item.price}</td>
                    <td>${item.quantity}</td>
                    <td>$${subtotal}</td>
                `;
            });

            invoiceTotal.textContent = totalAmount.toFixed(2);

            // Clear Cart and Display Invoice
            cart = [];
            localStorage.setItem("cart", JSON.stringify(cart));
            paymentSection.style.display = "none";
            renderCartTable();
            invoiceSection.style.display = "block";

            Swal.fire("Success", "Payment completed and invoice generated!", "success");
        }
    });

    // Initial Load
    loadCustomers();
    renderProductTable();
    renderCartTable();
});
