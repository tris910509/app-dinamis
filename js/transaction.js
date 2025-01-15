document.addEventListener("DOMContentLoaded", function () {
    const transactionForm = document.getElementById("transactionForm");
    const transactionTable = document.getElementById("transactionTable").getElementsByTagName('tbody')[0];
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const products = JSON.parse(localStorage.getItem("products")) || [];
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    // Populate Customer and Product dropdown
    const customerSelect = document.getElementById("customerName");
    customers.forEach(customer => {
        const option = document.createElement("option");
        option.value = customer.id;
        option.textContent = customer.name;
        customerSelect.appendChild(option);
    });

    const productSelect = document.getElementById("product");
    products.forEach(product => {
        const option = document.createElement("option");
        option.value = product.id;
        option.textContent = product.name;
        productSelect.appendChild(option);
    });

    // Save transaction
    transactionForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const transactionId = "transaction-" + Date.now(); // Generate unique ID
        const customerId = document.getElementById("customerName").value;
        const productId = document.getElementById("product").value;
        const amount = parseFloat(document.getElementById("amount").value);
        const discount = parseFloat(document.getElementById("discount").value);
        const paymentStatus = document.getElementById("paymentStatus").value;
        const paymentMethod = document.getElementById("paymentMethod").value;
        const date = new Date().toLocaleString();

        const customer = customers.find(c => c.id === customerId);
        const product = products.find(p => p.id === productId);

        // Calculate discounted amount
        const discountedAmount = amount - (amount * (discount / 100));

        transactions.push({ transactionId, customer, product, amount, discount, discountedAmount, paymentStatus, paymentMethod, date });
        localStorage.setItem("transactions", JSON.stringify(transactions));
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
            const paymentStatusClass = transaction.paymentStatus === "paid" ? "badge bg-success" : "badge bg-danger";

            const row = transactionTable.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${transaction.transactionId}</td>
                <td>${transaction.customer.name}</td>
                <td>${transaction.product.name}</td>
                <td>${transaction.amount}</td>
                <td>${transaction.discount}%</td>
                <td><span class="${paymentStatusClass}">${paymentStatusText}</span></td>
                <td>${transaction.paymentMethod}</td>
                <td>${transaction.date}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editTransaction(${index})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTransaction(${index})">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </td>
            `;
        });
    }

    // Edit transaction
    window.editTransaction = function (index) {
        const transaction = transactions[index];
        const modal = new bootstrap.Modal(document.getElementById("transactionModal"));
        document.getElementById("customerName").value = transaction.customer.id;
        document.getElementById("product").value = transaction.product.id;
        document.getElementById("amount").value = transaction.amount;
        document.getElementById("discount").value = transaction.discount;
        document.getElementById("paymentStatus").value = transaction.paymentStatus;
        document.getElementById("paymentMethod").value = transaction.paymentMethod;

        // Modify the form for editing
        transactionForm.removeEventListener("submit", saveTransaction);
        transactionForm.addEventListener("submit", function (e) {
            e.preventDefault();

            transaction.customer = customers.find(c => c.id === document.getElementById("customerName").value);
            transaction.product = products.find(p => p.id === document.getElementById("product").value);
            transaction.amount = parseFloat(document.getElementById("amount").value);
            transaction.discount = parseFloat(document.getElementById("discount").value);
            transaction.paymentStatus = document.getElementById("paymentStatus").value;
            transaction.paymentMethod = document.getElementById("paymentMethod").value;

            transaction.discountedAmount = transaction.amount - (transaction.amount * (transaction.discount / 100));

            localStorage.setItem("transactions", JSON.stringify(transactions));
            renderTransactionTable();
            modal.hide();
            Swal.fire("Success", "Transaction updated successfully", "success");
        });
        modal.show();
    };

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

    // Load transactions on page load
    renderTransactionTable();
});
