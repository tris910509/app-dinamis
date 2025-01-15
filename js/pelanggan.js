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
                <td>${customer.address}</td>
                <td>${customer.phone}</td>
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
        const customerAddress = document.getElementById("customerAddress").value;
        const customerPhone = document.getElementById("customerPhone").value;

        if (!customerName || !customerEmail || !customerAddress || !customerPhone) {
            Swal.fire("Error", "All fields are required", "error");
            return;
        }

        // Generate unique ID for the customer
        const customerId = `customer-${Date.now()}`;

        // Add Customer
        customers.push({
            id: customerId,
            name: customerName,
            email: customerEmail,
            address: customerAddress,
            phone: customerPhone
        });
        localStorage.setItem("customers", JSON.stringify(customers));

        // Clear Form
        customerForm.reset();
        customerModal.hide();
        renderCustomerTable();
        Swal.fire("Success", "Customer added successfully", "success");
    });

    // Edit Customer
    window.editCustomer = function (index) {
        const customer = customers[index];
        document.getElementById("customerName").value = customer.name;
        document.getElementById("customerEmail").value = customer.email;
        document.getElementById("customerAddress").value = customer.address;
        document.getElementById("customerPhone").value = customer.phone;
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
