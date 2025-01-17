document.addEventListener("DOMContentLoaded", function () {
    const addCustomerBtn = document.getElementById("addCustomerBtn");
    const customerModal = new bootstrap.Modal(document.getElementById("customerModal"));
    const customerForm = document.getElementById("customerForm");
    const customerTable = document.getElementById("customerTable").getElementsByTagName('tbody')[0];
    let customers = JSON.parse(localStorage.getItem("customers")) || [];

    // Function to render the customer table
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

    // Add Customer Button Click Event
    addCustomerBtn.addEventListener("click", () => {
        customerModal.show();
    });

    // Submit Form Event
    customerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const customerName = document.getElementById("customerName").value;
        const customerEmail = document.getElementById("customerEmail").value;
        const customerPassword = document.getElementById("customerPassword").value;
        const customerStatus = document.getElementById("customerStatus").value;
        const customerPhoto = document.getElementById("customerPhoto").files[0];

        if (!customerName || !customerEmail || !customerPassword || !customerStatus) {
            Swal.fire("Error", "All fields are required", "error");
            return;
        }

        // Generate unique ID for the customer
        const customerId = `customer-${Date.now()}`;

        // Upload photo to base64 (for simplicity)
        let photoUrl = '';
        if (customerPhoto) {
            const reader = new FileReader();
            reader.onloadend = function () {
                photoUrl = reader.result;
                saveCustomer(customerId, customerName, customerEmail, customerPassword, customerStatus, photoUrl);
            };
            reader.readAsDataURL(customerPhoto);
        } else {
            saveCustomer(customerId, customerName, customerEmail, customerPassword, customerStatus, '');
        }
    });

    // Function to save customer data
    function saveCustomer(id, name, email, password, status, photo) {
        customers.push({
            id: id,
            name: name,
            email: email,
            password: password, // Store plain text password for now
            status: status,
            photo: photo
        });
        localStorage.setItem("customers", JSON.stringify(customers));
        customerForm.reset();
        customerModal.hide();
        renderCustomerTable();
        Swal.fire("Success", "Customer added successfully", "success");
    }

    // Edit Customer
    window.editCustomer = function (index) {
        const customer = customers[index];
        document.getElementById("customerName").value = customer.name;
        document.getElementById("customerEmail").value = customer.email;
        document.getElementById("customerPassword").value = customer.password;
        document.getElementById("customerStatus").value = customer.status;
        customerModal.show();
    };

    // Delete Customer
    window.deleteCustomer = function (index) {
        Swal.fire({
            title: "Are you sure?",
            text: "You will not be able to recover this customer!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!"
        }).then((result) => {
            if (result.isConfirmed) {
                customers.splice(index, 1);
                localStorage.setItem("customers", JSON.stringify(customers));
                renderCustomerTable();
                Swal.fire("Deleted!", "The customer has been deleted.", "success");
            }
        });
    };

    // Initial Table Render
    renderCustomerTable();
});
