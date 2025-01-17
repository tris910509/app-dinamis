document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent form submission

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Check if the email exists in localStorage
        const customers = JSON.parse(localStorage.getItem("customers")) || [];
        const user = customers.find(customer => customer.email === email);

        if (user) {
            // Check if the password matches
            const hashedPassword = sha256(password); // Use SHA-256 hash for password comparison
            if (user.password === hashedPassword) {
                // Successful login
                Swal.fire("Login Successful", "Welcome back, " + user.name, "success").then(() => {
                    // Redirect to dashboard or home page
                    window.location.href = "dashboard.html";
                });
            } else {
                // Incorrect password
                Swal.fire("Error", "Incorrect password. Please try again.", "error");
            }
        } else {
            // Email not found
            Swal.fire("Error", "Email not found. Please register.", "error");
        }
    });
});
