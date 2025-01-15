document.addEventListener("DOMContentLoaded", function () {
    const transactionForm = document.getElementById("transactionForm");
    const transactionTable = document.getElementById("transactionTable").getElementsByTagName('tbody')[0];
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    // Save transaction
    transactionForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const transactionId = "transaction-" + Date.now(); // Generate unique ID
        const customerName = document.getElementById("customerName").value;
        const product = document.getElementById("product").value;
        const amount = parseFloat(document.getElementById("amount").value);
        const paymentStatus = document.getElementById("paymentStatus").value;
        const date = new Date().toLocaleString();

        transactions.push({ transactionId, customerName, product, amount, paymentStatus, date });
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
                <td>${transaction.customerName}</td>
                <td>${transaction.product}</td>
                <td>${transaction.amount}</td>
                <td><span class="${paymentStatusClass}">${paymentStatusText}</span></td>
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
        document.getElementById("customerName").value = transaction.customerName;
        document.getElementById("product").value = transaction.product;
        document.getElementById("amount").value = transaction.amount;
        document.getElementById("paymentStatus").value = transaction.paymentStatus;

        // Modify the form for editing
        transactionForm.removeEventListener("submit", saveTransaction);
        transactionForm.addEventListener("submit", function (e) {
            e.preventDefault();

            transaction.customerName = document.getElementById("customerName").value;
            transaction.product = document.getElementById("product").value;
            transaction.amount = parseFloat(document.getElementById("amount").value);
            transaction.paymentStatus = document.getElementById("paymentStatus").value;

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
