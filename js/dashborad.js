document.addEventListener("DOMContentLoaded", function () {
    const cartCount = document.getElementById("cartCount");
    const userName = document.getElementById("userName");

    // Dummy data for cart and profile
    let cartItems = [1, 2, 3];  // Example transaction IDs
    let user = {
        name: "John Doe",
        status: "Active",
        address: "123 Main St, City",
        photo: "https://via.placeholder.com/40",
    };

    // Update cart count and user profile info
    function updateDashboard() {
        cartCount.textContent = cartItems.length;
        userName.textContent = user.name;
    }

    // Search Filter Functionality
    function filterSearch() {
        const searchValue = document.getElementById("searchInput").value.toLowerCase();
        // Assuming you have a data array to filter
        const filteredData = data.filter(item => {
            return item.id.toString().includes(searchValue) ||
                item.name.toLowerCase().includes(searchValue) ||
                item.date.toLowerCase().includes(searchValue);
        });
        // Render filtered data (you need to implement renderData function)
        renderData(filteredData);
    }

    // Placeholder for rendering filtered data
    function renderData(filteredData) {
        console.log(filteredData);
        // Your table rendering code here
    }

    // Profile view function (display modal or page)
    function viewProfile() {
        Swal.fire({
            title: "User Profile",
            html: `
                <img src="${user.photo}" class="profile-img">
                <h3>${user.name}</h3>
                <p>Status: ${user.status}</p>
                <p>Address: ${user.address}</p>
            `,
            confirmButtonText: 'Close',
        });
    }

    // Navigate to different sections (dummy function)
    function navigateTo(section) {
        console.log("Navigating to:", section);
        // Your navigation logic here (e.g., switching content dynamically)
    }

    // Initialize dashboard
    updateDashboard();
});
