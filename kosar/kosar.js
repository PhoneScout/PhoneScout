// Initialize history: load from storage, or start with Főoldal
let previousPages = JSON.parse(localStorage.getItem("pagesHistory")) || [
    { pageName: "Főoldal", pageURL: "../fooldal/index.html" }
];

function showPagesHistory() {
    let previousPagesPlace = document.getElementById("previousPagesPlace");
    previousPagesPlace.innerHTML = ""; // clear before rendering

    for (let i = 0; i < previousPages.length; i++) {
        // Add the link
        previousPagesPlace.innerHTML += `
        <a href="${previousPages[i].pageURL}" class="pagesHistory"
           onclick="checkPagesHistory('${previousPages[i].pageName}', '${previousPages[i].pageURL}')">
          <div>${previousPages[i].pageName}</div>
        </a>
      `;

        // Add "/" only if it's not the last item
        if (i < previousPages.length - 1) {
            previousPagesPlace.innerHTML += " / ";
        }
    }
}

function checkPagesHistory(name, url) {
    console.log("Clicked:", name, url);

    // Find if page already exists in history
    let pagePlace = previousPages.findIndex(p => p.pageName === name);

    if (pagePlace === -1) {
        // Page not found → add it
        previousPages.push({ pageName: name, pageURL: url });
    } else {
        // Page found → trim future history
        previousPages.splice(pagePlace + 1);
    }

    // Save to storage
    localStorage.setItem("pagesHistory", JSON.stringify(previousPages));

    // Re-render
    showPagesHistory();
}

// Render on load
window.onload = function () {
    showPagesHistory();
};



document.addEventListener("DOMContentLoaded", function () {
    const kosarDiv = document.querySelector(".kosar .col-8");

    // Retrieve the cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || {};

    // Function to check if the cart is empty and update the UI
    function checkEmptyCart() {
        const paymentButton = document.querySelector(".paymentButton");
        if (Object.keys(cart).length === 0 || Object.values(cart).every(quantity => quantity === 0)) {
            kosarDiv.innerHTML = "<p>A kosarad üres.</p>";
            if (paymentButton) paymentButton.style.display = "none";
        } else {
            if (paymentButton) paymentButton.style.display = "block";
        }
    }

    // Ár formázasa
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    function updateTotalPrice(cartPhones) {
        const totalPrice = cartPhones.reduce((sum, phone) => {
            const quantity = cart[phone.phoneID] || 0;
            return sum + phone.phonePrice * quantity;
        }, 0);

        const totalPriceDiv = document.querySelector(".totalPrice");
        if (totalPriceDiv) {
            totalPriceDiv.textContent = `Végösszeg: ${formatPrice(totalPrice)} Ft`;
        } else {
            const newTotalPriceDiv = document.createElement("div");
            newTotalPriceDiv.classList.add("totalPrice");
            newTotalPriceDiv.style.marginBottom = "20px";
            newTotalPriceDiv.style.fontSize = "1.5em";
            newTotalPriceDiv.style.fontWeight = "bold";
            newTotalPriceDiv.textContent = `Végösszeg: ${formatPrice(totalPrice)} Ft`;
            kosarDiv.prepend(newTotalPriceDiv);
        }
    }

    function addPaymentButton() {
        let paymentButton = document.querySelector(".paymentButton");
        if (!paymentButton) {
            paymentButton = document.createElement("button");
            paymentButton.classList.add("paymentButton");
            paymentButton.textContent = "Fizetés";
            kosarDiv.prepend(paymentButton);

            // Modal létrehozása két formmal, egymás mellett
            let modal = document.createElement("div");
            modal.classList.add("paymentModal");
            modal.style.display = "none";
            modal.innerHTML = `
                <div class="modalContent">
                    <span class="closeModal">&times;</span>
                    <h2 class="modalTitle">Fizetés</h2>
                    <div class="formsContainer">
                        <form id="paymentForm" class="modalForm">
                            <h4>Bankkártya adatok</h4>
                            <label>Kártyaszám:</label>
                            <input type="text" id="cardNumber" maxlength="19" required placeholder="1234 5678 9012 3456">
                            <div class="invalid-feedback"></div>
                            <label>Lejárat:</label>
                            <input type="text" id="expiry" maxlength="5" required placeholder="MM/YY">
                            <div class="invalid-feedback"></div>
                            <label>CVC:</label>
                            <input type="text" id="cvc" maxlength="3" required placeholder="123">
                            <div class="invalid-feedback"></div>
                            <label>Kártyán szereplő név:</label>
                            <input type="text" id="cardName" required placeholder="Név">
                            <div class="invalid-feedback"></div>
                        </form>
                        <form id="shippingForm" class="modalForm">
                            <h4>Szállítási adatok</h4>
                            <label>Teljes név:</label>
                            <input type="text" id="fullName" required placeholder="Név">
                            <div class="invalid-feedback"></div>
                            <label>Város:</label>
                            <input type="text" id="city" required placeholder="Város">
                            <div class="invalid-feedback"></div>
                            <label>Irányítószám:</label>
                            <input type="text" id="zip" maxlength="4" required placeholder="1234">
                            <div class="invalid-feedback"></div>
                            <label>Cím:</label>
                            <input type="text" id="address" required placeholder="Utca, házszám">
                            <div class="invalid-feedback"></div>
                            <label>Telefonszám:</label>
                            <input type="text" id="phone" maxlength="11" required placeholder="36301234567">
                            <div class="invalid-feedback"></div>
                        </form>
                    </div>
                    <button id="submitPayment" class="submitPaymentBtn paymentButton">Fizetés leadása</button>
                </div>
            `;
            document.body.appendChild(modal);

            paymentButton.addEventListener("click", () => {
                modal.style.display = "flex";
            });

            modal.querySelector(".closeModal").addEventListener("click", () => {
                modal.style.display = "none";
            });

            window.addEventListener("keydown", function (e) {
                if (e.key === "Escape") {
                    modal.style.display = "none";
                }
            });

            modal.querySelector("#submitPayment").addEventListener("click", function (e) {
                e.preventDefault();

                let valid = true;
                [...modal.querySelectorAll("#paymentForm input, #shippingForm input")].forEach(input => {
                    const feedback = input.nextElementSibling;
                    if (!input.value.trim()) {
                        feedback.textContent = "A mező kitöltése kötelező!";
                        feedback.style.color = "#d32f2f";
                        feedback.style.fontSize = "0.95em";
                        feedback.style.marginTop = "2px";
                        input.classList.add("is-invalid");
                        valid = false;
                    } else {
                        feedback.textContent = "";
                        input.classList.remove("is-invalid");
                    }
                });

                if (!valid) return;

                localStorage.setItem("cart", JSON.stringify({}));
                updateCartCount();

                let successModal = document.createElement("div");
                successModal.className = "payment-success-modal";
                successModal.innerHTML = `
                    <div class="payment-success-content">
                        <h2>Fizetés sikeres!</h2>
                        <p>Köszönjük a vásárlást!</p>
                        <button id="closeSuccessModal" class="submitPaymentBtn paymentButton" style="margin-top:20px;">Bezárás</button>
                    </div>
                `;
                document.body.appendChild(successModal);

                successModal.querySelector("#closeSuccessModal").addEventListener("click", function () {
                    successModal.remove();
                    modal.style.display = "none";
                    location.reload();
                });

                window.addEventListener("keydown", function escHandler(e) {
                    if (e.key === "Escape") {
                        successModal.remove();
                        modal.style.display = "none";
                        window.removeEventListener("keydown", escHandler);
                        location.reload();
                    }
                });

                modal.style.display = "none";
            });
        }
    }

    addPaymentButton();
    checkEmptyCart();

    // Fetch all phone data to match IDs
    fetch("http://localhost:5165/api/GETmainPage")
        .then(response => response.json())
        .then(allPhones => {
            // Filter the phones in the cart with quantity > 0
            const cartPhones = allPhones.filter(phone => cart[phone.phoneID] > 0);

            // Update the total price
            updateTotalPrice(cartPhones);

            // Display the phones in the cart
            cartPhones.forEach(phone => {
                const quantity = cart[phone.phoneID] || 0;
                const phoneRow = document.createElement("div");
                phoneRow.classList.add("phoneRow");
                phoneRow.style.cursor = "pointer"; // mutató kéz

                // Telefonkártya tartalma
                phoneRow.innerHTML = `
                    <div class="phoneImage" style="flex: 1; text-align: center;">
                        <img src="${phone.imageUrl || '../Images/image 3.png'}" alt="${phone.phoneName}" loading="lazy" style="max-width: 80px; max-height: 80px;">
                    </div>
                    <div class="phoneDetails" style="flex: 3; padding-left: 15px;">
                        <h3 style="margin: 0; font-size: 1.2em;">${phone.phoneName}</h3>
                        <p style="margin: 0.2em 0;">RAM: ${phone.ram || '-'}</p>
                        <p style="margin: 0.2em 0;">Tárhely: ${phone.storage || '-'}</p>
                        <p style="margin: 0.2em 0;">Szín: ${phone.color || '-'}</p>
                        <p style="margin: 0.2em 0; color: ${phone.inStock ? 'green' : 'red'};">
                            ${phone.inStock ? 'Raktáron' : 'Nincs raktáron'}
                        </p>
                    </div>
                    <div class="phonePrice" style="flex: 2; text-align: center;">
                        <p style="margin: 0; font-size: 1em;">${formatPrice(phone.phonePrice)} Ft</p>
                    </div>
                    <div class="phoneQuantity" style="flex: 3; text-align: center; display: flex; align-items: center; justify-content: center;">
                        <button class="decreaseQuantity" style="margin-right: 10px;">-</button>
                        <p style="margin: 0; font-size: 1em;">${quantity}</p>
                        <button class="increaseQuantity" style="margin-left: 10px; margin-right: 10px;">+</button>
                        <button class="removeFromCart" style="background-color: red; color: white; border: none; padding: 5px 10px; cursor: pointer;">Eltávolítás a kosárból</button>
                    </div>
                `;

                phoneRow.addEventListener("click", function (event) {
                    if (
                        !event.target.classList.contains("decreaseQuantity") &&
                        !event.target.classList.contains("increaseQuantity") &&
                        !event.target.classList.contains("removeFromCart")
                    ) {
                        localStorage.setItem("selectedPhone", phone.phoneID);
                        window.location.href = "../telefonoldala/telefonoldal.html";
                    }
                });

                kosarDiv.appendChild(phoneRow);



                const decreaseButton = phoneRow.querySelector(".decreaseQuantity");
                const increaseButton = phoneRow.querySelector(".increaseQuantity");
                const removeButton = phoneRow.querySelector(".removeFromCart");
                const quantityDisplay = phoneRow.querySelector(".phoneQuantity p");

                decreaseButton.addEventListener("click", () => {
                    if (cart[phone.phoneID] > 1) {
                        cart[phone.phoneID] -= 1; // Csökkentjük eggyel
                        quantityDisplay.textContent = cart[phone.phoneID]; // Frissítjük a kijelzett mennyiséget
                        localStorage.setItem("cart", JSON.stringify(cart)); // Mentjük a localStorage-ba
                        updateTotalPrice(cartPhones); // Frissítjük az árat
                        checkEmptyCart(); // Ellenőrizzük az ürességet
                    } else if (cart[phone.phoneID] === 1) {
                        delete cart[phone.phoneID]; // Ha már csak 1 volt, töröljük a kosárból
                        phoneRow.remove(); // Eltávolítjuk a DOM-ból
                        localStorage.setItem("cart", JSON.stringify(cart));
                        updateTotalPrice(cartPhones);
                        checkEmptyCart();
                    }
                });

                increaseButton.addEventListener("click", () => {
                    cart[phone.phoneID] += 1; // Increase quantity
                    localStorage.setItem("cart", JSON.stringify(cart)); // Update localStorage
                    quantityDisplay.textContent = cart[phone.phoneID]; // Update displayed quantity
                    updateTotalPrice(cartPhones); // Update total price
                });

                removeButton.addEventListener("click", () => {
                    delete cart[phone.phoneID]; // Remove the item from the cart
                    phoneRow.remove(); // Remove the row from the DOM
                    localStorage.setItem("cart", JSON.stringify(cart)); // Update localStorage
                    updateTotalPrice(cartPhones); // Update total price
                    checkEmptyCart(); // Check if the cart is empty
                });
            });

            // Check again if the cart is empty after filtering
            checkEmptyCart();
        })
        .catch(error => {
            console.error("Error fetching phone data:", error);
            kosarDiv.innerHTML = "<p>Hiba történt a kosár betöltésekor.</p>";
        });
});

document.addEventListener("input", function (e) {
    // Kártyaszám formázás és validálás
    if (e.target.id === "cardNumber") {
        let value = e.target.value.replace(/\D/g, ""); // csak számok
        value = value.slice(0, 16); // max 16 számjegy
        value = value.replace(/(.{4})/g, "$1 ").trim();
        e.target.value = value;
    }
    // CVC csak 3 számjegy
    if (e.target.id === "cvc") {
        let value = e.target.value.replace(/\D/g, "");
        value = value.slice(0, 3);
        e.target.value = value;
    }
    // Lejárat automatikus perjel és csak számok, hónap max 12
    if (e.target.id === "expiry") {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 4) value = value.slice(0, 4);
        if (value.length > 2) {
            let month = value.slice(0, 2);
            if (parseInt(month, 10) > 12) month = "12";
            value = month + "/" + value.slice(2);
        }
        e.target.value = value;
    }
    // Kártyán szereplő név: csak betűk és szóközök
    if (e.target.id === "cardName") {
        let value = e.target.value.replace(/[^A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű\s]/g, "");
        e.target.value = value;
    }
    // Teljes név: csak betűk és szóközök
    if (e.target.id === "fullName") {
        let value = e.target.value.replace(/[^A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű\s]/g, "");
        e.target.value = value;
    }
    // Város: csak betűk és szóközök
    if (e.target.id === "city") {
        let value = e.target.value.replace(/[^A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű\s]/g, "");
        e.target.value = value;
    }
    // Irányítószám: csak számok, max 4 karakter
    if (e.target.id === "zip") {
        let value = e.target.value.replace(/\D/g, "");
        value = value.slice(0, 4);
        e.target.value = value;
    }
    if (e.target.id === "phone") {
        let value = e.target.value.replace(/\D/g, "");
        value = value.slice(0, 20);
        e.target.value = value;
    }
});

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
        window.location.href = "./kosar.html";
    }, 1000);
}


// Call showUsername when the page loads
document.addEventListener("DOMContentLoaded", showUsername);


function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    const itemCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
    const cartElement = document.getElementById("cart");
    cartElement.textContent = `${itemCount}`;
}

updateCartCount()

function searchPhonesGET() {
    return fetch(allPhonesURL)
      .then((response) => response.json())
      .then((data) => {
        allPhonesData = data;
        searchPhones()
      })
      .catch((error) => console.error("Hiba a JSON betöltésekor:", error));
  
  
  }
  searchPhonesGET()
  
  function searchPhones() {
    let searchDropdown = document.getElementById("searchDropdown");
    searchDropdown.innerHTML = "";
  
    for (let i = 0; i < allPhonesData.length; i++) {
      searchDropdown.innerHTML += `
        <div class="dropdown-item" onclick="openPhonePage('${allPhonesData[i].phoneID}')">
          ${allPhonesData[i].phoneName}
        </div>
      `;
    }
  }
  
  function openPhonePage(phoneID) {
    console.log("Clicked phone ID:", phoneID);
    localStorage.setItem("selectedPhone", phoneID);
    window.open('../telefonoldala/telefonoldal.html');
  }
  
  function searchBarActive(){
    console.log("alma");
    document.getElementById("searchDropdown").style.pointerEvents = "auto"
  }