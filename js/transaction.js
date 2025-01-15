document.addEventListener("DOMContentLoaded", function () {
    const transactionForm = document.getElementById("transactionForm");
    const transactionTable = document.getElementById("transactionTable").getElementsByTagName('tbody')[0];
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const products = JSON.parse(localStorage.getItem("products")) || [];
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    // Populate Customer dropdown based on role
    const customerSelect = document.getElementById("customerName");
    const roleSelect = document.getElementById("role");

    const productSelect = document.getElementById("product");
    const amountInput = document.getElementById("amount");

    // Handle Role change
    roleSelect.addEventListener("change", function() {
        const role = roleSelect.value;
        if (role === "umum") {
            document.getElementById("customerSection").style.display = "none"; // Hide customer dropdown
            customerSelect.disabled = true;
        } else {
            document.getElementById("customerSection").style.display = "block"; // Show customer dropdown
            customerSelect.disabled = false;
            populateCustomerDropdown();
        }
    });

    // Populate Customer dropdown based on role
    function populateCustomerDropdown() {
        customerSelect.innerHTML = "";
        customers.forEach(customer => {
            const option = document.createElement("option");
            option.value = customer.id;
            option.textContent = customer.name;
            customerSelect.appendChild(option);
        });
    }

    // Populate Product dropdown
    products.forEach(product => {
        const option = document.createElement("option");
        option.value = product.id;
        option.textContent = `${product.name} - $${product.price}`;
        productSelect.appendChild(option);
    });

    // Save transaction
    transactionForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const role = roleSelect.value;
        const transactionId = "transaction-" + Date.now();
        const customerId = role === "umum" ? null : customerSelect.value;
        const productId = productSelect.value;
        const amount = parseFloat(amountInput.value);
        const discount = parseFloat(document.getElementById("discount").value);
        const paymentStatus = document.getElementById("paymentStatus").value;
        const paymentMethod = document.getElementById("paymentMethod").value;
        const date = new Date().toLocaleString();

        const product = products.find(p => p.id === productId);
        const discountedAmount = amount - (amount * (discount / 100));

        if (product.stock < amount) {
            Swal.fire("Error", "Not enough stock!", "error");
            return;
        }

        // Deduct stock
        product.stock -= amount;

        const customer = customers.find(c => c.id === customerId) || { name: "Guest", id: null };

        transactions.push({ transactionId, customer, product, amount, discount, discountedAmount, paymentStatus, paymentMethod, date });
        localStorage.setItem("transactions", JSON.stringify(transactions));
        localStorage.setItem("products", JSON.stringify(products)); // Save updated product stock
        renderTransactionTable();
        transactionForm.reset();
        Swal.fire("Success", "Transaction added successfully", "success");
        bootstrap.Modal.getInstance(document.getElementById("transactionModal")).hide();
    });

    // Render transaction table
    function renderTransactionTable() {
        transactionTable.innerHTML = "";
        transactions.forEach((transaction, index) => {
            const paymentStatusText = transaction.paymentStatus === "paid" ? "Paid" : "Unpaid";
            const paymentStatusClass = transaction.paymentStatus === "paid" ? "badge-success" : "badge-warning";

            const row = transactionTable.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${transaction.transactionId}</td>
                <td>${transaction.customer.name}</td>
                <td>${transaction.product.name}</td>
                <td>${transaction.discountedAmount}</td>
                <td>${transaction.discount}%</td>
                <td><span class="badge ${paymentStatusClass}">${paymentStatusText}</span></td>
                <td>${transaction.paymentMethod}</td>
                <td>${transaction.date}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteTransaction(${index})">Delete</button>
                </td>
            `;
        });
    }

    // Delete transaction
    window.deleteTransaction = function (index) {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                transactions.splice(index, 1);
                localStorage.setItem("transactions", JSON.stringify(transactions));
                renderTransactionTable();
                Swal.fire("Deleted!", "Transaction has been deleted.", "success");
            }
        });
    };

    // Initial Render
    renderTransactionTable();
});
