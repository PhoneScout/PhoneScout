const apiUrl = "http://localhost:5287/api/auth";
const allPhonesURL = "http://localhost:5287/api/allPhones"; //ÚJ BACKEND
//const allPhonesURL = "http://localhost:5287/api/Phone"; // RÉGI BACKEND

console.log("telefonoldala")

let currentPage = 0;
let phonesPerPage = 5;
let allPhonesData = [];

let kosar = [];

async function showUsername() {
    const firstname = localStorage.getItem("firstname");
    const jogosultsag = localStorage.getItem("jogosultsag");

    console.log(firstname)
    if (firstname) {
        // Bejelentkezett felhasználó esetén
        document.getElementById("firstName").innerText = firstname;
        document.getElementById("dropdownMenu").style.display = 'block';
        document.getElementById("loginText").style.display = 'none';
    } else {
        // Ha nincs bejelentkezve
        document.getElementById("dropdownMenu").style.display = 'none';
        document.getElementById("loginText").style.display = 'block';
    }
}

function logout() {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("firstname");
    localStorage.removeItem("jogosultsag");
    alert("Sikeres kijelentkezés!");
    setTimeout(() => {
        window.location.href = "./index.html";
    }, 1000);
}

document.querySelector('.moreInfoAboutPhone').addEventListener('click', function () {
    // Kiválasztjuk a táblázat első sorát (az első <tr> elemet)
    const firstRow = document.querySelector('table tr');
    
    // Görgetünk az első sorhoz
    if (firstRow) {
        firstRow.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});


// Call showUsername when the page loads
document.addEventListener("DOMContentLoaded", showUsername);