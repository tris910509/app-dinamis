document.addEventListener("DOMContentLoaded", function () {
    const addCustomerBtn = document.getElementById("addCustomerBtn");
    const customerModal = new bootstrap.Modal(document.getElementById("customerModal"));
    const customerForm = document.getElementById("customerForm");
    const customerTable = document.getElementById("customerTable").getElementsByTagName('tbody')[0];
    let customers = JSON.parse(localStorage.getItem("customers")) || [];

    // Generate diskon berdasarkan role
    function getDiscount(role) {
        switch (role) {
            case "umum": return 5;
            case "pelsem": return 10;
            case "pelmem": return 15;
            default: return 0;
        }
    }

    // Render tabel pelanggan
    function renderCustomerTable() {
        customerTable.innerHTML = "";
        customers.forEach((customer, index) => {
            const row = customerTable.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.password}</td>
                <td>${customer.status}</td>
                <td>${customer.role}</td>
                <td>${customer.discount}%</td>
                <td><img src="${customer.photo}" alt="photo" width="50" height="50"></td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editCustomer(${index})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCustomer(${index})">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </td>
            `;
        });
    }

    // Tambah pelanggan baru
    customerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("customerName").value;
        const email = document.getElementById("customerEmail").value;
        const password = document.getElementById("customerPassword").value;
        const status = document.getElementById("customerStatus").value;
        const role = document.getElementById("customerRole").value;
        const photoInput = document.getElementById("customerPhoto");
        const id = `customer-${Date.now()}`;
        const discount = getDiscount(role);

        let photo = "";
        if (photoInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function () {
                photo = reader.result;
                saveCustomer(id, name, email, password, status, role, discount, photo);
            };
            reader.readAsDataURL(photoInput.files[0]);
        } else {
            saveCustomer(id, name, email, password, status, role, discount, photo);
        }
    });

    function saveCustomer(id, name, email, password, status, role, discount, photo) {
        customers.push({ id, name, email, password, status, role, discount, photo });
        localStorage.setItem("customers", JSON.stringify(customers));
        customerForm.reset();
        customerModal.hide();
        renderCustomerTable();
        Swal.fire("Success", "Customer added successfully!", "success");
    }

    // Edit pelanggan
    window.editCustomer = function (index) {
        Swal.fire("Editing is not implemented in this demo.");
    };

    // Hapus pelanggan
    window.deleteCustomer = function (index) {
        customers.splice(index, 1);
        localStorage.setItem("customers", JSON.stringify(customers));
        renderCustomerTable();
        Swal.fire("Deleted!", "Customer has been removed.", "success");
    };

    // Render tabel saat halaman dimuat
    renderCustomerTable();
});
