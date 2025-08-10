const allPhonesURL = "http://localhost:5165/api/GETadminPage";
let allPhonesData = [];

function loadPhonesFromBackend() {
    fetch(allPhonesURL)
        .then(response => response.json())
        .then(data => {
            allPhonesData = data;
            console.log("Telefon adatok:", allPhonesData);
        })
        .catch(error => console.error("Hiba:", error));
}

function DELETEphone(phoneID) {
    fetch(`http://localhost:5165/api/DELETEadminPage/${phoneID}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.ok) {
                console.log('Delete successful!');
            } else if (response.status === 404) {
                console.log('Phone not found!');
            } else {
                console.log('Delete failed with status:', response.status);
            }
        })
        .catch(error => {
            console.error('Error calling delete endpoint:', error);
        });
}




document.getElementById("searchInputName").addEventListener("input", function () {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll("#tableBody tr");

    rows.forEach(row => {
        const nameCell = row.children[2]; // Second column = name
        if (nameCell && nameCell.textContent.toLowerCase().includes(filter)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});


// Replace with the actual phone ID you want to delete


document.getElementById("searchInputManufacturer").addEventListener("input", function () {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll("#tableBody tr");

    rows.forEach(row => {
        const nameCell = row.children[1]; // Second column = name
        if (nameCell && nameCell.textContent.toLowerCase().includes(filter)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});


const users = [
    { ID: 1, Név: "Kiss Péter", Email: "peter@example.com", Szerep: "Admin" },
    { ID: 2, Név: "Nagy Anna", Email: "anna@example.com", Szerep: "Felhasználó" },
];

function populateTable(data) {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    if (!data || data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="3">Nincs adat</td></tr>`;
        return;
    }

    data.forEach(item => {
        const tr = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = item.phoneID || "—";
        tr.appendChild(idCell);

        const manufacturerCell = document.createElement("td");
        manufacturerCell.textContent = item.manufacturerName || "—";
        tr.appendChild(manufacturerCell);

        const nameCell = document.createElement("td");
        nameCell.textContent = item.phoneName || "—";
        tr.appendChild(nameCell);

        const actionsCell = document.createElement("td");
        const btnGroup = document.createElement("div");
        btnGroup.className = "btn-group";

        const viewBtn = document.createElement("button");
        viewBtn.textContent = "Megtekintés";
        viewBtn.className = "view-btn";
        viewBtn.onclick = function () {
            localStorage.setItem("selectedPhone", item.phoneID);
            console.log(localStorage.getItem("selectedPhone"));
            window.location.href = "../telefonoldala/telefonoldal.html";
        };

        const editBtn = document.createElement("button");
        editBtn.textContent = "Szerkesztés";
        editBtn.className = "edit-btn";
        editBtn.onclick = function () {
            localStorage.setItem("lastID", item.phoneID);
            console.log(localStorage.getItem("lastID"));
            window.location.href = "../telefonfeltoltes/telefonfeltoltes.html";
        };
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Törlés";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", function () {
            const phoneId = item.phoneID
            console.log("Delete clicked for phone ID:", phoneId);

            DELETEphone(phoneId)
        });

        btnGroup.append(viewBtn, editBtn, deleteBtn);
        actionsCell.appendChild(btnGroup);
        tr.appendChild(actionsCell);

        tableBody.appendChild(tr);
    });
}

document.getElementById("phonesBox").addEventListener("click", () => {
    populateTable(allPhonesData);
});

document.getElementById("usersBox").addEventListener("click", () => {
    populateTable(users);
});

window.onload = loadPhonesFromBackend;