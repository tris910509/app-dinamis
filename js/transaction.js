document.addEventListener("DOMContentLoaded", () => {
    // Data awal
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let cart = [];

    const roleSelect = document.getElementById("role");
    const customerSelect = document.getElementById("customer");
    const addCustomerBtn = document.getElementById("addCustomerBtn");
    const productSelect = document.getElementById("product");
    const quantityInput = document.getElementById("quantity");
    const discountSwitch = document.getElementById("discountSwitch");
    const discountValue = document.getElementById("discountValue");
    const cartTableBody = document.querySelector("#cartTable tbody");
    const subtotalInput = document.getElementById("subtotal");
    const finalDiscountInput = document.getElementById("finalDiscount");
    const totalInput = document.getElementById("total");
    const paymentInput = document.getElementById("payment");
    const changeInput = document.getElementById("change");
    const paymentMethodSelect = document.getElementById("paymentMethod");
    const transactionFormContent = document.getElementById("transactionFormContent");
    const transactionTableBody = document.querySelector("#transactionTable tbody");

    // Populate customer dropdown berdasarkan role
    function populateCustomerSelect(role) {
        customerSelect.innerHTML = "";
        if (role === "umum") {
            customerSelect.disabled = true;
            addCustomerBtn.classList.remove("d-none");
        } else {
            customerSelect.disabled = false;
            addCustomerBtn.classList.add("d-none");
            const filteredCustomers = customers.filter(customer => customer.role === role);
            filteredCustomers.forEach(customer => {
                const option = document.createElement("option");
                option.value = customer.id;
                option.textContent = customer.name;
                customerSelect.appendChild(option);
            });
        }
    }

    // Menambahkan pelanggan baru untuk role umum
    addCustomerBtn.addEventListener("click", () => {
        Swal.fire({
            title: "Tambah Pelanggan Baru",
            html: `
                <input id="name" class="swal2-input" placeholder="Nama" required>
                <input id="email" class="swal2-input" placeholder="Email" required>
                <input id="address" class="swal2-input" placeholder="Alamat" required>
            `,
            preConfirm: () => {
                const name = document.getElementById("name").value;
                const email = document.getElementById("email").value;
                const address = document.getElementById("address").value;

                if (name && email && address) {
                    const newCustomer = {
                        id: Date.now().toString(),
                        name,
                        email,
                        address,
                        role: "umum",
                        status: "aktif"
                    };
                    customers.push(newCustomer);
                    localStorage.setItem("customers", JSON.stringify(customers));
                    Swal.fire("Pelanggan Ditambahkan!", "", "success");
                } else {
                    Swal.showValidationMessage("Semua kolom harus diisi!");
                }
            }
        });
    });

    // Mengisi dropdown produk
    function populateProductSelect() {
        productSelect.innerHTML = "";
        products.forEach(product => {
            const option = document.createElement("option");
            option.value = product.id;
            option.textContent = `${product.name} (Rp ${product.price.toLocaleString()}, Stok: ${product.stock})`;
            productSelect.appendChild(option);
        });
    }

    // Menambahkan produk ke keranjang
    document.getElementById("addProductBtn").addEventListener("click", () => {
        const productId = productSelect.value;
        const product = products.find(p => p.id === productId);
        const quantity = parseInt(quantityInput.value, 10);
        const discount = parseFloat(discountValue.value) || 0;

        if (product && quantity > 0 && quantity <= product.stock) {
            const itemTotal = discountSwitch.checked
                ? product.price * quantity - discount
                : product.price * quantity * (1 - discount / 100);

            const item = {
                product,
                quantity,
                discount,
                total: itemTotal
            };

            cart.push(item);
            updateCart();
        } else {
            Swal.fire("Peringatan", "Produk atau jumlah tidak valid", "warning");
        }
    });

    // Update keranjang
    function updateCart() {
        cartTableBody.innerHTML = "";
        let subtotal = 0;
        cart.forEach((item, index) => {
            subtotal += item.total;
            const row = `
                <tr>
                    <td>${item.product.name}</td>
                    <td>Rp ${item.product.price.toLocaleString()}</td>
                    <td>${item.quantity}</td>
                    <td>${discountSwitch.checked ? `Rp ${item.discount}` : `${item.discount}%`}</td>
                    <td>Rp ${item.total.toLocaleString()}</td>
                    <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Hapus</button></td>
                </tr>
            `;
            cartTableBody.insertAdjacentHTML("beforeend", row);
        });

        subtotalInput.value = `Rp ${subtotal.toLocaleString()}`;
        calculateTotal(subtotal);
    }

    // Menghitung total transaksi
    function calculateTotal(subtotal) {
        const discountPercentage = parseFloat(finalDiscountInput.value) || 0;
        const totalAfterDiscount = subtotal - (subtotal * discountPercentage / 100);
        totalInput.value = `Rp ${totalAfterDiscount.toLocaleString()}`;

        const paymentAmount = parseFloat(paymentInput.value) || 0;
        const change = paymentAmount - totalAfterDiscount;
        changeInput.value = `Rp ${change < 0 ? 0 : change.toLocaleString()}`;
    }

    // Menghapus produk dari keranjang
    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCart();
    }

    // Submit transaksi
    transactionFormContent.addEventListener("submit", (e) => {
        e.preventDefault();

        const customerId = customerSelect.value || null;
        const customer = customers.find(c => c.id === customerId) || null;
        const paymentMethod = paymentMethodSelect.value;
        const subtotal = parseFloat(subtotalInput.value.replace("Rp ", "").replace(",", ""));
        const totalAfterDiscount = parseFloat(totalInput.value.replace("Rp ", "").replace(",", ""));
        const paymentAmount = parseFloat(paymentInput.value);
        const change = parseFloat(changeInput.value.replace("Rp ", "").replace(",", ""));

        const transaction = {
            id: Date.now().toString(),
            customer,
            items: cart,
            subtotal,
            total: totalAfterDiscount,
            paymentMethod,
            paymentStatus: paymentMethod === "cash" ? "Lunas" : "Belum Lunas",
            paymentAmount,
            change,
            date: new Date().toLocaleString()
        };

        transactions.push(transaction);
        localStorage.setItem("transactions", JSON.stringify(transactions));

        Swal.fire("Transaksi Berhasil!", "Data transaksi telah disimpan.", "success");
        updateTransactionTable();
        cart = [];
        updateCart();
        transactionFormContent.reset();
    });

    // Menampilkan transaksi pada tabel
    function updateTransactionTable() {
        transactionTableBody.innerHTML = "";
        transactions.forEach(transaction => {
            const row = `
                <tr>
                    <td>${transaction.id}</td>
                    <td>${transaction.customer ? transaction.customer.name : "Umum"}</td>
                    <td>${transaction.items.map(item => item.product.name).join(", ")}</td>
                    <td>Rp ${transaction.total.toLocaleString()}</td>
                    <td>${transaction.paymentMethod}</td>
                    <td>${transaction.paymentStatus}</td>
                    <td><button class="btn btn-info btn-sm" onclick="viewTransactionDetails(${transaction.id})">Detail</button></td>
                </tr>
            `;
            transactionTableBody.insertAdjacentHTML("beforeend", row);
        });
    }

    // Menampilkan detail transaksi
    function viewTransactionDetails(transactionId) {
        const transaction = transactions.find(t => t.id === transactionId);
        Swal.fire({
            title: `Detail Transaksi #${transaction.id}`,
            html: `
                <p><strong>Customer:</strong> ${transaction.customer ? transaction.customer.name : "Umum"}</p>
                <p><strong>Produk:</strong> ${transaction.items.map(item => `${item.product.name} - ${item.quantity} x Rp ${item.product.price}`).join(", ")}</p>
                <p><strong>Total:</strong> Rp ${transaction.total.toLocaleString()}</p>
                <p><strong>Status Pembayaran:</strong> ${transaction.paymentStatus}</p>
                <p><strong>Tanggal:</strong> ${transaction.date}</p>
            `
        });
    }

    // Inisialisasi
    roleSelect.addEventListener("change", () => populateCustomerSelect(roleSelect.value));
    populateProductSelect();
    updateTransactionTable();
});
