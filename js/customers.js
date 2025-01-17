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
    customerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const id = "customer-" + Date.now(); // Generate unique ID
        const name = document.getElementById("customerName").value;
        const email = document.getElementById("customerEmail").value;
        const password = document.getElementById("customerPassword").value;
        const hashedPassword = CryptoJS.SHA256(password).toString(); // Hash password
        const role = customerRole.value;
        const discount = customerDiscount.value;
        const status = document.getElementById("customerStatus").value;
        const photoInput = document.getElementById("customerPhoto");
        let photo = "";

        if (photoInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function (event) {
                photo = event.target.result;
                saveCustomer(id, name, email, hashedPassword, role, discount, status, photo);
            };
            reader.readAsDataURL(photoInput.files[0]);
        } else {
            saveCustomer(id, name, email, hashedPassword, role, discount, status, photo);
        }
    });

    // Save to localStorage and render table
    function saveCustomer(id, name, email, password, role, discount, status, photo) {
        customers.push({ id, name, email, password, role, discount, status, photo });
        localStorage.setItem("customers", JSON.stringify(customers));
        renderCustomerTable();
        customerForm.reset();
        Swal.fire("Success", "Customer added successfully", "success");
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
                <td>${customer.photo ? `<img src="${customer.photo}" alt="Photo" width="50" height="50">` : "No Photo"}</td>
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

    // Load customers on page load
    renderCustomerTable();
});
