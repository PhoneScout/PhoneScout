const apiUrl = "http://localhost:5287/api/auth";
const allPhonesURL = "http://localhost:5287/api/getMainPhones"; //ÚJ BACKEND
//const allPhonesURL = "http://localhost:5287/api/Phone"; // RÉGI BACKEND


let currentPage = 0;
let phonesPerPage = 5;
let allPhonesData = [];

let kosar = [];

function displayPhoneCards() {
    const contentRow = document.getElementById("contentRow");
    contentRow.innerHTML = '';

    const startIndex = currentPage * phonesPerPage;
    const endIndex = startIndex + phonesPerPage;

    // Az oldal telefonjainak a megjelenítése
    allPhonesData.slice(startIndex, endIndex).forEach((phone, index) => {
        const phoneCard = document.createElement("div");
        phoneCard.classList.add("phoneCard");

        phoneCard.onclick = function () {
            localStorage.setItem("selectedPhone", phone.phoneID);
            console.log(localStorage.getItem("selectedPhone")); // This is fine for debugging.
            window.location.href = "./telefonoldala/telefonoldal.html"; // This will load the new page.
        };

        phoneCard.style.gridColumn = `${2 + index * 2} / span 2`;

        const phoneImage = document.createElement("img");
        phoneImage.classList.add("phoneImage");
        phoneImage.src = phone.imageUrl || "./Images/image 3.png";
        phoneImage.loading = "lazy";

        const phoneName = document.createElement("div");
        phoneName.classList.add("phoneName");
        phoneName.textContent = phone.phoneName;

        if (phoneName.textContent.length > 8) {
            phoneName.style.whiteSpace = "normal"; // Engedélyezzük a sortörést
            phoneName.style.wordWrap = "break-word"; // Tördeljük a szavakat, ha szükséges
        }
        if (phoneName.textContent.length > 15) {
            phoneName.style.fontSize = "200%";
        }

        const phonePrice = document.createElement("div");
        phonePrice.classList.add("phonePrice");
        phonePrice.textContent = `${phone.phonePrice} Ft`;

        const phoneStock = document.createElement("div");
        phoneStock.classList.add("phoneStock");
        phoneStock.textContent = phone.phoneInStore === "van" ? "Raktáron" : "Nincs Raktáron";

        const cardButtons = document.createElement("div");
        cardButtons.classList.add("cardButtons");

        const compareButton = document.createElement("div");
        compareButton.classList.add("button");
        const compareImg = document.createElement("img");
        compareImg.src = "./Images/compare-removebg-preview 1.png";
        compareImg.loading = "lazy";
        compareButton.appendChild(compareImg);

        compareButton.onclick = function (event) {
            event.stopPropagation(); // Prevent triggering the phoneCard click event
            console.log(`Compare clicked for phone ID: ${phone.phoneID}`);
            // Add your compare logic here
        };

        const cartButton = document.createElement("div");
        cartButton.classList.add("button");
        const cartImg = document.createElement("img");
        cartImg.src = "./Images/cart-removebg-preview 1.png";
        cartImg.loading = "lazy";
        cartButton.appendChild(cartImg);

        cartButton.onclick = function (event) {
            event.stopPropagation(); 
            console.log(`Add to cart clicked for phone ID: ${phone.phoneID}`);
            
            let cart = JSON.parse(localStorage.getItem("cart")) || {};

            cart[phone.phoneID] = (cart[phone.phoneID] || 0) + 1;

            localStorage.setItem("cart", JSON.stringify(cart));

            console.log("Current cart:", cart);

            updateCartCount();
        };

        cardButtons.appendChild(compareButton);
        cardButtons.appendChild(cartButton);

        if (phone.inStore == "van") {
            phoneStock.style.color = "green";
        }

        phoneCard.appendChild(phoneImage);
        phoneCard.appendChild(phoneName);
        phoneCard.appendChild(phonePrice);
        phoneCard.appendChild(phoneStock);
        phoneCard.appendChild(cardButtons);

        contentRow.appendChild(phoneCard);
    });
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    const itemCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
    const cartElement = document.getElementById("cart");
    cartElement.textContent = `Kosár (${itemCount})`;
}

function getPhoneDatas() {
    return fetch(allPhonesURL)
        .then(response => response.json())
        .then(data => {
            allPhonesData = data;
            console.log(allPhonesData)
            displayPhoneCards();
            updateCartCount(); // Ensure cart count is updated on page load
        })
        .catch(error => console.error('Hiba a JSON betöltésekor:', error));
}
getPhoneDatas();

/*function telDataShow(allPhonesData) {
    let dataPlace = document.getElementById("telData");
    let selectedPhoneID = localStorage.getItem("selectedPhone");

    if (!selectedPhoneID) {
        console.error("No selected phone found in localStorage.");
        return;
    }

    let selectedPhone = allPhonesData.find(item => item.id == selectedPhoneID);

    if (selectedPhone) {
        dataPlace.innerHTML = selectedPhone.name;
    } else {
        console.error("No phone found with the given ID.");
    }
}
*/



// A carousel váltása
function changeCarousel(direction) {
    const maxPages = Math.ceil(allPhonesData.length / phonesPerPage) - 1;
    currentPage = Math.max(0, Math.min(currentPage + direction, maxPages));
    displayPhoneCards();
}

//Event Card
function displayEventCard() {
    const contentRow = document.getElementById("contentRow");

    const eventCard = document.createElement("div");
    eventCard.classList.add("eventCard");

    const liveEvent = document.createElement("div");
    liveEvent.classList.add("liveEvent");
    liveEvent.textContent = "Élő esemény";

    const eventName = document.createElement("div");
    eventName.classList.add("eventName");
    eventName.textContent = "Event Name";

    const eventCompanyLogo = document.createElement("img");
    eventCompanyLogo.classList.add("eventCompanyLogo");
    eventCompanyLogo.src = "./Images/XiaomiLogo.png";
    eventCompanyLogo.alt = "Product Image";

    const eventDate = document.createElement("div");
    eventDate.classList.add("eventDate");
    eventDate.textContent = "Dátum: 2025.05.04";

    const eventButton = document.createElement("div");
    eventButton.classList.add("eventButton");
    eventButton.textContent = "Nézd élőben!";

    eventCard.appendChild(liveEvent);
    eventCard.appendChild(eventName);
    eventCard.appendChild(eventCompanyLogo);
    eventCard.appendChild(eventDate);
    eventCard.appendChild(eventButton);

    contentRow.appendChild(eventCard);
}

displayEventCard();

async function showUsername() {
    const username = localStorage.getItem("username");
    const jogosultsag = localStorage.getItem("jogosultsag");

    console.log(username)
    if (username) {
        // Bejelentkezett felhasználó esetén
        document.getElementById("userName").innerText = username;
        document.getElementById("dropdownMenu").style.display = 'block';
        document.getElementById("loginText").style.display = 'none';
    } else {
        // Ha nincs bejelentkezve
        document.getElementById("dropdownMenu").style.display = 'none';
        document.getElementById("loginText").style.display = 'block';
    }
    if (jogosultsag == 1) {
        document.getElementById("admin").style.display = "block";
    }
}

function logout() {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");
    localStorage.removeItem("jogosultsag");
    alert("Sikeres kijelentkezés!");
    setTimeout(() => {
        window.location.href = "../index.html";
    }, 1000);
}


// Call showUsername when the page loads
document.addEventListener("DOMContentLoaded", showUsername);