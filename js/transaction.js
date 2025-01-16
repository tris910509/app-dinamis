document.addEventListener("DOMContentLoaded", function () {
    const products = [
    ];

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let transactionHistory = JSON.parse(localStorage.getItem("transactionHistory")) || [];

    // Load produk ke dropdown
    const productSelect = document.getElementById("productSelect");
    products.forEach(product => {
        const option = document.createElement("option");
        option.value = product.id;
        option.textContent = product.name;
        productSelect.appendChild(option);
    });

    // Update keranjang
    function updateCartTable() {
        const cartTable = document.getElementById("cartTable").getElementsByTagName('tbody')[0];
        cartTable.innerHTML = "";
        let subtotal = 0;

        cart.forEach((item, index) => {
            const row = cartTable.insertRow();
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>${item.quantity}</td>
                <td>${item.discount}%</td>
                <td>${item.total}</td>
                <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Hapus</button></td>
            `;
            subtotal += item.total;
        });

        document.getElementById("subtotal").value = subtotal;
        updateChange();
    }

    // Update perubahan kembalian
    function updateChange() {
        const paymentAmount = parseFloat(document.getElementById("paymentAmount").value) || 0;
        const subtotal = parseFloat(document.getElementById("subtotal").value) || 0;
        const change = paymentAmount - subtotal;
        document.getElementById("change").value = change >= 0 ? change : 0;
    }

    // Tambah ke keranjang
    document.getElementById("transactionForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const selectedProductId = document.getElementById("productSelect").value;
        const quantity = parseInt(document.getElementById("quantity").value);
        const discount = parseInt(document.getElementById("discount").value);

        const product = products.find(p => p.id === selectedProductId);
        const total = product.price * quantity * (1 - discount / 100);

        cart.push({
            name: product.name,
            price: product.price,
            quantity: quantity,
            discount: discount,
            total: total
        });

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartTable();
    });

    // Hapus dari keranjang
    window.removeFromCart = function (index) {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartTable();
    };

    // Konfirmasi Pembayaran
    document.getElementById("confirmPaymentBtn").addEventListener("click", function () {
        const paymentMethod = document.getElementById("paymentMethod").value;
        const paymentAmount = parseFloat(document.getElementById("paymentAmount").value);
        const subtotal = parseFloat(document.getElementById("subtotal").value);

        if (paymentMethod === "cash" && paymentAmount >= subtotal) {
            Swal.fire("Pembayaran Lunas", "Status Pembayaran: Lunas", "success");
            saveTransaction("lunas");
        } else if (paymentMethod === "non-cash") {
            Swal.fire("Pembayaran Non-Cash", "Silakan lanjutkan ke konfirmasi pembayaran", "info");
            saveTransaction("belum lunas");
        } else {
            Swal.fire("Pembayaran Gagal", "Jumlah pembayaran tidak cukup", "error");
        }
    });

    // Simpan transaksi
    function saveTransaction(status) {
        const customerName = document.getElementById("customerName").value;
        const transaction = {
            customerName: customerName,
            items: cart,
            subtotal: parseFloat(document.getElementById("subtotal").value),
            paymentStatus: status,
            paymentMethod: document.getElementById("paymentMethod").value,
            paymentAmount: parseFloat(document.getElementById("paymentAmount").value),
            change: parseFloat(document.getElementById("change").value),
            transactionId: "txn-" + Date.now()
        };

        transactionHistory.push(transaction);
        localStorage.setItem("transactionHistory", JSON.stringify(transactionHistory));

        // Clear cart
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartTable();
    }

    // Update keranjang saat halaman dimuat
    updateCartTable();
});
