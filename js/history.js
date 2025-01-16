document.addEventListener("DOMContentLoaded", function () {
    const transactionTable = document.getElementById("transactionItems");
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    // Render transactions in table
    function renderTransactions() {
        transactionTable.innerHTML = "";
        transactions.forEach((transaction, index) => {
            const row = transactionTable.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${transaction.products.map(p => p.name).join(", ")}</td>
                <td>${transaction.products.map(p => p.quantity).join(", ")}</td>
                <td>${transaction.subtotal}</td>
                <td>${transaction.status}</td>
                <td>${transaction.paymentMethod}</td>
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
        // Logic to edit transaction
    };

    // Delete transaction
    window.deleteTransaction
