// Data penyimpanan sementara menggunakan localStorage
const customers = JSON.parse(localStorage.getItem("customers")) || [];
const products = JSON.parse(localStorage.getItem("products")) || [];
const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Elemen DOM
const transactionTableBody = document.querySelector("#transactionTable tbody");
const addTransactionBtn = document.getElementById("addTransactionBtn");
const customerForm = document.getElementById("customerForm");
const productForm = document.getElementById("productForm");
const customerFormElement = document.getElementById("customerFormElement");
const productFormElement = document.getElementById("productFormElement");

// Fungsi untuk menambah Customer
function addCustomer(name, email, address) {
    const newCustomer = {
        id: Date.now().toString(),
        name,
        email,
        address,
        status: "aktif",
    };
    customers.push(newCustomer);
    localStorage.setItem("customers", JSON.stringify(customers));
    Swal.fire("Customer berhasil ditambahkan");
}

// Fungsi untuk menambah Produk
function addProduct(name, price, stock) {
    const newProduct = {
        id: Date.now().toString(),
        name,
        price,
        stock,
    };
    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));
    Swal.fire("Produk berhasil ditambahkan");
}

// Fungsi untuk menambah Transaksi
function addTransaction(customerId, cart, paymentMethod) {
    const customer = customers.find(c => c.id === customerId);
    const transactionItems = cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        total: item.total
    }));

    const totalAmount = cart.reduce((acc, item) => acc + item.total, 0);
    const transaction = {
        id: Date.now().toString(),
        customerId: customer.id,
        customerName: customer.name,
        items: transactionItems,
        totalAmount,
        paymentMethod,
        paymentStatus: paymentMethod === 'cash' ? 'Lunas' : 'Pending',
        date: new Date().toISOString(),
    };

    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    Swal.fire("Transaksi berhasil ditambahkan");
    updateTransactionTable();
}

// Update tabel transaksi
function updateTransactionTable() {
    transactionTableBody.innerHTML = "";
    transactions.forEach(transaction => {
        const customer = customers.find(c => c.id === transaction.customerId);
        const row = `
            <tr>
                <td>${transaction.id}</td>
                <td>${customer ? customer.name : "Umum"}</td>
                <td>${transaction.items.map(item => item.productName).join(", ")}</td>
                <td>Rp ${transaction.totalAmount.toLocaleString()}</td>
                <td>${transaction.paymentMethod}</td>
                <td>${transaction.paymentStatus}</td>
                <td>${new Date(transaction.date).toLocaleString()}</td>
                <td><button class="btn btn-info btn-sm" onclick="viewTransactionDetails('${transaction.id}')">Detail</button></td>
            </tr>
        `;
        transactionTableBody.insertAdjacentHTML("beforeend", row);
    });
}

// Menampilkan detail transaksi
function viewTransactionDetails(transactionId) {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
        Swal.fire({
            title: "Detail Transaksi",
            html: `
                <p><strong>Customer:</strong> ${transaction.customerName}</p>
                <p><strong>Produk:</strong> ${transaction.items.map(item => `${item.productName} (x${item.quantity})`).join(", ")}</p>
                <p><strong>Total:</strong> Rp ${transaction.totalAmount.toLocaleString()}</p>
                <p><strong>Status Pembayaran:</strong> ${transaction.paymentStatus}</p>
            `
        });
    }
}

// Fungsi untuk menampilkan form Customer
addTransactionBtn.addEventListener("click", () => {
    const customerFormVisible = customerForm.style.display === "block";
    customerForm.style.display = customerFormVisible ? "none" : "block";
    productForm.style.display = "none";  // Hide product form
});

// Handle tambah customer form
customerFormElement.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("customerName").value;
    const email = document.getElementById("customerEmail").value;
    const address = document.getElementById("customerAddress").value;
    addCustomer(name, email, address);
    customerForm.style.display = "none";
});

// Handle cancel customer form
document.getElementById("cancelCustomerForm").addEventListener("click", () => {
    customerForm.style.display = "none";
});

// Handle tambah produk form
document.getElementById("addProductBtn").addEventListener("click", () => {
    productForm.style.display = "block";
    customerForm.style.display = "none";
});

// Handle tambah produk form submission
productFormElement.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const stock = document.getElementById("productStock").value;
    addProduct(name, price, stock);
    productForm.style.display = "none";
});

// Handle cancel produk form
document.getElementById("cancelProductForm").addEventListener("click", () => {
    productForm.style.display = "none";
});

// Inisialisasi
updateTransactionTable();
