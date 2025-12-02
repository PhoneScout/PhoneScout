const apiUrl = "http://localhost:5287/api/auth";
const allPhonesURL = "http://localhost:5165/api/GETmainPage";


async function showUsername() {

    const firstname = localStorage.getItem("firstname");
    const jogosultsag = localStorage.getItem("jogosultsag");

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
    if (jogosultsag == 1) {
        document.getElementById("admin").style.display = "block";
        document.getElementById("upload").style.display = "block";
        
    }
}

function logout() {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("firstname");
    localStorage.removeItem("jogosultsag");
    alert("Sikeres kijelentkezés!");
    setTimeout(() => {
        window.location.href = "../navbarteszt/index.html";
    }, 1000);
}

// Call showUsername when the page loads
document.addEventListener("DOMContentLoaded", showUsername);