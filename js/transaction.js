document.addEventListener("DOMContentLoaded", function () {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const customerSelect = document.getElementById("transactionCustomer");
    const productSelect = document.getElementById("transactionProduct");
    const quantityInput = document.getElementById("transactionQuantity");
    const cartTable = document.getElementById("cartTable").getElementsByTagName('tbody')[0];
    const totalPriceElement = document.getElementById("totalPrice");
    const paymentModal = new bootstrap.Modal(document.getElementById("paymentModal"));
    const paymentTotalElement = document.getElementById("paymentTotal");

    // Sample Customers and Products (this should come from your data)
    const customers = [
        { id: "cus-1", name: "John Doe" },
        { id: "cus-2", name: "Jane Smith" }
    ];

    const products = [
        { id: "prod-1", name: "Product 1", price: 100 },
        { id: "prod-2", name: "Product 2", price: 200 },
        { id: "prod-3", name: "Product 3", price: 300 }
    ];

    // Populate Customer and Product Select Options
    customers.forEach(customer => {
        const option = document.createElement("option");
        option.value = customer.id;
        option.textContent = customer.name;
        customerSelect.appendChild(option);
    });

    products.forEach(product => {
        const option = document.createElement("option");
        option.value = product.id;
        option.textContent = product.name;
        productSelect.appendChild(option);
    });

    // Update Cart Table
    function updateCartTable() {
        cartTable.innerHTML = "";
        let total = 0;

        cart.forEach(item => {
            const row = cartTable.insertRow();
            row.innerHTML = `
                <td>${item.product.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.product.price}</td>
                <td>$${item.product.price * item.quantity}</td>
                <td><button class="btn btn-danger btn-sm" onclick="removeFromCart('${item.product.id}')">Remove</button></td>
            `;
            total += item.product.price * item.quantity;
        });

        totalPriceElement.textContent = total;
    }

    // Add Product to Cart
    document.getElementById("addToCart").addEventListener("click", function () {
        const selectedProductId = productSelect.value;
        const quantity = parseInt(quantityInput.value);

        const product = products.find(p => p.id === selectedProductId);
        if (product && quantity > 0) {
            const existingItem = cart.find(item => item.product.id === product.id);

            if (existingItem) {
                existingItem.quantity += quantity; // Update quantity if product already in cart
            } else {
                cart.push({ product, quantity });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartTable();
        } else {
            Swal.fire("Invalid Product or Quantity", "Please select a valid product and quantity.", "error");
        }
    });

    // Remove Product from Cart
    window.removeFromCart = function (productId) {
        const index = cart.findIndex(item => item.product.id === productId);
        if (index !== -1) {
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartTable();
        }
    };

    // Proceed to Payment
    document.getElementById("processPayment").addEventListener("click", function () {
        if (cart.length > 0) {
            const total = parseInt(totalPriceElement.textContent);
            paymentTotalElement.textContent = "$" + total;
            paymentModal.show();
        } else {
            Swal.fire("Cart is Empty", "Please add some products to the cart before proceeding.", "warning");
        }
    });

    // Confirm Payment
    document.getElementById("confirmPayment").addEventListener("click", function () {
        const paymentStatus = document.getElementById("paymentStatus").value;

        Swal.fire({
            title: "Transaction Confirmed",
            text: `Payment Status: ${paymentStatus}`,
            icon: "success",
            confirmButtonText: "OK",
        }).then(() => {
            // Clear the cart and update localStorage
            localStorage.removeItem("cart");
            updateCartTable();
            paymentModal.hide();
        });
    });

    // Initial Cart Table Update
    updateCartTable();
});
