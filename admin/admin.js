const allPhonesURL = "http://localhost:5165/api/GETmainPage"; //ÚJ BACKEND
const apiUrl = "http://localhost:5287/api/auth";


let allPhonesData = [];


function displayPhoneCards() {
    const contentRow = document.getElementById("contentRow");
    contentRow.innerHTML = '';


    allPhonesData.forEach((phone) => {
        const phoneRow = document.createElement("div");
        phoneRow.classList.add("phoneRow");
        phoneRow.style.display = "flex";
        phoneRow.style.alignItems = "center";
        phoneRow.style.marginBottom = "15px";
        phoneRow.style.borderBottom = "1px solid #ccc";
        phoneRow.style.paddingBottom = "10px";

        phoneRow.onclick = function () {
            localStorage.setItem("selectedPhone", phone.phoneID);
            console.log(localStorage.getItem("selectedPhone"));
            window.location.href = "./telefonoldala/telefonoldal.html";
        };



        const phoneImage = document.createElement("div");
        phoneImage.classList.add("phoneImage");
        phoneImage.style.flex = "1";
        phoneImage.style.textAlign = "center";
        phoneImage.innerHTML = `
            <img src="${phone.imageUrl || './Images/image 3.png'}" alt="${phone.phoneName}" loading="lazy" style="max-width: 80px; max-height: 80px;">
        `;

        const phoneName = document.createElement("div");
        phoneName.classList.add("phoneDetails");
        phoneName.style.flex = "3";
        phoneName.style.paddingLeft = "15px";
        phoneName.innerHTML = `
            <h3 style="margin: 0; font-size: 1.2em;">${phone.phoneName}</h3>
        `;
        
        const phoneStock = document.createElement("div");
        phoneStock.classList.add("phoneStock");
        phoneStock.textContent = phone.phoneInStore === "van" ? "Raktáron" : "Nincs Raktáron";
        phoneStock.style.color = phone.phoneInStore === "van" ? "green" : "red";
        if (phone.phoneInStore === "van") {
            phoneStock.style.marginLeft = "3.5%";
        }

        const cardButtons = document.createElement("div");
        cardButtons.classList.add("cardButtons");
        cardButtons.style.display = "flex";
        cardButtons.style.gap = "10px";
        cardButtons.style.justifyContent = "center";

        const compareButton = document.createElement("div");
        compareButton.classList.add("button");
        const compareImg = document.createElement("img");
        compareImg.src = "./Images/compare-removebg-preview 1.png";
        compareImg.loading = "lazy";
        compareButton.appendChild(compareImg);

        compareButton.onclick = function (event) {
            event.stopPropagation();
            console.log(`Compare clicked for phone ID: ${phone.phoneID}`);
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

        phoneRow.appendChild(phoneImage);
        phoneRow.appendChild(phoneName);
        phoneRow.appendChild(phoneStock);
        phoneRow.appendChild(cardButtons);

        contentRow.appendChild(phoneRow);
    });
}

function getPhoneDatas() {
    return fetch(allPhonesURL)
        .then(response => response.json())
        .then(data => {
            allPhonesData = data;
            console.log(allPhonesData);
            displayPhoneCards();
        })
        .catch(error => console.error('Hiba a JSON betöltésekor:', error));
}
getPhoneDatas();