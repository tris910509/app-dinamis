//Logika untuk Pilihan Role
let selectedCustomer = null;
let cart = [];
let customers = JSON.parse(localStorage.getItem("customers")) || [];
let products = JSON.parse(localStorage.getItem("products")) || [];

function setCustomerRole(role) {
    if (role === "general") {
        selectedCustomer = {
            role: "general",
            name: document.getElementById("generalName").value,
            contact: document.getElementById("generalContact").value,
            email: document.getElementById("generalEmail").value,
            address: document.getElementById("generalAddress").value,
        };
        Swal.fire("Success", "Customer role set to General!", "success");
    } else if (role === "member") {
        const memberId = document.getElementById("memberSelect").value;
        selectedCustomer = customers.find((c) => c.id === memberId);
        Swal.fire("Success", "Customer role set to Member!", "success");
    }
}

// Populate Customer and Product dropdowns
document.addEventListener("DOMContentLoaded", function () {
    const memberSelect = document.getElementById("memberSelect");
    customers.forEach((customer) => {
        const option = document.createElement("option");
        option.value = customer.id;
        option.textContent = customer.name;
        memberSelect.appendChild(option);
    });

    const productSelect = document.getElementById("productSelect");
    products.forEach((product) => {
        const option = document.createElement("option");
        option.value = product.id;
        option.textContent = `${product.name} - $${product.price}`;
        productSelect.appendChild(option);
    });
});


//keranjang transaksi
function addToCart() {
    const productId = document.getElementById("productSelect").value;
    const quantity = parseInt(document.getElementById("quantity").value);

    if (!productId || quantity <= 0) {
        Swal.fire("Error", "Pilih produk dan jumlah dengan benar.", "error");
        return;
    }

    const product = products.find((p) => p.id === productId);
    if (!product || product.stock < quantity) {
        Swal.fire("Error", "Stok tidak mencukupi.", "error");
        return;
    }

    // Tambahkan ke keranjang
    cart.push({
        product,
        quantity,
        total: product.price * quantity,
    });

    product.stock -= quantity;
    localStorage.setItem("products", JSON.stringify(products));
    renderCartTable();
}

function renderCartTable() {
    const cartTableBody = document.getElementById("cartTable").getElementsByTagName("tbody")[0];
    cartTableBody.innerHTML = "";

    let subtotal = 0;
    cart.forEach((item, index) => {
        subtotal += item.total;

        const row = cartTableBody.insertRow();
        row.innerHTML = `
            <td>${item.product.name}</td>
            <td>${item.product.price}</td>
            <td>${item.quantity}</td>
            <td>${item.total}</td>
            <td><button class="btn btn-danger" onclick="removeFromCart(${index})">Hapus</button></td>
        `;
    });

    document.getElementById("subtotal").textContent = subtotal;
}

function removeFromCart(index) {
    const item = cart[index];
    const product = products.find((p) => p.id === item.product.id);
    product.stock += item.quantity;
    localStorage.setItem("products", JSON.stringify(products));

    cart.splice(index, 1);
    renderCartTable();
}


//pembayaran
function processCashPayment() {
    const subtotal = parseFloat(document.getElementById("subtotal").textContent);
    const cashAmount = parseFloat(document.getElementById("cashAmount").value);

    if (cashAmount >= subtotal) {
        Swal.fire("Success", "Pembayaran berhasil! Status: Lunas", "success");
    } else {
        Swal.fire("Error", "Uang tidak mencukupi. Alihkan ke konfirmasi pembayaran.", "error");
    }
}

function finalizeTransaction() {
    const paymentMethod = document.getElementById("paymentMethod").value;
    if (paymentMethod === "cash") {
        processCashPayment();
    } else {
        Swal.fire("Info", "Transaksi non-cash memerlukan konfirmasi.", "info");
    }
}

