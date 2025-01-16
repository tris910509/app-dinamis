document.addEventListener("DOMContentLoaded", function () {
    const cartTable = document.getElementById("cartItems");
    const paymentForm = document.getElementById("paymentForm");
    const subtotalEl = document.getElementById("subtotal");
    const paymentSubtotalEl = document.getElementById("paymentSubtotal");
    const changeEl = document.getElementById("change");
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    let subtotal = 0;

    // Update cart table and calculate subtotal
    function renderCart() {
        cartTable.innerHTML = "";
        subtotal = 0;
        cartItems.forEach((item, index) => {
            const totalPrice = item.price * item.quantity * (1 - item.discount / 100);
            subtotal += totalPrice;

            const row = cartTable.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>${item.quantity}</td>
                <td>${item.discount}%</td>
                <td>${totalPrice.toFixed(2)}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash-alt"></i> Remove
                    </button>
                </td>
            `;
        });
        subtotalEl.innerText = subtotal.toFixed(2);
        paymentSubtotalEl.value = subtotal.toFixed(2);
    }

    // Remove item from cart
    window.removeFromCart = function (index) {
        cartItems.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cartItems));
        renderCart();
    };

    // Handle payment form submission
    paymentForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const paymentMethod = document.getElementById("paymentMethod").value;
        const amountPaid = parseFloat(document.getElementById("amountPaid").value);
        const change = amountPaid - subtotal;

        if (paymentMethod === "cash") {
            Swal.fire("Success", "Transaction completed with Cash. Status: Paid", "success");
            // Save transaction as Paid
            storeTransaction(paymentMethod, amountPaid, change);
        } else if (paymentMethod === "non-cash") {
            Swal.fire("Success", "Transaction will be confirmed for non-cash payment.", "success");
            // Save transaction as Pending for confirmation
            storeTransaction(paymentMethod, amountPaid, change);
        }

        localStorage.removeItem("cart");
        cartItems = [];
        renderCart();
    });

    // Store transaction
    function storeTransaction(paymentMethod, amountPaid, change) {
        const transaction = {
            date: new Date().toISOString(),
            products: cartItems,
            subtotal: subtotal,
            amountPaid: amountPaid,
            change: change,
            paymentMethod: paymentMethod,
            status: paymentMethod === "cash" ? "Paid" : "Pending"
        };

        let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        transactions.push(transaction);
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }

    renderCart();
});
