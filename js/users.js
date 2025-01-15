document.addEventListener("DOMContentLoaded", function () {
    const addUserBtn = document.getElementById("addUserBtn");
    const userModal = new bootstrap.Modal(document.getElementById("userModal"));
    const userForm = document.getElementById("userForm");
    const userTable = document.getElementById("userTable").getElementsByTagName('tbody')[0];
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Function to render the user table
    function renderTable() {
        userTable.innerHTML = "";
        users.forEach((user, index) => {
            const row = userTable.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td> <!-- No -->
                <td>${user.id}</td> <!-- Unique User ID -->
                <td>${user.name}</td> <!-- User Name -->
                <td>${user.password}</td> <!-- User Password -->
                <td>${user.email}</td> <!-- User Email -->
                <td>${user.address}</td> <!-- User Address -->
                <td>
                    <span class="badge bg-${user.status ? 'success' : 'danger'}">
                        ${user.status ? 'Active' : 'Inactive'}
                    </span>
                </td> <!-- User Status (Active/Inactive) -->
                <td>${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td> <!-- User Role -->
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editUser(${index})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteUser(${index})">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </td>
            `;
        });
    }

    // Add User Button Click Event
    addUserBtn.addEventListener("click", () => {
        userModal.show();
    });

    // Submit Form Event
    userForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const userName = document.getElementById("userName").value;
        const userEmail = document.getElementById("userEmail").value;
        const userPassword = document.getElementById("userPassword").value;
        const userAddress = document.getElementById("userAddress").value;
        const userStatus = document.getElementById("userStatus").checked;
        const userRole = document.getElementById("userRole").value;

        if (!userName || !userEmail || !userPassword || !userAddress) {
            Swal.fire("Error", "All fields are required", "error");
            return;
        }

        // Generate unique ID based on current timestamp
        const userId = `user-${Date.now()}`;

        // Hash the password with SHA256
        const hashedPassword = CryptoJS.SHA256(userPassword).toString(CryptoJS.enc.Base64);

        // Add User
        users.push({
            id: userId,
            name: userName,
            email: userEmail,
            password: hashedPassword,
            address: userAddress,
            status: userStatus,
            role: userRole
        });
        localStorage.setItem("users", JSON.stringify(users));

        // Clear Form
        userForm.reset();
        userModal.hide();
        renderTable();
        Swal.fire("Success", "User added successfully", "success");
    });

    // Edit User
    window.editUser = function (index) {
        const user = users[index];
        document.getElementById("userName").value = user.name;
        document.getElementById("userEmail").value = user.email;
        document.getElementById("userPassword").value = ""; // For security, do not prefill password
        document.getElementById("userAddress").value = user.address;
        document.getElementById("userStatus").checked = user.status;
        document.getElementById("userRole").value = user.role;
        userModal.show();

        // Handle Save
        userForm.onsubmit = function (e) {
            e.preventDefault();
            users[index] = {
                id: user.id,  // Preserve the original ID
                name: document.getElementById("userName").value,
                email: document.getElementById("userEmail").value,
                password: CryptoJS.SHA256(document.getElementById("userPassword").value).toString(CryptoJS.enc.Base64),
                address: document.getElementById("userAddress").value,
                status: document.getElementById("userStatus").checked,
                role: document.getElementById("userRole").value
            };
            localStorage.setItem("users", JSON.stringify(users));
            userModal.hide();
            renderTable();
            Swal.fire("Success", "User updated successfully", "success");
        };
    };

    // Delete User
    window.deleteUser = function (index) {
        Swal.fire({
            title: "Are you sure?",
            text: "You will not be able to recover this user!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!"
        }).then((result) => {
            if (result.isConfirmed) {
                users.splice(index, 1);
                localStorage.setItem("users", JSON.stringify(users));
                renderTable();
                Swal.fire("Deleted!", "The user has been deleted.", "success");
            }
        });
    };

    // Initial Table Render
    renderTable();
});
