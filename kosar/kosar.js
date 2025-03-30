document.addEventListener("DOMContentLoaded", function () {
    const kosarDiv = document.querySelector(".kosar .col-8");

    // Retrieve the cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || {};

    // Function to check if the cart is empty and update the UI
    function checkEmptyCart() {
        if (Object.keys(cart).length === 0 || Object.values(cart).every(quantity => quantity === 0)) {
            kosarDiv.innerHTML = "<p>A kosarad üres.</p>";
        }
    }

    // Function to calculate and display the total price
    function updateTotalPrice(cartPhones) {
        const totalPrice = cartPhones.reduce((sum, phone) => {
            const quantity = cart[phone.phoneID] || 0;
            return sum + phone.price * quantity;
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
    checkEmptyCart();

    // Fetch all phone data to match IDs
    fetch("http://localhost:5287/api/allPhones")
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
                        <img src="${phone.imageUrl || '../Images/image 3.png'}" alt="${phone.phoneNev}" loading="lazy" style="max-width: 80px; max-height: 80px;">
                    </div>
                    <div class="phoneDetails" style="flex: 3; padding-left: 15px;">
                        <h3 style="margin: 0; font-size: 1.2em;">${phone.phoneNev}</h3>
                    </div>
                    <div class="phonePrice" style="flex: 2; text-align: center;">
                        <p style="margin: 0; font-size: 1em;">${phone.price} Ft</p>
                    </div>
                    <div class="phoneQuantity" style="flex: 3; text-align: center; display: flex; align-items: center; justify-content: center;">
                        <button class="decreaseQuantity" style="margin-right: 10px;">-</button>
                        <p style="margin: 0; font-size: 1em;">${quantity}</p>
                        <button class="increaseQuantity" style="margin-left: 10px; margin-right: 10px;">+</button>
                        <button class="removeFromCart" style="background-color: red; color: white; border: none; padding: 5px 10px; cursor: pointer;">Eltávolítás a kosárból</button>
                    </div>
                `;

                kosarDiv.appendChild(phoneRow);

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