document.addEventListener("DOMContentLoaded", function () {
    const productForm = document.getElementById("productForm");
    const productTable = document.getElementById("productTable").getElementsByTagName('tbody')[0];
    const productCategory = document.getElementById("productCategory");

    let categories = JSON.parse(localStorage.getItem("categories")) || [];
    let products = JSON.parse(localStorage.getItem("products")) || [];

    // Populate categories dropdown
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        productCategory.appendChild(option);
    });

    // Save product
    productForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const id = "product-" + Date.now(); // Generate unique ID
        const name = document.getElementById("productName").value;
        const category = document.getElementById("productCategory").value;
        const price = document.getElementById("productPrice").value;
        const stock = document.getElementById("productStock").value;

        products.push({ id, name, category, price, stock });
        localStorage.setItem("products", JSON.stringify(products));
        renderProductTable();
        productForm.reset();
        Swal.fire("Success", "Product added successfully", "success");
        bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
    });

    // Render products table
    function renderProductTable() {
        productTable.innerHTML = "";
        products.forEach((product, index) => {
            const row = productTable.insertRow();
            const categoryName = categories.find(cat => cat.id === product.category)?.name || "Unknown";
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${categoryName}</td>
                <td>${product.price}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editProduct(${index})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${index})">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </td>
            `;
        });
    }

    // Edit product
    window.editProduct = function (index) {
        const product = products[index];
        const category = categories.find(cat => cat.id === product.category);
        const modal = new bootstrap.Modal(document.getElementById("productModal"));
        document.getElementById("productName").value = product.name;
        document.getElementById("productPrice").value = product.price;
        document.getElementById("productStock").value = product.stock;

        productCategory.value = category ? category.id : "";

        // Modify the form for editing
        productForm.removeEventListener("submit", saveProduct);
        productForm.addEventListener("submit", function (e) {
            e.preventDefault();

            product.name = document.getElementById("productName").value;
            product.price = document.getElementById("productPrice").value;
            product.stock = document.getElementById("productStock").value;

            localStorage.setItem("products", JSON.stringify(products));
            renderProductTable();
            modal.hide();
            Swal.fire("Success", "Product updated successfully", "success");
        });
        modal.show();
    };

    // Delete product
    window.deleteProduct = function (index) {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                products.splice(index, 1);
                localStorage.setItem("products", JSON.stringify(products));
                renderProductTable();
                Swal.fire("Deleted!", "Product has been deleted.", "success");
            }
        });
    };

    // Load products on page load
    renderProductTable();
});
