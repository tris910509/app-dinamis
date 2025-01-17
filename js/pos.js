document.addEventListener("DOMContentLoaded", function () {
    const productTable = document.getElementById("productTable").getElementsByTagName('tbody')[0];
    const cartTable = document.getElementById("cartTable").getElementsByTagName('tbody')[0];
    const totalAmountElement = document.getElementById("totalAmount");
    const checkoutButton = document.getElementById("checkoutButton");
    const customerForm = document.getElementById("customerForm");
    const paymentHistoryTable = document.getElementById("paymentHistoryTable").getElementsByTagName('tbody')[0];

    let products = JSON.parse(localStorage.getItem("products")) || [];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let customers = JSON.parse(localStorage.getItem("customers")) || [];
    let paymentHistory = JSON.parse(localStorage.getItem("paymentHistory")) || [];

    // Save Customer
   // customerForm.addEventListener("submit", function (e) {
     //   e.preventDefault();
   //  const customerName = document.getElementById("customerName").value;
       // const customerRole = document.getElementById("customerRole").value;
//  const id = "cust-" + Date.now();

     //   const newCustomer = { id, name: customerName, role: customerRole };
    // customers.push(newCustomer);
      //  localStorage.setItem("customers", JSON.stringify(customers));

     //   Swal.fire("Success", "Customer added successfully", "success");
   // });

document.addEventListener("DOMContentLoaded", function () {
    const customerRoleSelect = document.getElementById("customerRole");
    const customerDetails = document.getElementById("customerDetails");
    const customerNameSection = document.getElementById("customerNameSection");
    const customerIdSection = document.getElementById("customerIdSection");
    const umumInputs = document.getElementById("umumInputs");
    const customerNameInput = document.getElementById("customerName");
    const customerIdInput = document.getElementById("customerId");

    const customerForm = document.getElementById("customerForm");
    let customers = JSON.parse(localStorage.getItem("customers")) || [];

    // When the customer role changes
    customerRoleSelect.addEventListener("change", function () {
        const selectedRole = customerRoleSelect.value;
        customerDetails.classList.add("d-none");
        umumInputs.classList.add("d-none");

        // Show relevant form based on role
        if (selectedRole === "PelSem" || selectedRole === "PelMem") {
            // Generate Customer ID and Name based on role
            const customer = generateCustomerIdAndName(selectedRole);
            customerIdInput.value = customer.id;
            customerNameInput.value = customer.name;
            customerDetails.classList.remove("d-none");
        } else if (selectedRole === "Umum") {
            umumInputs.classList.remove("d-none");
        }
    });

    // Function to generate Customer ID and Name based on role
    function generateCustomerIdAndName(role) {
        const id = role.toLowerCase() + "-" + Date.now();
        let name = "";

        switch (role) {
            case "PelSem":
                name = "PelSem Customer";
                break;
            case "PelMem":
                name = "PelMem Customer";
                break;
            default:
                name = "";
                break;
        }

        return { id, name };
    }

    // Save Customer Data
    customerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const role = customerRoleSelect.value;

        // Create new customer based on role
        let newCustomer = { id: "", name: "", role: role };

        if (role === "Umum") {
            newCustomer.name = document.getElementById("customerName").value;
            newCustomer.contact = document.getElementById("customerContact").value;
            newCustomer.email = document.getElementById("customerEmail").value;
            newCustomer.address = document.getElementById("customerAddress").value;
        } else {
            newCustomer.id = document.getElementById("customerId").value;
            newCustomer.name = document.getElementById("customerName").value;
        }

        customers.push(newCustomer);
        localStorage.setItem("customers", JSON.stringify(customers));

        Swal.fire("Success", "Customer added successfully", "success");
        customerForm.reset();
    });

    // Initialize
    customerRoleSelect.dispatchEvent(new Event('change'));
});
    

    // Save Product
    const productForm = document.getElementById("productForm");
    productForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("productName").value;
        const price = parseFloat(document.getElementById("productPrice").value);
        const stock = parseInt(document.getElementById("productStock").value);
        const id = "prod-" + Date.now();

        products.push({ id, name, price, stock });
        localStorage.setItem("products", JSON.stringify(products));
        renderProductTable();
        productForm.reset();
        Swal.fire("Success", "Product added successfully", "success");
        bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
    });

    // Render Product Table
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
                        <i class="fas fa-cart-plus"></i> Add
                    </button>
                </td>
            `;
        });
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
            Swal.fire("Success", "Product added to cart!", "success");
        } else {
            Swal.fire("Error", "Product is out of stock!", "error");
        }
    };

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
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash-alt"></i> Remove
                    </button>
                </td>
            `;
        });

        const discount = parseFloat(document.getElementById("customerType").value);
        const discountedTotal = totalAmount - (totalAmount * discount) / 100;
        totalAmountElement.textContent = discountedTotal.toFixed(2);
    }

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
            Swal.fire("Success", "Product removed from cart!", "success");
        }
    };

    // Checkout
    checkoutButton.addEventListener("click", function () {
        if (cart.length === 0) {
            Swal.fire("Error", "Your cart is empty!", "error");
            return;
        }

        const total = parseFloat(totalAmountElement.textContent);
        const paymentMethod = document.getElementById("paymentMethod").value;
        const customerId = customers.length ? customers[0].id : "Unknown";

        // Save payment to history
        const payment = {
            customerId,
            amount: total,
            paymentMethod,
            date: new Date().toLocaleString()
        };
        paymentHistory.push(payment);
        localStorage.setItem("paymentHistory", JSON.stringify(paymentHistory));

        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));

        renderCartTable();
        renderPaymentHistoryTable();
        Swal.fire("Success", "Checkout successful", "success");
    });

    // Render Payment History Table
    function renderPaymentHistoryTable() {
        paymentHistoryTable.innerHTML = "";
        paymentHistory.forEach((payment, index) => {
            const row = paymentHistoryTable.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${payment.customerId}</td>
                <td>$${payment.amount}</td>
                <td>${payment.paymentMethod}</td>
                <td>${payment.date}</td>
            `;
        });
    }

    // Load Data
    renderProductTable();
    renderCartTable();
    renderPaymentHistoryTable();
});
