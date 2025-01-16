document.addEventListener("DOMContentLoaded", function () {
    const cartTable = document.getElementById("cartTable").getElementsByTagName('tbody')[0];
    const totalAmountElement = document.getElementById("totalAmount");
    const totalDiscountedElement = document.getElementById("totalDiscounted");
    const customerSelect = document.getElementById("customerSelect");
    const discountInput = document.getElementById("discount");
    const paymentStageInput = document.getElementById("paymentStage");
    const confirmPaymentButton = document.getElementById("confirmPayment");
    const addPaymentStageButton = document.getElementById("addPaymentStage");

    let cart = [];
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let customers = JSON.parse(localStorage.getItem("customers")) || [];
    let paymentStages = [];
    let totalAmount = 0;

    // Load customers to the customer select dropdown
    customers.forEach(customer => {
        const option = document.createElement("option");
        option.value = customer.id;
        option.textContent = customer.name;
        customerSelect.appendChild(option);
    });

    // Load products into the product selection modal
    const productList = document.getElementById("productList");
    products.forEach(product => {
        const listItem = document.createElement("li");
        listItem.classList.add("d-flex", "justify-content-between", "align-items-center");
        listItem.innerHTML = `
            <span>${product.name} - Rp ${product.price} (Stok: ${product.stock})</span>
            <button class="btn btn-sm btn-primary addProductButton" data-id="${product.id}">Tambah</button>
        `;
        productList.appendChild(listItem);
    });

    // Add product to the cart
    productList.addEventListener("click", function (e) {
        if (e.target.classList.contains("addProductButton")) {
            const productId = e.target.getAttribute("data-id");
            const product = products.find(p => p.id === productId);
            if (product && product.stock > 0) {
                const existingProductInCart = cart.find(item => item.id === productId);
                if (existingProductInCart) {
                    existingProductInCart.quantity++;
                } else {
                    cart.push({ ...product, quantity: 1 });
                }
                product.stock--; // Reduce stock
                renderCart();
                checkLowStock(product);
            } else {
                Swal.fire("Stok Habis", "Produk ini sudah tidak tersedia dalam jumlah yang cukup.", "error");
            }
        }
    });

    // Render cart table
    function renderCart() {
        cartTable.innerHTML = "";
        totalAmount = 0;
        cart.forEach((item, index) => {
            const row = cartTable.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>Rp ${item.price}</td>
                <td><input type="number" class="form-control" value="${item.quantity}" min="1" data-index="${index}" onchange="updateQuantity(event)"></td>
                <td>Rp ${item.price * item.quantity}</td>
                <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Hapus</button></td>
            `;
            totalAmount += item.price * item.quantity;
        });

        const discount = parseFloat(discountInput.value) || 0;
        const discountedAmount = totalAmount - (totalAmount * (discount / 100));
        totalDiscountedElement.textContent = `Rp ${discountedAmount}`;
        totalAmountElement.textContent = `Rp ${totalAmount}`;
    }

    // Update product quantity
    window.updateQuantity = function (event) {
        const index = event.target.getAttribute("data-index");
        const quantity = parseInt(event.target.value);
        if (quantity > 0) {
            cart[index].quantity = quantity;
            renderCart();
        }
    };

    // Remove product from cart
    window.removeFromCart = function (index) {
        const product = cart[index];
        products.find(p => p.id === product.id).stock += product.quantity; // Restore stock
        cart.splice(index, 1);
        renderCart();
    };

    // Check low stock for products
    function checkLowStock(product) {
        if (product.stock <= 5) {
            Swal.fire({
                title: "Stok Produk Rendah",
                text: `Stok produk ${product.name} hampir habis!`,
                icon: "warning",
            });
        }
    }

    // Add payment stage
    addPaymentStageButton.addEventListener("click", function () {
        const paymentAmount = parseFloat(paymentStageInput.value);
        if (paymentAmount > 0 && paymentAmount <= totalAmount) {
            paymentStages.push(paymentAmount);
            totalAmount -= paymentAmount;
            renderCart();
            Swal.fire("Pembayaran Bertahap", `Rp ${paymentAmount} telah dibayar. Sisa: Rp ${totalAmount}`, "success");
        } else {
            Swal.fire("Error", "Jumlah pembayaran tidak valid", "error");
        }
    });

    // Confirm payment and finalize transaction
    confirmPaymentButton.addEventListener("click", function () {
        if (cart.length === 0) {
            Swal.fire("Error", "Keranjang belanja kosong", "error");
            return;
        }

        const customerId = customerSelect.value;
        if (!customerId) {
            Swal.fire("Error", "Pilih pelanggan terlebih dahulu", "error");
            return;
        }

        const transaction = {
            id: "txn-" + Date.now(),
            customerId: customerId,
            items: cart,
            total: totalAmount,
            discount: parseFloat(discountInput.value) || 0,
            status: "Lunas",
            paymentStages: paymentStages,
            date: new Date().toLocaleString(),
        };

        const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        transactions.push(transaction);
        localStorage.setItem("transactions", JSON.stringify(transactions));

        // Clear cart and reset form
        cart = [];
        paymentStages = [];
        discountInput.value = '';
        paymentStageInput.value = '';
        customerSelect.value = '';
        renderCart();

        Swal.fire("Success", "Transaksi berhasil", "success");
    });
});
