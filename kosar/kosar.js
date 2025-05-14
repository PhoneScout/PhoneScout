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

            let paymentFormContainer = document.createElement("div");
            paymentFormContainer.id = "paymentFormContainer";
            paymentFormContainer.innerHTML = `
                <button class="closePaymentForm" title="Bezárás">&times;</button>
                <form id="paymentForm">
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
                    <button type="submit" style="background:#007bff;color:#fff;border:none;border-radius:4px;padding:8px 16px;cursor:pointer;width:100%;font-weight:600;">Fizetés megerősítése</button>
                </form>
            `;
            paymentFormContainer.style.display = "none";
            paymentButton.insertAdjacentElement("afterend", paymentFormContainer);

            paymentFormContainer.classList.remove("open");
            paymentFormContainer.style.display = "block"; // Mindig a DOM-ban van

            paymentButton.addEventListener("click", () => {
                if (paymentFormContainer.classList.contains("open")) {
                    paymentFormContainer.classList.remove("open");
                } else {
                    paymentFormContainer.classList.add("open");
                }
            });

            paymentFormContainer.querySelector(".closePaymentForm").onclick = function() {
                paymentFormContainer.classList.remove("open");
            };

            paymentFormContainer.querySelector("#paymentForm").onsubmit = function(e) {
                e.preventDefault();

                // Hibák törlése
                document.getElementById("cardNameError").textContent = "";
                document.getElementById("cardNumberError").textContent = "";
                document.getElementById("expiryError").textContent = "";
                document.getElementById("cvcError").textContent = "";

                let hasError = false;

                // Kártyaszám validálás (pontosan 16 számjegy)
                const cardNumber = document.getElementById("cardNumber").value.replace(/\s/g, "");
                if (cardNumber.length !== 16) {
                    document.getElementById("cardNumberError").textContent = "A bankkártyaszámnak pontosan 16 számjegyből kell állnia!";
                    hasError = true;
                }

                // CVC validálás (pontosan 3 számjegy)
                const cvc = document.getElementById("cvc").value;
                if (cvc.length !== 3) {
                    document.getElementById("cvcError").textContent = "A CVC-nek pontosan 3 számjegyből kell állnia!";
                    hasError = true;
                }

                // Lejárat validálás (formátum: HH/ÉÉ)
                const expiry = document.getElementById("expiry").value;
                if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
                    document.getElementById("expiryError").textContent = "A lejárat formátuma helytelen (HH/ÉÉ)!";
                    hasError = true;
                }

                // Név validálás (nem lehet üres)
                const cardName = document.getElementById("cardName").value.trim();
                if (cardName.length === 0) {
                    document.getElementById("cardNameError").textContent = "A név megadása kötelező!";
                    hasError = true;
                }

                if (hasError) return;

                // Ha minden oké, mehet tovább a fizetés
                paymentFormContainer.classList.remove("open");
                localStorage.removeItem("cart");
                cart = {};
                kosarDiv.innerHTML = "<p>A kosarad üres.</p>";
                const paymentButton = document.querySelector(".paymentButton");
                if (paymentButton) paymentButton.style.display = "none";

                const modal = document.createElement("div");
                modal.className = "payment-success-modal";

                // IP-cím lekérése és megjelenítése
                fetch("https://api.ipify.org?format=json")
                    .then(res => res.json())
                    .then(data => {
                        modal.innerHTML = `
                            <div class="payment-success-content">
                                Köszönjük a vásárlást, az összes pénzed elloptuk!<br> Ezt jól beszoptad!<br> Ja, és az IP címed is elloptuk és publikussá tettük:
                                <span style="font-size:0.95em;color:#555;"><b>${data.ip}</b></span><br>
                                <button style="margin-top:18px;padding:8px 24px;border:none;border-radius:6px;background:#007bff;color:#fff;cursor:pointer;font-size:1em;">OK</button>
                            </div>
                        `;
                        modal.querySelector("button").onclick = () => modal.remove();
                        modal.onclick = e => { if (e.target === modal) modal.remove(); };
                    });

                document.body.appendChild(modal);
            };
        }
    }

    addPaymentButton();
    checkEmptyCart();

    // Fetch all phone data to match IDs
    fetch("http://localhost:5287/api/getMainPhones")
        .then(response => response.json())
        .then(allPhones => {
            // Filter the phones in the cart with quantity > 0
            const cartPhones = allPhones.filter(phone => cart[phone.phoneID] > 0);

            // Update the total price
            updateTotalPrice(cartPhones);

            // Display the phones in the cart
            cartPhones.forEach(phone => {
                const quantity = cart[phone.phoneID]; // Get the quantity from the cart

                const phoneRow = document.createElement("div");
                phoneRow.classList.add("phoneRow");
                phoneRow.style.display = "flex";
                phoneRow.style.alignItems = "center";
                phoneRow.style.marginBottom = "15px";
                phoneRow.style.borderBottom = "1px solid #ccc";
                phoneRow.style.paddingBottom = "10px";

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

                kosarDiv.appendChild(phoneRow);

                phoneRow.onclick = function () {
                    localStorage.setItem("selectedPhone", phone.phoneID);
                    console.log(localStorage.getItem("selectedPhone")); // This is fine for debugging.
                    window.location.href = "../telefonoldala/telefonoldal.html"; // This will load the new page.
                };
        

                // Add event listeners for the +, -, and remove buttons
                const decreaseButton = phoneRow.querySelector(".decreaseQuantity");
                const increaseButton = phoneRow.querySelector(".increaseQuantity");
                const removeButton = phoneRow.querySelector(".removeFromCart");
                const quantityDisplay = phoneRow.querySelector(".phoneQuantity p");

                decreaseButton.addEventListener("click", () => {
                    if (cart[phone.phoneID] > 1) {
                        cart[phone.phoneID] -= 1; // Decrease quantity
                    } else {
                        delete cart[phone.phoneID]; // Remove item if quantity is 0
                        phoneRow.remove(); // Remove the row from the DOM
                    }
                    localStorage.setItem("cart", JSON.stringify(cart)); // Update localStorage
                    quantityDisplay.textContent = cart[phone.phoneID] || 0; // Update displayed quantity
                    updateTotalPrice(cartPhones); // Update total price
                    checkEmptyCart(); // Check if the cart is empty
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
        // 4-esével szóköz
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
});

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