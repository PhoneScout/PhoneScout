const apiUrl = "http://localhost:5287/api/auth";
const allPhonesURL = "http://localhost:5165/api/GETmainPage"; //ÚJ BACKEND
//const allPhonesURL = "http://localhost:5287/api/Phone"; // RÉGI BACKEND


let currentPage = 0;
let phonesPerPage = 4;

let allPhonesData = [];

let previousPages = [
    {link:"",pageName:"alma"},
    {link:"",pageName:"körte"},
    {link:"",pageName:"barack"}
]
console.log(previousPages[0].pageName);

function showPreviousPages(){
    let place = document.getElementById("previousPagesPlace")
    
    for (let i = 0; i < previousPages.length; i++) {
        place.innerHTML += `<a href="${previousPages[i].link}"><div>${previousPages[i].pageName}</div></a>` + "/"
        }
}
showPreviousPages()



let kosar = [];

function displayPhoneCards() {
    const contentRow = document.getElementById("contentRow");
    contentRow.innerHTML = '';

    const startIndex = currentPage * phonesPerPage;
    const endIndex = startIndex + phonesPerPage;

    allPhonesData.slice(startIndex, endIndex).forEach((phone) => {
        const phoneRow = document.createElement("div");
        phoneRow.classList.add("phoneRow");

        phoneRow.onclick = function () {
            localStorage.setItem("selectedPhone", phone.phoneID);
            window.location.href = "./telefonoldala/telefonoldal.html";
        };

        const phoneImage = document.createElement("div");
        phoneImage.classList.add("phoneImage");
        phoneImage.innerHTML = `
            <img src="${phone.imageUrl || './Images/image 3.png'}" alt="${phone.phoneName}" loading="lazy">
            <div class="stock-bubble ${phone.phoneInStore === "van" ? "phonestockTrue" : "phonestockFalse"}">
                ${phone.phoneInStore === "van" ? "Raktáron" : "Nincs raktáron"}
            </div>
            <div class="price-bubble">${phone.phonePrice} Ft</div>
        `;

        const phoneName = document.createElement("div");
        phoneName.classList.add("phoneDetails");
        phoneName.innerHTML = `
            <h3 style="margin: 0; font-size: 1.2em;">${phone.phoneName}</h3>
        `;

        const phonePrice = document.createElement("div");
        phonePrice.classList.add("phonePrice");
        phonePrice.textContent = `${phone.phonePrice} Ft`;


        const cardButtons = document.createElement("div");
        cardButtons.classList.add("cardButtons");

        const compareButton = document.createElement("div");
        compareButton.classList.add("button");
        const compareImg = document.createElement("img");
        compareImg.src = "./Images/compare-removebg-preview 1.png";
        compareImg.loading = "lazy";
        compareButton.appendChild(compareImg);

        compareButton.onclick = function (event) {
            event.stopPropagation();
            let comparePhones = JSON.parse(localStorage.getItem("comparePhones") || "[]");
            if (!comparePhones.includes(phone.phoneID)) {
                comparePhones.push(phone.phoneID);
                localStorage.setItem("comparePhones", JSON.stringify(comparePhones));
            }
        };

        const cartButton = document.createElement("div");
        cartButton.classList.add("button");
        const cartImg = document.createElement("img");
        cartImg.src = "./Images/cart-removebg-preview 1.png";
        cartImg.loading = "lazy";
        cartButton.appendChild(cartImg);

        cartButton.onclick = function (event) {
            event.stopPropagation();
            let cart = JSON.parse(localStorage.getItem("cart")) || {};
            cart[phone.phoneID] = (cart[phone.phoneID] || 0) + 1;
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();

            const cartIcon = document.getElementById("cart");
            const buttonRect = cartButton.getBoundingClientRect();
            const cartRect = cartIcon.getBoundingClientRect();

            const animDot = document.createElement("div");
            animDot.style.position = "fixed";
            animDot.style.left = (buttonRect.left + buttonRect.width / 2) + "px";
            animDot.style.top = (buttonRect.top + buttonRect.height / 2) + "px";
            animDot.style.width = "16px";
            animDot.style.height = "16px";
            animDot.style.background = "#68F145";
            animDot.style.borderRadius = "50%";
            animDot.style.zIndex = "9999";
            animDot.style.pointerEvents = "none";
            animDot.style.transition = "all 2s cubic-bezier(.4,2,.6,1)";
            document.body.appendChild(animDot);

            setTimeout(() => {
                const cartCenterX = cartRect.left + (cartRect.width / 2);
                const cartCenterY = cartRect.top + (cartRect.height / 2);

                animDot.style.left = (cartCenterX - animDot.offsetWidth / 2) + "px";
                animDot.style.top = (cartCenterY - animDot.offsetHeight / 2) + "px";
                animDot.style.opacity = "0.2";
                animDot.style.transform = "scale(0.5)";
            }, 10);

            setTimeout(() => {
                animDot.style.transition = "all 0.5s cubic-bezier(.4,2,.6,1)";
                animDot.style.transform = "scale(10)";
                animDot.style.opacity = "0";
            }, 450);

            setTimeout(() => {
                animDot.remove();
            }, 1010);
        };

        cardButtons.appendChild(compareButton);
        cardButtons.appendChild(cartButton);

        phoneRow.appendChild(phoneImage);
        phoneRow.appendChild(phoneName);
        phoneRow.appendChild(cardButtons);

        contentRow.appendChild(phoneRow);
    });
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    const itemCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
    const cartElement = document.getElementById("cart");
    cartElement.textContent = `${itemCount}`;
}


function getPhoneDatas() {
    return fetch(allPhonesURL)
        .then(response => response.json())
        .then(data => {
            allPhonesData = data;
            console.log(allPhonesData);
            displayPhoneCards();
            updateCarouselIndicator();
            updateCartCount();
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

function updateCarouselButtons() {
    const rightButton = document.getElementById("carouselButtonRight");

    if (currentPage === 1) {
        rightButton.style.display = "none";
    } else {
        rightButton.style.display = "inline-block";
    }
}

function updateCarouselButtons1() {
    const rightButton = document.getElementById("carouselButtonLeft");

   // Bal gomb megjelenítése csak ha currentPage > 0
   if (currentPage > 0) {
    leftButtonContainer.innerHTML = `
        <button onclick="changeCarousel(-1)" id="carouselButtonLeft" class="carouselButton">
            <i class="fa-solid fa-arrow-left"></i>
        </button>
    `;
} else {
    leftButtonContainer.innerHTML = ""; // törli a bal gombot, ha az első oldalon vagy
}
}


function changeCarousel(direction) {
    const maxPages = Math.ceil(allPhonesData.length / phonesPerPage) - 1;
    currentPage = Math.max(0, Math.min(currentPage + direction, maxPages));

    displayPhoneCards();
    updateCarouselIndicator();
    updateCarouselButtons();
    updateCarouselButtons1();
}


function updateCarouselIndicator() {
    const indicator = document.getElementById("carouselIndicator");
    const totalPages = Math.ceil(allPhonesData.length / phonesPerPage);

    if (totalPages > 0) {
        indicator.textContent = `Oldal: ${currentPage + 1} / ${totalPages}`;
    } else {
        indicator.textContent = `Oldal: 0 / 0`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const contentRow = document.getElementById("contentRow");

    const indicator = document.createElement("div");
    indicator.id = "carouselIndicator";
    indicator.style.textAlign = "center";
    indicator.style.marginTop = "10px";
    indicator.style.fontSize = "1.2em";
    indicator.style.fontWeight = "bold";

    contentRow.parentElement.appendChild(indicator);
    updateCarouselIndicator();
});

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
        window.location.href = "./index.html";
    }, 1000);
}



// Call showUsername when the page loads
document.addEventListener("DOMContentLoaded", showUsername);