// Sample Data (Replace with actual data from localStorage or database)
let customers = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "PelSem" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "PelMem" }
];
let products = [
    { id: 1, name: "Product A", price: 100, stock: 50, status: "active" },
    { id: 2, name: "Product B", price: 150, stock: 0, status: "inactive" }
];
let paymentHistory = [
    { customerId: 1, amount: 200, paymentMethod: "cash", date: "2025-01-10" },
    { customerId: 2, amount: 300, paymentMethod: "credit card", date: "2025-01-11" }
];

// Initialize Dashboard Data
function initDashboardData() {
    // Total Customers
    document.getElementById("totalCustomers").textContent = customers.length;

    // Total Sales
    let totalSales = paymentHistory.reduce((acc, payment) => acc + payment.amount, 0);
    document.getElementById("totalSales").textContent = totalSales;

    // Active Products
    let activeProducts = products.filter(p => p.status === 'active').length;
    document.getElementById("activeProducts").textContent = activeProducts;

    // Out of Stock Products
    let outOfStock = products.filter(p => p.stock === 0).length;
    document.getElementById("outOfStock").textContent = outOfStock;
}

// Render Transaction History
function renderTransactionHistory() {
    const tbody = document.querySelector("#transactionHistoryTable tbody");
    paymentHistory.forEach((payment, index) => {
        let customer = customers.find(c => c.id === payment.customerId);
        let row = `<tr>
                    <td>${index + 1}</td>
                    <td>${customer.name}</td>
                    <td>$${payment.amount}</td>
                    <td>${payment.paymentMethod}</td>
                    <td>${payment.date}</td>
                  </tr>`;
        tbody.innerHTML += row;
    });
}

// Render Latest Customers
function renderLatestCustomers() {
    const tbody = document.querySelector("#latestCustomersTable tbody");
    customers.slice(0, 5).forEach((customer, index) => {
        let row = `<tr>
                    <td>${index + 1}</td>
                    <td>${customer.name}</td>
                    <td>${customer.email}</td>
                    <td>${customer.role}</td>
                  </tr>`;
        tbody.innerHTML += row;
    });
}

// Render Latest Products
function renderLatestProducts() {
    const tbody = document.querySelector("#latestProductsTable tbody");
    products.slice(0, 5).forEach((product, index) => {
        let row = `<tr>
                    <td>${index + 1}</td>
                    <td>${product.name}</td>
                    <td>$${product.price}</td>
                    <td>${product.status}</td>
                  </tr>`;
        tbody.innerHTML += row;
    });
}

// Initialize Dashboard
function initDashboard() {
    initDashboardData();
    renderTransactionHistory();
    renderLatestCustomers();
    renderLatestProducts();
    renderCharts();
}

initDashboard();

// Charts (Sales and Product Status)
function renderCharts() {
    // Sales Overview Chart
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    new Chart(salesCtx, {
        type: 'bar',
        data: {
            labels: ["2025-01-10", "2025-01-11"], // Date or month
            datasets: [{
                label: 'Total Sales ($)',
                data: [200, 300],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        }
    });

    // Product Status Chart
    const productStatusCtx = document.getElementById('productStatusChart').getContext('2d');
    new Chart(productStatusCtx, {
        type: 'pie',
        data: {
            labels: ['Active', 'Inactive'],
            datasets: [{
                data: [
                    products.filter(p => p.status === 'active').length,
                    products.filter(p => p.status === 'inactive').length
                ],
                backgroundColor: ['#36A2EB', '#FF6384']
            }]
        }
    });
}
