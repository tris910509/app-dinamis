document.addEventListener("DOMContentLoaded", function () {
    const customerSelect = document.getElementById("customerSelect");
    const productTableBody = document.getElementById("productTable").querySelector("tbody");
    const cartTableBody = document.getElementById("cartTable").querySelector("tbody");
    const totalAmountElement = document.getElementById("totalAmount");
    const checkoutButton = document.getElementById("checkoutButton");
    const paymentSection = document.getElementById("paymentSection");
    const paymentMethod = document.getElementById("paymentMethod");
    const confirmPaymentButton = document.getElementById("confirmPaymentButton");
    const invoiceSection = document.getElementById("invoiceSection");
    const invoiceCustomer = document.getElementById("invoiceCustomer");
    const invoicePayment = document.getElementById("invoicePayment");
    const invoiceTable = document.getElementById("invoiceTable");
    const invoiceTotal = document.getElementById("invoiceTotal");

    let customers = [];
    let products = [];
    let cart = [];
    let totalAmount = 0;

    // Fetch customers and products from local files
    fetch("data/customers.json")
        .then((response) => response.json())
        .then((data) => {
            customers = data;
            loadCustomers();
        });

    fetch("data/products.json")
        .then((response) => response.json())
        .then((data) => {
            products = data;
            loadProducts();
        });

    function loadCustomers() {
        customerSelect.innerHTML = customers.map((customer) =>
            `<option value="${customer.id}">${customer.name} (${customer.role})</option>`
        ).join("");
    }

    function loadProducts() {
        productTableBody.innerHTML = products.map((product, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${product.name}</td>
                <td>$${product.price}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="btn btn-primary" onclick="addToCart(${index})">Add</button>
                </td>
            </tr>
        `).join("");
    }

    window.addToCart = function (index) {
        const product = products[index];
        if (product.stock > 0) {
            const cartItem = cart.find((item) => item.id === product.id);
            if (cartItem) {
                cartItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            product.stock--;
            updateUI();
        }
    };

    function updateUI() {
        cartTableBody.innerHTML = cart.map((item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td>${item.quantity}</td>
                <td>$${item.price * item.quantity}</td>
                <td>
                    <button class="btn btn-danger" onclick="removeFromCart(${index})">Remove</button>
                </td>
            </tr>
        `).join("");

        totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalAmountElement.textContent = totalAmount;
    }

    window.removeFromCart = function (index) {
        const item = cart[index];
        products.find((product) => product.id === item.id).stock += item.quantity;
        cart.splice(index, 1);
        updateUI();
    };

    checkoutButton.addEventListener("click", function () {
        if (cart.length === 0) return alert("Cart is empty!");
        paymentSection.style.display = "block";
    });

    confirmPaymentButton.addEventListener("click", function () {
        const selectedCustomer = customers.find((c) => c.id === customerSelect.value);
        invoiceCustomer.textContent = selectedCustomer.name;
        invoicePayment.textContent = paymentMethod.value;
        invoiceTable.innerHTML = cart.map((item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price * item.quantity}</td>
            </tr>
        `).join("");
        invoiceTotal.textContent = totalAmount;

        cart = [];
        updateUI();
        paymentSection.style.display = "none";
        invoiceSection.style.display = "block";
    });
});
