const apiUrl = "http://localhost:5287/api/auth";
//const allPhonesURL = "http://localhost:5287/api/allPhones"; //ÚJ BACKEND
const allPhonesURL = "http://localhost:5287/api/Phone"; // RÉGI BACKEND


let currentPage = 0;
let phonesPerPage = 5;
let allPhonesData = [];

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
            localStorage.setItem("selectedPhone", phone.id);
            console.log(localStorage.getItem("selectedPhone")); // This is fine for debugging.
            window.location.href = "./telefonoldala/index.html"; // This will load the new page.
        };


        phoneCard.style.gridColumn = `${2 + index * 2} / span 2`;

        const phoneImage = document.createElement("img");
        phoneImage.classList.add("phoneImage");
        phoneImage.src = phone.imageUrl || "./Images/image 3.png";
        phoneImage.loading = "lazy"

        const phoneName = document.createElement("div");
        phoneName.classList.add("phoneName");
        phoneName.textContent = phone.name;

        // Dinamikusan csökkentjük a betűméretet, ha túl hosszú a név
        if (phoneName.textContent.length > 20) {
            phoneName.style.fontSize = "150%"; // Csökkentett betűméret
        }

        const phonePrice = document.createElement("div");
        phonePrice.classList.add("phonePrice");
        phonePrice.textContent = `${phone.price} Ft`;

        const phoneStock = document.createElement("div");
        phoneStock.classList.add("phoneStock");
        phoneStock.textContent = phone.inStore === "van" ? "Raktáron" : "Nincs Raktáron";

        const cardButtons = document.createElement("div");
        cardButtons.classList.add("cardButtons");

        const compareButton = document.createElement("div");
        compareButton.classList.add("button");
        const compareImg = document.createElement("img");
        compareImg.src = "./Images/compare-removebg-preview 1.png";
        compareImg.loading = "lazy"
        compareButton.appendChild(compareImg);

        const cartButton = document.createElement("div");
        cartButton.classList.add("button");
        const cartImg = document.createElement("img");
        cartImg.src = "./Images/cart-removebg-preview 1.png";
        cartImg.loading = "lazy"
        cartButton.appendChild(cartImg);

        cardButtons.appendChild(compareButton);
        cardButtons.appendChild(cartButton);

        if (phone.inStore=="van") {
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

function getPhoneDatas() {
    return fetch(allPhonesURL)
        .then(response => response.json())
        .then(data => {
            allPhonesData = data;
            console.log(allPhonesData)
            displayPhoneCards();
        })
        .catch(error => console.error('Hiba a JSON betöltésekor:', error));
}
getPhoneDatas();

function telDataShow(allPhonesData) {
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

window.onload = function () {
    // Get the current page path
    let currentPage = window.location.pathname;

    // Check if the page is 'telefonoldala/index.html'
    if (currentPage.includes("telefonoldala/index.html")) {
        fetch(allPhonesURL)
            .then(response => response.json())
            .then(data => {
                telDataShow(data);
            })
            .catch(error => console.error("Error loading phone data:", error));
    }
};



// A carousel váltása
function changeCarousel(direction) {
    const maxPages = Math.ceil(allPhonesData.length / phonesPerPage) - 1;
    currentPage = Math.max(0, Math.min(currentPage + direction, maxPages)); 
    displayPhoneCards();
}


function dateTest() {
    let date = document.getElementById("dateInput").value;
    console.log(date)
}


function postPhone() { //RÉGI BACKEND
    console.log("Telefonfeltöltés")

    let phoneName = document.getElementById("name").value;
    let phonePrice = document.getElementById("price").value;
    let phoneInStoreCheck = document.getElementById("inStore").checked;
    let phoneInStore = "nincs"
    let phoneReleaseDate = document.getElementById("dateInput").value;

    if (phoneInStoreCheck) {
        phoneInStore = "van"
    }
    if (phoneReleaseDate == "") {
        phoneReleaseDate = null
    }


    fetch(`${allPhonesURL}/phonePost`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: phoneName, price: phonePrice, inStore: phoneInStore, releaseDate: phoneReleaseDate })
    })
        .then(response => response.text())
        .then(data => {
            alert(data);
        })
        .catch(error => console.error("Error:", error));
    ;

    setTimeout(() => {
        window.location.href = "../index.html";
    }, 1000);
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



//Bejelentkezés


async function register() {
    const username = document.getElementById("registerUsername").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    try {
        const response = await fetch(`${apiUrl}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.text();

        if (response.ok) {
            document.getElementById("alertReg").innerText = `Registration successful! You can now log in with your username.`;
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);
        } else {
            document.getElementById("alertReg").innerText = `Registration failed: ${data}`;
        }

    } catch (error) {
        console.error("Registration error:", error);
        document.getElementById("alertReg").innerText = "An error occurred during registration.";
    }
}


async function login() {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch(`${apiUrl}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.token) {
            localStorage.setItem("jwtToken", data.token);
            localStorage.setItem("username", username);
            document.getElementById("alertLog").innerText = `Login successful! Welcome ${username}`;


            setTimeout(() => {
                window.location.href = "../index.html";
                
            }, 1000);
        } else {
            document.getElementById("alertLog").innerText = "Login failed.";
        }
    } catch (error) {
        console.error("Login error:", error);
        document.getElementById("alertLog").innerText = "An error occurred.";
    }
}




async function accessProtectedResource() {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
        document.getElementById("response").innerText = "Please log in first.";
        return;
    }

    const response = await fetch(`${apiUrl}/protected-resource`, {
        method: "GET",
        headers: { "Authorization": "Bearer " + token }
    });

    const data = await response.text();
    document.getElementById("response").innerText = data;
}


function logout() {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");
    alert("Logged out successfully!");
    setTimeout(() => {
        window.location.href = "index.html"; // Redirect back
    }, 1000);
}



async function showUsername() {
    const username = localStorage.getItem("username");
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
}

// Call showUsername when the page loads
document.addEventListener("DOMContentLoaded", showUsername);


//ÚJ TELEFONFELTÖLTÉS

function NewPostPhone(allPhonesData){
    console.log("NEW")
    let phonename = document.getElementById("PhoneName").value




}

/*function postPhone() { //RÉGI BACKEND
    console.log("Telefonfeltöltés")

    let phoneName = document.getElementById("name").value;
    let phonePrice = document.getElementById("price").value;
    let phoneInStoreCheck = document.getElementById("inStore").checked;
    let phoneInStore = "nincs"
    let phoneReleaseDate = document.getElementById("dateInput").value;

    if (phoneInStoreCheck) {
        phoneInStore = "van"
    }
    if (phoneReleaseDate == "") {
        phoneReleaseDate = null
    }


    fetch(`${allPhonesURL}/phonePost`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: phoneName, price: phonePrice, inStore: phoneInStore, releaseDate: phoneReleaseDate })
    })
        .then(response => response.text())
        .then(data => {
            alert(data);
        })
        .catch(error => console.error("Error:", error));
    ;

    setTimeout(() => {
        window.location.href = "../index.html";
    }, 1000);
}
*/
















//ezek kellenek majd még :

/*
function updateButtonSizes(activeButtonId) {
    const newArrivalsBtn = document.getElementById('newArrivalsBtn');
    const popularBtn = document.getElementById('popularBtn');

    if (activeButtonId === 'newArrivalsBtn') {
        newArrivalsBtn.style.transform = 'scale(2)';
        newArrivalsBtn.style.marginRight = '20%';
        newArrivalsBtn.style.color = 'black';
        popularBtn.style.transform = 'scale(1.3)';
        popularBtn.style.marginLeft = '0';
        popularBtn.style.color = 'gray';
    } else if (activeButtonId === 'popularBtn') {
        popularBtn.style.transform = 'scale(2)';
        popularBtn.style.marginLeft = '20%';
        popularBtn.style.color = 'black';
        newArrivalsBtn.style.transform = 'scale(1.3)';
        newArrivalsBtn.style.marginRight = '0';
        newArrivalsBtn.style.color = 'gray';
    }
}

document.getElementById('newArrivalsBtn').addEventListener('click', function () {
    document.getElementById('contentRow').innerHTML = newArrivalsContent;
    updateButtonSizes('newArrivalsBtn');
});

document.getElementById('popularBtn').addEventListener('click', function () {
    document.getElementById('contentRow').innerHTML = popularContent;
    updateButtonSizes('popularBtn');
});

document.getElementById('contentRow').innerHTML = newArrivalsContent;
updateButtonSizes('newArrivalsBtn');

*/

document.querySelectorAll('.carouselButton').forEach(button => {
    button.addEventListener('mouseup', function () {
        this.blur();
    });
});

function selectColor(element) {
    document.querySelectorAll('.color-option').forEach(option => {
        option.style.border = '1px solid black'; 
        option.style.boxShadow = 'none';
    });
    element.style.border = '2px solid black'; 
    const color = window.getComputedStyle(element).backgroundColor;
    element.style.boxShadow = `0 0 15px ${color}`;
}

function addSvgHoverEffect(svgId, elementId) {
    const svgObject = document.getElementById(svgId); // Az object elem ID-ja
    
    svgObject.addEventListener("load", function () {
        const svgDoc = svgObject.contentDocument;
        if (!svgDoc) return;
        
        const targetElement = svgDoc.getElementById(elementId);
        if (targetElement) {
            targetElement.addEventListener("mouseenter", function () {
                targetElement.style.fill = "#00FF00"; // Zöld szín
            });
            
            targetElement.addEventListener("mouseleave", function () {
                targetElement.style.fill = ""; // Visszaáll az eredeti színre
            });
        }
    });
}
