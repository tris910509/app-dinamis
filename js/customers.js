document.addEventListener("DOMContentLoaded", function () {
    const customerForm = document.getElementById("customerForm");
    const customerRole = document.getElementById("customerRole");
    const customerDiscount = document.getElementById("customerDiscount");
    const customerTable = document.getElementById("customerTable").getElementsByTagName('tbody')[0];
    let customers = JSON.parse(localStorage.getItem("customers")) || [];

    // Update discount based on role selection
    customerRole.addEventListener("change", function () {
        const role = customerRole.value;
        let discount = 0;
        if (role === "PelSem") discount = 10;
        else if (role === "PelMem") discount = 20;
        customerDiscount.value = `${discount}%`;
    });

    // Save customer data
    customerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const index = document.getElementById("customerIndex").value;
        const id = index ? customers[index].id : "customer-" + Date.now();
        const name = document.getElementById("customerName").value;
        const email = document.getElementById("customerEmail").value;
        const password = document.getElementById("customerPassword").value;
        const role = customerRole.value;
        const discount = customerDiscount.value;
        const status = document.getElementById("customerStatus").value;
        const photoInput = document.getElementById("customerPhoto");
        let photo = index ? customers[index].photo : "";

        if (photoInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function (event) {
                photo = event.target.result;
                saveCustomer(index, id, name, email, password, role, discount, status, photo);
            };
            reader.readAsDataURL(photoInput.files[0]);
        } else {
            saveCustomer(index, id, name, email, password, role, discount, status, photo);
        }
    });

    // Save to localStorage and render table
    function saveCustomer(index, id, name, email, password, role, discount, status, photo) {
        if (index) {
            customers[index] = { id, name, email, password, role, discount, status, photo };
        } else {
            customers.push({ id, name, email, password, role, discount, status, photo });
        }
        localStorage.setItem("customers", JSON.stringify(customers));
        renderCustomerTable();
        customerForm.reset();
        Swal.fire("Success", "Customer saved successfully", "success");
        bootstrap.Modal.getInstance(document.getElementById("customerModal")).hide();
    }

    // Render customers table
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
                <td>${customer.role}</td>
                <td>${customer.discount}</td>
                <td>${customer.status}</td>
                <td><img src="${customer.photo}" alt="Photo" width="50" height="50"></td>
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

    // Edit customer
    window.editCustomer = function (index) {
        const customer = customers[index];
        document.getElementById("customerIndex").value = index;
        document.getElementById("customerName").value = customer.name;
        document.getElementById("customerEmail").value = customer.email;
        document.getElementById("customerPassword").value = customer.password;
        document.getElementById("customerRole").value = customer.role;
        customerDiscount.value = customer.discount;
        document.getElementById("customerStatus").value = customer.status;
        bootstrap.Modal.getInstance(document.getElementById("customerModal")).show();
    };

    // Delete customer
    window.deleteCustomer = function (index) {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                customers.splice(index, 1);
                localStorage.setItem("customers", JSON.stringify(customers));
                renderCustomerTable();
                Swal.fire("Deleted!", "Customer has been deleted.", "success");
            }
        });
    };

    // Load customers on page load
    renderCustomerTable();
});
