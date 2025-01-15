document.addEventListener("DOMContentLoaded", () => {
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const products = JSON.parse(localStorage.getItem("products")) || [];
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    const roleSelect = document.getElementById("role");
    const customerSelect = document.getElementById("customer");
    const productSelect = document.getElementById("product");
    const transactionTableBody = document.querySelector("#transactionTable tbody");

    // Populate Dropdowns
    function populateDropdowns() {
        // Populate Customers based on Role
        const role = roleSelect.value;
        customerSelect.innerHTML = "";

        const filteredCustomers = customers.filter(customer => {
            return role === "umum" || customer.role === role;
        });

        filteredCustomers.forEach(customer => {
            const option = document.createElement("option");
            option.value = customer.id;
            option.textContent = customer.name;
            customerSelect.appendChild(option);
        });

        // Populate Products
        productSelect.innerHTML = "";
        products.forEach(product => {
            const option = document.createElement("option");
            option.value = product.id;
            option.textContent = product.name;
            productSelect.appendChild(option);
        });
    }

    // Render Transactions Table
    function renderTransactions() {
        transactionTableBody.innerHTML = "";
        transactions.forEach((transaction, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${transaction.customer.name}</td>
                    <td>${transaction.product.name}</td>
                    <td>${transaction.amount}</td>
                    <td>${transaction.discount}%</td>
                    <td>$${transaction.total.toFixed(2)}</td>
                    <td>${transaction.paymentMethod}</td>
                    <td>${transaction.paymentStatus}</td>
                    <td>${transaction.date}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editTransaction(${index})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteTransaction(${index})">Delete</button>
                    </td>
                </tr>`;
            transactionTableBody.insertAdjacentHTML("beforeend", row);
        });
    }

    // Form Submission
    document.getElementById("transactionForm").addEventListener("submit", e => {
        e.preventDefault();

        const customerId = customerSelect.value;
        const productId = productSelect.value;
        const amount = parseFloat(document.getElementById("amount").value);
        const discount = parseFloat(document.getElementById("discount").value);
        const paymentMethod = document.getElementById("paymentMethod").value;
        const paymentStatus = document.getElementById("paymentStatus").value;
        const date = new Date().toLocaleString();

        const customer = customers.find(c => c.id === customerId);
        const product = products.find(p => p.id === productId);

        const total = amount - (amount * (discount / 100));

        transactions.push({ customer, product, amount, discount, total, paymentMethod, paymentStatus, date });
        localStorage.setItem("transactions", JSON.stringify(transactions));
        renderTransactions();
        Swal.fire("Success", "Transaction added successfully", "success");
    });

    // Initial Setup
    roleSelect.addEventListener("change", populateDropdowns);
    populateDropdowns();
    renderTransactions();
});
