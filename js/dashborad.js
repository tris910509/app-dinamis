document.addEventListener("DOMContentLoaded", function () {
    const addUserBtn = document.getElementById("addUserBtn");
    const userModal = new bootstrap.Modal(document.getElementById("userModal"));
    const userForm = document.getElementById("userForm");
    const userTable = document.getElementById("userTable").getElementsByTagName('tbody')[0];
    const totalUsers = document.getElementById("totalUsers");
    const activeUsers = document.getElementById("activeUsers");
    const inactiveUsers = document.getElementById("inactiveUsers");

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

        // Update statistics
        updateStats();
    }

    // Function to update user statistics
    function updateStats() {
        totalUsers.textContent = users.length;
        activeUsers.textContent = users.filter(user => user.status).length;
        inactiveUsers.textContent = users.filter(user => !user.status).length;
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
            Swal.fire("Error", "Please fill all fields", "error");
            return;
        }

        const hashedPassword = CryptoJS.SHA256(userPassword).toString();

        // Generate unique ID based on current timestamp
        const userId = "user-" + new Date().getTime();

        const newUser = {
            id: userId,
            name: userName,
            email: userEmail,
            password: hashedPassword,
            address: userAddress,
            status: userStatus,
            role: userRole
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        Swal.fire("Success", "User added successfully", "success");

        userModal.hide();
        renderTable();
    });

    // Edit User (Update functionality)
    window.editUser = function (index) {
        const user = users[index];
        document.getElementById("userName").value = user.name;
        document.getElementById("userEmail").value = user.email;
        document.getElementById("userPassword").value = user.password;
        document.getElementById("userAddress").value = user.address;
        document.getElementById("userStatus").checked = user.status;
        document.getElementById("userRole").value = user.role;
        userModal.show();
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
