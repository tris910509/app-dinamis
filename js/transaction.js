document.addEventListener("DOMContentLoaded", function () {
    const transactionForm = document.getElementById("transactionForm");
    const transactionTable = document.getElementById("transactionTable").getElementsByTagName('tbody')[0];
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    // Save transaction
    transactionForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const id = "txn-" + Date.now(); // Generate unique transaction ID
        const product = document.getElementById("product").value;
        const quantity = document.getElementById("quantity").value;
        const price = document.getElementById("price").value;
        const status = document.getElementById("status").value;
        const total = quantity * price;

        transactions.push({ id, product, quantity, price, total, status });
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
            const statusText = transaction.status === "paid" ? "Paid" : "Unpaid";
            const statusClass = transaction.status === "paid" ? "badge bg-success" : "badge bg-danger";

            const row = transactionTable.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${transaction.id}</td>
                <td>${transaction.product}</td>
                <td>${transaction.quantity}</td>
                <td>${transaction.price}</td>
                <td>${transaction.total}</td>
                <td><span class="${statusClass}">${statusText}</span></td>
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
        document.getElementById("product").value = transaction.product;
        document.getElementById("quantity").value = transaction.quantity;
        document.getElementById("price").value = transaction.price;
        document.getElementById("status").value = transaction.status;

        // Modify the form for editing
        transactionForm.removeEventListener("submit", saveTransaction);
        transactionForm.addEventListener("submit", function (e) {
            e.preventDefault();

            transaction.product = document.getElementById("product").value;
            transaction.quantity = document.getElementById("quantity").value;
            transaction.price = document.getElementById("price").value;
            transaction.status = document.getElementById("status").value;
            transaction.total = transaction.quantity * transaction.price;

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
