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

    function updateTotalPrice(cartPhones) {
        const totalPrice = cartPhones.reduce((sum, phone) => {
            const quantity = cart[phone.phoneID] || 0;
            return sum + phone.phonePrice * quantity;
        }, 0);

        const totalPriceDiv = document.querySelector(".totalPrice");
        if (totalPriceDiv) {
            totalPriceDiv.textContent = `Végösszeg: ${totalPrice} Ft`;
        } else {
            const newTotalPriceDiv = document.createElement("div");
            newTotalPriceDiv.classList.add("totalPrice");
            newTotalPriceDiv.style.marginBottom = "20px";
            newTotalPriceDiv.style.fontSize = "1.5em";
            newTotalPriceDiv.style.fontWeight = "bold";
            newTotalPriceDiv.textContent = `Végösszeg: ${totalPrice} Ft`;
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

            // --- Két form egymás mellett egy wrapperben ---
            let formsWrapper = document.createElement("div");
            formsWrapper.className = "paymentFormsWrapper";
            formsWrapper.style.display = "flex";
            formsWrapper.style.gap = "24px";
            formsWrapper.style.justifyContent = "center";
            formsWrapper.style.marginTop = "16px";

            // --- BANKKÁRTYA ADATOK FORM ---
            let paymentFormContainer = document.createElement("div");
            paymentFormContainer.id = "paymentFormContainer";
            paymentFormContainer.className = "paymentFormBox";
            paymentFormContainer.innerHTML = `
                <button class="closePaymentForm" title="Bezárás" style="float:right;margin-top:-8px;margin-right:-8px;">&times;</button>
                <form id="paymentForm" class="paymentForm">
                    <label for="cardName">Név a kártyán</label>
                    <input type="text" id="cardName" maxlength="40" placeholder="Név a kártyán" required>
                    <span id="cardNameError" style="color: red; font-size: 0.9em;"></span>
                    <label for="cardNumber">Bankkártyaszám</label>
                    <input type="text" id="cardNumber" maxlength="19" placeholder="1234 5678 9012 3456" required>
                    <span id="cardNumberError" style="color: red; font-size: 0.9em;"></span>
                    <label for="expiry">Lejárat (HH/ÉÉ)</label>
                    <input type="text" id="expiry" maxlength="5" placeholder="12/25" required>
                    <span id="expiryError" style="color: red; font-size: 0.9em;"></span>
                    <label for="cvc">CVC</label>
                    <input type="text" id="cvc" maxlength="4" placeholder="123" required>
                    <span id="cvcError" style="color: red; font-size: 0.9em;"></span>
                </form>
            `;

            // --- SZÁLLÍTÁSI ADATOK FORM ---
            let shippingFormContainer = document.createElement("div");
            shippingFormContainer.id = "shippingFormContainer";
            shippingFormContainer.className = "paymentFormBox";
            shippingFormContainer.innerHTML = `
                <form id="shippingForm" class="paymentForm">
                    <label for="fullName">Teljes név</label>
                    <input type="text" id="fullName" maxlength="40" placeholder="Teljes név" required>
                    <span id="fullNameError" style="color: red; font-size: 0.9em;"></span>
                    <label for="address">Szállítási cím</label>
                    <input type="text" id="address" maxlength="80" placeholder="Cím (utca, házszám)" required>
                    <span id="addressError" style="color: red; font-size: 0.9em;"></span>
                    <label for="city">Város</label>
                    <input type="text" id="city" maxlength="40" placeholder="Város" required>
                    <span id="cityError" style="color: red; font-size: 0.9em;"></span>
                    <label for="zip">Irányítószám</label>
                    <input type="text" id="zip" maxlength="10" placeholder="Irányítószám" required>
                    <span id="zipError" style="color: red; font-size: 0.9em;"></span>
                    <label for="phone">Telefonszám</label>
                    <input type="text" id="phone" maxlength="20" placeholder="Telefonszám" required>
                    <span id="phoneError" style="color: red; font-size: 0.9em;"></span>
                    <button type="submit" style="background:#007bff;color:#fff;border:none;border-radius:4px;padding:8px 16px;cursor:pointer;width:100%;font-weight:600;margin-top:10px;">Rendelés leadása</button>
                </form>
            `;

            formsWrapper.appendChild(paymentFormContainer);
            formsWrapper.appendChild(shippingFormContainer);
            paymentButton.insertAdjacentElement("afterend", formsWrapper);

            paymentFormContainer.classList.remove("open");
            shippingFormContainer.classList.remove("open");

            // --- ANIMÁLT LENYITÁS/ÖSSZECSUKÁS ---
            paymentButton.addEventListener("click", () => {
                const open = paymentFormContainer.classList.contains("open");
                if (open) {
                    paymentFormContainer.classList.remove("open");
                    shippingFormContainer.classList.remove("open");
                } else {
                    paymentFormContainer.classList.add("open");
                    shippingFormContainer.classList.add("open");
                }
            });

            paymentFormContainer.querySelector(".closePaymentForm").onclick = function() {
                paymentFormContainer.classList.remove("open");
                shippingFormContainer.classList.remove("open");
            };

            // --- VALIDÁCIÓ ÉS SUBMIT ---
            shippingFormContainer.querySelector("#shippingForm").onsubmit = function(e) {
                e.preventDefault();

                // Hibák törlése
                document.getElementById("fullNameError").textContent = "";
                document.getElementById("addressError").textContent = "";
                document.getElementById("cityError").textContent = "";
                document.getElementById("zipError").textContent = "";
                document.getElementById("phoneError").textContent = "";
                document.getElementById("cardNameError").textContent = "";
                document.getElementById("cardNumberError").textContent = "";
                document.getElementById("expiryError").textContent = "";
                document.getElementById("cvcError").textContent = "";

                let hasError = false;

                // Bankkártya validáció
                const cardNumber = document.getElementById("cardNumber").value.replace(/\s/g, "");
                if (cardNumber.length !== 16) {
                    document.getElementById("cardNumberError").textContent = "A bankkártyaszámnak pontosan 16 számjegyből kell állnia!";
                    hasError = true;
                }
                const cvc = document.getElementById("cvc").value;
                if (cvc.length !== 3) {
                    document.getElementById("cvcError").textContent = "A CVC-nek pontosan 3 számjegyből kell állnia!";
                    hasError = true;
                }
                const expiry = document.getElementById("expiry").value;
                if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
                    document.getElementById("expiryError").textContent = "A lejárat formátuma helytelen (HH/ÉÉ)!";
                    hasError = true;
                }
                const cardName = document.getElementById("cardName").value.trim();
                if (cardName.length === 0) {
                    document.getElementById("cardNameError").textContent = "A név megadása kötelező!";
                    hasError = true;
                }

                // Szállítási adatok validáció
                const fullName = document.getElementById("fullName").value.trim();
                if (fullName.length === 0) {
                    document.getElementById("fullNameError").textContent = "A név megadása kötelező!";
                    hasError = true;
                }
                const address = document.getElementById("address").value.trim();
                if (address.length === 0) {
                    document.getElementById("addressError").textContent = "A cím megadása kötelező!";
                    hasError = true;
                }
                const city = document.getElementById("city").value.trim();
                if (city.length === 0) {
                    document.getElementById("cityError").textContent = "A város megadása kötelező!";
                    hasError = true;
                }
                const zip = document.getElementById("zip").value.trim();
                if (!/^\d{4}$/.test(zip)) {
                    document.getElementById("zipError").textContent = "Az irányítószám 4 számjegy legyen!";
                    hasError = true;
                }
                const phone = document.getElementById("phone").value.trim();
                if (!/^[0-9+\-\s]{7,}$/.test(phone)) {
                    document.getElementById("phoneError").textContent = "Adj meg érvényes telefonszámot!";
                    hasError = true;
                }

                if (hasError) return;

                // Sikeres rendelés
                paymentFormContainer.classList.remove("open");
                shippingFormContainer.classList.remove("open");
                localStorage.removeItem("cart");
                cart = {};
                kosarDiv.innerHTML = "<p>A kosarad üres.</p>";
                const paymentButton = document.querySelector(".paymentButton");
                if (paymentButton) paymentButton.style.display = "none";

                const modal = document.createElement("div");
                modal.className = "payment-success-modal";
                modal.innerHTML = `
                    <div class="payment-success-content">
                        Köszönjük a rendelést!<br>
                        <button style="margin-top:18px;padding:8px 24px;border:none;border-radius:6px;background:#007bff;color:#fff;cursor:pointer;font-size:1em;">OK</button>
                    </div>
                `;
                modal.querySelector("button").onclick = () => modal.remove();
                modal.onclick = e => { if (e.target === modal) modal.remove(); };
                document.body.appendChild(modal);
            };
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
                    </div>
                    <div class="phonePrice" style="flex: 2; text-align: center;">
                        <p style="margin: 0; font-size: 1em;">${phone.phonePrice} Ft</p>
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

document.addEventListener("input", function(e) {
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
    // Telefonszám: csak számok, max 20 karakter
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
    cartElement.textContent = `Kosár(${itemCount})`;
}

updateCartCount()