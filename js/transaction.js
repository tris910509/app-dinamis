document.addEventListener("DOMContentLoaded", function () {
    const transactionForm = document.getElementById("transactionForm");
    const paymentForm = document.getElementById("paymentForm");
    const transactionTable = document.getElementById("transactionTable").getElementsByTagName('tbody')[0];
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let customers = JSON.parse(localStorage.getItem("customers")) || [];
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];

    // Load customers into the dropdown
    const customerSelect = document.getElementById("customer");
    customers.forEach(customer => {
        const option = document.createElement("option");
        option.value = customer.id;
        option.textContent = customer.name;
        customerSelect.appendChild(option);
    });

    // Load products into the dropdown
    const productSelect = document.getElementById("product");
    products.forEach(product => {
        const option = document.createElement("option");
        option.value = product.id;
        option.textContent = product.name;
        productSelect.appendChild(option);
    });

    // Calculate total price (price * quantity - discount)
    function calculateTotal(productId, quantity, discount) {
        const product = products.find(p => p.id === productId);
        if (product) {
            const total = (product.price * quantity) - discount;
            return total >= 0 ? total : 0;
        }
        return 0;
    }

    // Save transaction
    transactionForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const customerId = document.getElementById("customer").value;
        const productId = document.getElementById("product").value;
        const quantity = parseInt(document.getElementById("quantity").value);
        const discount = parseFloat(document.getElementById("discount").value);

        const customer = customers.find(c => c.id === customerId);
        const product = products.find(p => p.id === productId);
        const total = calculateTotal(productId, quantity, discount);
        const status = "Unpaid";  // Default status is Unpaid
        const transactionId = "txn-" + Date.now();

        transactions.push({
            transactionId,
            customer: customer.name,
            product: product.name,
            supplier: product.supplier,
            quantity,
            price: product.price,
            discount,
            total,
            status,
            payment: null,  // No payment initially
        });

        localStorage.setItem("transactions", JSON.stringify(transactions));
        renderTransactionTable();
        Swal.fire("Success", "Transaction added successfully", "success");
        transactionForm.reset();
        bootstrap.Modal.getInstance(document.getElementById("transactionModal")).hide();
    });

    // Render transaction table
    function renderTransactionTable() {
        transactionTable.innerHTML = "";
        transactions.forEach((transaction, index) => {
            const row = transactionTable.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${transaction.transactionId}</td>
                <td>${transaction.customer}</td>
                <td>${transaction.product}</td>
                <td>${transaction.supplier}</td>
                <td>${transaction.quantity}</td>
                <td>${transaction.price}</td>
                <td>${transaction.discount}</td>
                <td>${transaction.total}</td>
                <td>${transaction.status}</td>
                <td>
                    ${transaction.status === "Unpaid" ? `
                    <button class="btn btn-info btn-sm" onclick="openPaymentModal(${index})">
                        <i class="fas fa-credit-card"></i> Pay
                    </button>` : 'Paid'}
                </td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteTransaction(${index})">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </td>
            `;
        });
    }

    // Open payment modal
    window.openPaymentModal = function (index) {
        const transaction = transactions[index];
        document.getElementById("paymentAmount").value = transaction.total;
        document.getElementById("paymentMethod").value = "cash";
        bootstrap.Modal.getInstance(document.getElementById("paymentModal")).show();

        // Handle payment submission
        paymentForm.onsubmit = function (e) {
            e.preventDefault();
            const paymentMethod = document.getElementById("paymentMethod").value;
            const paymentAmount = parseFloat(document.getElementById("paymentAmount").value);

            if (paymentAmount >= transaction.total) {
                transactions[index].status = "Paid";
                transactions[index].payment = { method: paymentMethod, amount: paymentAmount, date: new Date().toLocaleString() };
                localStorage.setItem("transactions", JSON.stringify(transactions));
                renderTransactionTable();
                Swal.fire("Paid", "Payment received successfully.", "success");
                bootstrap.Modal.getInstance(document.getElementById("paymentModal")).hide();
            } else {
                Swal.fire("Error", "Insufficient payment amount.", "error");
            }
        };
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

    // Initial render of the table
    renderTransactionTable();
});
