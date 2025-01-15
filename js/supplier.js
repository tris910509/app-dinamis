document.addEventListener("DOMContentLoaded", function () {
    const supplierForm = document.getElementById("supplierForm");
    const supplierTable = document.getElementById("supplierTable").getElementsByTagName('tbody')[0];
    let suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];

    // Save supplier
    supplierForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const id = "supplier-" + Date.now(); // Generate unique ID
        const name = document.getElementById("supplierName").value;
        const address = document.getElementById("supplierAddress").value;
        const contact = document.getElementById("supplierContact").value;
        const status = document.getElementById("supplierStatus").value;

        // Get the selected file for photo
        const photoFile = document.getElementById("supplierPhoto").files[0];
        const photoURL = photoFile ? URL.createObjectURL(photoFile) : "";

        suppliers.push({ id, name, address, contact, status, photoURL });
        localStorage.setItem("suppliers", JSON.stringify(suppliers));
        renderSupplierTable();
        supplierForm.reset();
        Swal.fire("Success", "Supplier added successfully", "success");
        bootstrap.Modal.getInstance(document.getElementById("supplierModal")).hide();
    });

    // Render supplier table
    function renderSupplierTable() {
        supplierTable.innerHTML = "";
        suppliers.forEach((supplier, index) => {
            const statusText = supplier.status === "active" ? "Active" : "Inactive";
            const statusClass = supplier.status === "active" ? "badge bg-success" : "badge bg-danger";

            const row = supplierTable.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${supplier.id}</td>
                <td>${supplier.name}</td>
                <td>${supplier.address}</td>
                <td>${supplier.contact}</td>
                <td><span class="${statusClass}">${statusText}</span></td>
                <td><img src="${supplier.photoURL}" alt="Supplier Photo" width="50"></td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editSupplier(${index})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteSupplier(${index})">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </td>
            `;
        });
    }

    // Edit supplier
    window.editSupplier = function (index) {
        const supplier = suppliers[index];
        const modal = new bootstrap.Modal(document.getElementById("supplierModal"));
        document.getElementById("supplierName").value = supplier.name;
        document.getElementById("supplierAddress").value = supplier.address;
        document.getElementById("supplierContact").value = supplier.contact;
        document.getElementById("supplierStatus").value = supplier.status;

        // Modify the form for editing
        supplierForm.removeEventListener("submit", saveSupplier);
        supplierForm.addEventListener("submit", function (e) {
            e.preventDefault();

            supplier.name = document.getElementById("supplierName").value;
            supplier.address = document.getElementById("supplierAddress").value;
            supplier.contact = document.getElementById("supplierContact").value;
            supplier.status = document.getElementById("supplierStatus").value;

            const newPhotoFile = document.getElementById("supplierPhoto").files[0];
            if (newPhotoFile) {
                supplier.photoURL = URL.createObjectURL(newPhotoFile);
            }

            localStorage.setItem("suppliers", JSON.stringify(suppliers));
            renderSupplierTable();
            modal.hide();
            Swal.fire("Success", "Supplier updated successfully", "success");
        });
        modal.show();
    };

    // Delete supplier
    window.deleteSupplier = function (index) {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                suppliers.splice(index, 1);
                localStorage.setItem("suppliers", JSON.stringify(suppliers));
                renderSupplierTable();
                Swal.fire("Deleted!", "Supplier has been deleted.", "success");
            }
        });
    };

    // Load suppliers on page load
    renderSupplierTable();
});
