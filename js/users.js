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
                <td>${index + 1}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
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

        if (!userName || !userEmail) {
            Swal.fire("Error", "All fields are required", "error");
            return;
        }

        // Add User
        users.push({ name: userName, email: userEmail });
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
        userModal.show();

        // Handle Save
        userForm.onsubmit = function (e) {
            e.preventDefault();
            users[index] = { name: document.getElementById("userName").value, email: document.getElementById("userEmail").value };
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
