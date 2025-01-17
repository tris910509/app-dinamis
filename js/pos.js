document.addEventListener("DOMContentLoaded", function () {
    // Element
    const customerSelect = document.getElementById("customerSelect");
    const productTableBody = document.getElementById("productTable").getElementsByTagName('tbody')[0];
    const cartTableBody = document.getElementById("cartTable").getElementsByTagName('tbody')[0];
    const totalAmountElement = document.getElementById("totalAmount");
    const checkoutButton = document.getElementById("checkoutButton");
    const paymentSection = document.getElementById("paymentSection");
    const paymentMethod = document.getElementById("paymentMethod");
    const confirmPaymentButton = document.getElementById("confirmPaymentButton");
    const paymentConfirmationSection = document.getElementById("paymentConfirmationSection");
    const completePaymentButton = document.getElementById("completePaymentButton");
    const cancelPaymentButton = document.getElementById("cancelPaymentButton");
    const invoiceSection = document.getElementById("invoiceSection");
    const invoiceCustomer = document.getElementById("invoiceCustomer");
    const invoicePaymentMethod = document.getElementById("invoicePaymentMethod");
    const invoiceTableBody = document.getElementById("invoiceTableBody");
    const invoiceTotal = document.getElementById("invoiceTotal");

    // Data pelanggan dan produk
    let customers = JSON.parse(localStorage.getItem("customers")) || [
        
    ];

    let products = JSON.parse(localStorage.getItem("products")) || [
        
    ];

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Memuat daftar pelanggan ke dropdown
    function loadCustomers() {
        customerSelect.innerHTML = '<option value="">Pilih Pelanggan</option>';
        customers.forEach(customer => {
            const option = document.createElement("option");
            option.value = customer.id;
            option.textContent = `${customer.name} (${customer.role})`;
            customerSelect.appendChild(option);
        });
    }

    // Memuat daftar produk ke tabel
    function renderProductTable() {
        productTableBody.innerHTML = '';
        products.forEach((product, index) => {
            const row = productTableBody.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${product.name}</td>
                <td>$${product.price}</td>
                <td>${product.stock}</td>
                <td><button class="btn btn-primary btn-sm" onclick="addToCart('${product.id}')">Tambah</button></td>
            `;
        });
    }

    // Menambah produk ke keranjang
    window.addToCart = function (productId) {
        const product = products.find(p => p.id === productId);
        if (product && product.stock > 0) {
            const cartItem = cart.find(item => item.id === productId);
            if (cartItem) {
                cartItem.quantity += 1;
            } else {
                cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
            }
            product.stock -= 1;
            localStorage.setItem("products", JSON.stringify(products));
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCartTable();
            renderProductTable();
        }
    };

    // Menghapus produk dari keranjang
    window.removeFromCart = function (index) {
        const product = cart[index];
        const prodIndex = products.findIndex(p => p.id === product.id);
        products[prodIndex].stock += product.quantity;
        cart.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(products));
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCartTable();
        renderProductTable();
    };

    // Menampilkan tabel keranjang
    function renderCartTable() {
        cartTableBody.innerHTML = '';
        let totalAmount = 0;
        cart.forEach((item, index) => {
            const subtotal = item.price * item.quantity;
            totalAmount += subtotal;
            const row = cartTableBody.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td>${item.quantity}</td>
                <td>$${subtotal}</td>
                <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Hapus</button></td>
            `;
        });
        totalAmountElement.textContent = totalAmount.toFixed(2);
    }

    // Konfirmasi pembayaran
    checkoutButton.addEventListener("click", () => {
        if (customerSelect.value === "") {
            Swal.fire("Error", "Pilih pelanggan terlebih dahulu!", "error");
            return;
        }
        paymentSection.style.display = "block";
    });

    // Menyelesaikan pembayaran
    confirmPaymentButton.addEventListener("click", () => {
        paymentConfirmationSection.style.display = "block";
    });

    // Menyelesaikan pembayaran dan membuat transaksi
    completePaymentButton.addEventListener("click", () => {
        const customerId = customerSelect.value;
        const selectedCustomer = customers.find(c => c.id === customerId);
        const paymentMethodValue = paymentMethod.value;

        const transaction = {
            id: "trans-" + new Date().getTime(),
            customerId: selectedCustomer.id,
            products: cart.map(item => ({
                productId: item.id,
                productName: item.name,
                price: item.price,
                quantity: item.quantity,
                subtotal: item.price * item.quantity
            })),
            total: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
            paymentMethod: paymentMethodValue
        };

        transactions.push(transaction);
        localStorage.setItem("transactions", JSON.stringify(transactions));

        // Clear cart
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));

        displayInvoice(transaction);
        Swal.fire("Sukses", "Pembayaran selesai!", "success");
    });

    // Menampilkan invoice
    function displayInvoice(transaction) {
        invoiceCustomer.textContent = customers.find(c => c.id === transaction.customerId).name;
        invoicePaymentMethod.textContent = transaction.paymentMethod.toUpperCase();
        invoiceTableBody.innerHTML = "";
        let totalAmount = 0;

        transaction.products.forEach((item, index) => {
            const row = invoiceTableBody.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.productName}</td>
                <td>$${item.price}</td>
                <td>${item.quantity}</td>
                <td>$${item.subtotal}</td>
            `;
            totalAmount += item.subtotal;
        });

        invoiceTotal.textContent = totalAmount.toFixed(2);
        invoiceSection.style.display = "block";
    }

    // Menyembunyikan bagian pembayaran
    cancelPaymentButton.addEventListener("click", () => {
        paymentConfirmationSection.style.display = "none";
        paymentSection.style.display = "none";
    });

    // Memuat data saat halaman dimuat
    loadCustomers();
    renderProductTable();
    renderCartTable();
});
