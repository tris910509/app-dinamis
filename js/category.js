document.addEventListener("DOMContentLoaded", function () {
    const categoryForm = document.getElementById("categoryForm");
    const categoryTable = document.getElementById("categoryTable").getElementsByTagName('tbody')[0];
    let categories = JSON.parse(localStorage.getItem("categories")) || [];

    // Save category
    categoryForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const id = "category-" + Date.now(); // Generate unique ID
        const name = document.getElementById("categoryName").value;
        const description = document.getElementById("categoryDescription").value;

        categories.push({ id, name, description });
        localStorage.setItem("categories", JSON.stringify(categories));
        renderCategoryTable();
        categoryForm.reset();
        Swal.fire("Success", "Category added successfully", "success");
        bootstrap.Modal.getInstance(document.getElementById("categoryModal")).hide();
    });

    // Render categories table
    function renderCategoryTable() {
        categoryTable.innerHTML = "";
        categories.forEach((category, index) => {
            const row = categoryTable.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${category.id}</td>
                <td>${category.name}</td>
                <td>${category.description}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editCategory(${index})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCategory(${index})">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </td>
            `;
        });
    }

    // Edit category
    window.editCategory = function (index) {
        const category = categories[index];
        Swal.fire({
            title: "Edit Category",
            html: `
                <input id="swal-category-name" class="swal2-input" value="${category.name}">
                <textarea id="swal-category-description" class="swal2-textarea" rows="3">${category.description}</textarea>
            `,
            showCancelButton: true,
            confirmButtonText: "Save",
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedName = document.getElementById("swal-category-name").value;
                const updatedDescription = document.getElementById("swal-category-description").value;

                if (updatedName && updatedDescription) {
                    categories[index].name = updatedName;
                    categories[index].description = updatedDescription;
                    localStorage.setItem("categories", JSON.stringify(categories));
                    renderCategoryTable();
                    Swal.fire("Success", "Category updated successfully", "success");
                } else {
                    Swal.fire("Error", "All fields are required", "error");
                }
            }
        });
    };

    // Delete category
    window.deleteCategory = function (index) {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                categories.splice(index, 1);
                localStorage.setItem("categories", JSON.stringify(categories));
                renderCategoryTable();
                Swal.fire("Deleted!", "Category has been deleted.", "success");
            }
        });
    };

    // Load categories on page load
    renderCategoryTable();
});
