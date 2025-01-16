document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const filterBtn = document.getElementById("filterBtn");
    const transactionTable = document.getElementById("transactionTable").getElementsByTagName('tbody')[0];

    // Load data from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    // Update summary cards
    document.getElementById("totalUsers").textContent = users.length;
    document.getElementById("totalCustomers").textContent = customers.length;
    document.getElementById("totalProducts").textContent = products.length;
    document.getElementById("totalTransactions").textContent = transactions.length;

    // Prepare data for charts
    const monthlyRevenue = Array(12).fill(0); // Placeholder for monthly revenue
    transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const month = date.getMonth(); // 0-11
        monthlyRevenue[month] += transaction.total;
    });

    const topProducts = {};
    transactions.forEach(transaction => {
        if (!topProducts[transaction.product]) {
            topProducts[transaction.product] = 0;
        }
        topProducts[transaction.product] += transaction.quantity;
    });

    // Chart.js: Revenue Chart
    const revenueCtx = document.getElementById("revenueChart").getContext("2d");
    new Chart(revenueCtx, {
        type: "line",
        data: {
            labels: [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ],
            datasets: [{
                label: "Monthly Revenue",
                data: monthlyRevenue,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
            }],
        },
    });

    // Chart.js: Top Products Chart
    const productNames = Object.keys(topProducts);
    const productQuantities = Object.values(topProducts);
    const topProductsCtx = document.getElementById("topProductsChart").getContext("2d");
    new Chart(topProductsCtx, {
        type: "bar",
        data: {
            labels: productNames,
            datasets: [{
                label: "Top Products",
                data: productQuantities,
                backgroundColor: "rgba(153, 102, 255, 0.6)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1,
            }],
        },
    });

    // Filter Functionality
    filterBtn.addEventListener("click", function () {
        const searchText = searchInput.value.toLowerCase();
        const filteredTransactions = transactions.filter(transaction => 
            transaction.product.toLowerCase().includes(searchText) || 
            transaction.customerName.toLowerCase().includes(searchText)
        );
        displayTransactions(filteredTransactions);
    });

    // Display transactions
    function displayTransactions(transactions) {
        transactionTable.innerHTML = "";
        transactions.forEach(transaction => {
            const row = transactionTable.insertRow();
            row.innerHTML = `
                <td>${transaction.id}</td>
                <td>${transaction.product}</td>
                <td>${transaction.customerName}</td>
                <td>${transaction.total}</td>
                <td>${transaction.date}</td>
                <td>${transaction.status}</td>
            `;
        });
    }

    displayTransactions(transactions);
});
