document.addEventListener("DOMContentLoaded", function () {
    const userCount = document.getElementById("userCount");
    const customerCount = document.getElementById("customerCount");
    const pendingOrders = document.getElementById("pendingOrders");

    // Ambil data pengguna dan pelanggan dari localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const customers = JSON.parse(localStorage.getItem("customers")) || [];

    // Update jumlah pengguna dan pelanggan
    userCount.textContent = users.length;
    customerCount.textContent = customers.length;

    // Untuk contoh, kita set pendingOrders ke angka acak
    pendingOrders.textContent = Math.floor(Math.random() * 10); // Angka acak untuk pending orders
});
