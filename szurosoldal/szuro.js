    const apiUrl = "http://localhost:5287/api/auth";
        const allPhonesURL = "http://localhost:5165/api/GETmainPage";
        const allPhoneNameURL = "http://localhost:5165/api/GETphoneNames";
        const filterApiUrl = "http://localhost:5165/api/FilterPhone/filterPhone";

        let allPhonesData = [];
        let allPhoneName = [];
        let filteredPhones = [];
        localStorage.removeItem("pagesHistory");

        let previousPages = [
            { pageName: "Főoldal", pageURL: "../fooldal/index.html" }
        ];

        function showPagesHistory() {
            let previousPagesPlace = document.getElementById("previousPagesPlace");
            previousPagesPlace.innerHTML = "";

            for (let i = 0; i < previousPages.length; i++) {
                previousPagesPlace.innerHTML += `
                    <a href="${previousPages[i].pageURL}" class="pagesHistory"
                       onclick="checkPagesHistory('${previousPages[i].pageName}', '${previousPages[i].pageURL}')">
                      <div>${previousPages[i].pageName}</div>
                    </a>
                `;

                if (i < previousPages.length - 1) {
                    previousPagesPlace.innerHTML += " / ";
                }
            }
        }

        function checkPagesHistory(name, url) {
            console.log("Clicked:", name, url);

            let pagePlace = previousPages.findIndex(p => p.pageName === name);

            if (pagePlace === -1) {
                previousPages.push({ pageName: name, pageURL: url });
            } else {
                previousPages.splice(pagePlace + 1);
            }

            localStorage.setItem("pagesHistory", JSON.stringify(previousPages));
            showPagesHistory();
        }

        // Render on load
        window.onload = function () {
            showPagesHistory();
            getPhoneDatas();
            showUsername();
        };

        let kosar = [];

        function updateCompareCount() {
            const comparePhones = JSON.parse(localStorage.getItem("comparePhones")) || [];
            const compareElement = document.getElementById("compareCount");
            compareElement.textContent = `(${comparePhones.length})`;
        }

        function displayPhoneCards(phones = filteredPhones) {
            const contentRow = document.getElementById("contentRow");
            contentRow.innerHTML = "";

            if (!phones || phones.length === 0) {
                contentRow.innerHTML = `
                    <div class="col-12 text-center">
                        <h3>Nincs találat a megadott szűrési feltételek alapján</h3>
                        <p>Próbálj meg más szűrőket használni</p>
                    </div>
                `;
                return;
            }

            phones.forEach((phone) => {
                const phoneRow = document.createElement("div");
                phoneRow.classList.add("phoneRow");

                phoneRow.onclick = function () {
                    checkPagesHistory(`${phone.phoneName}`, `../telefonoldala/telefonoldal.html`);
                    localStorage.setItem("selectedPhone", phone.phoneID);
                    window.location.href = "../telefonoldala/telefonoldal.html";
                };

                const phoneImage = document.createElement("div");
                phoneImage.classList.add("phoneImage");
                phoneImage.innerHTML = `
                    <img src="${phone.imageUrl || "../Images/image 3.png"}" alt="${phone.phoneName}" loading="lazy">
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
                compareImg.src = "../Images/compare-removebg-preview 1.png";
                compareImg.loading = "lazy";
                compareButton.appendChild(compareImg);

                compareButton.onclick = function (event) {
                    event.stopPropagation();
                    let comparePhones = JSON.parse(localStorage.getItem("comparePhones") || "[]");
                    if (!comparePhones.includes(phone.phoneID)) {
                        comparePhones.push(phone.phoneID);
                        localStorage.setItem("comparePhones", JSON.stringify(comparePhones));
                        updateCompareCount();
                    }
                };

                const cartButton = document.createElement("div");
                cartButton.classList.add("button");
                const cartImg = document.createElement("img");
                cartImg.src = "../Images/cart-removebg-preview 1.png";
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
                    animDot.style.left = buttonRect.left + buttonRect.width / 2 + "px";
                    animDot.style.top = buttonRect.top + buttonRect.height / 2 + "px";
                    animDot.style.width = "16px";
                    animDot.style.height = "16px";
                    animDot.style.background = "#68F145";
                    animDot.style.borderRadius = "50%";
                    animDot.style.zIndex = "9999";
                    animDot.style.pointerEvents = "none";
                    animDot.style.transition = "all 2s cubic-bezier(.4,2,.6,1)";
                    document.body.appendChild(animDot);

                    setTimeout(() => {
                        const cartCenterX = cartRect.left + cartRect.width / 2;
                        const cartCenterY = cartRect.top + cartRect.height / 2;

                        animDot.style.left = cartCenterX - animDot.offsetWidth / 2 + "px";
                        animDot.style.top = cartCenterY - animDot.offsetHeight / 2 + "px";
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

                compareButton.onclick = function (event) {
                    event.stopPropagation();

                    let comparePhones = JSON.parse(localStorage.getItem("comparePhones") || "[]");
                    if (!comparePhones.includes(phone.phoneID)) {
                        comparePhones.push(phone.phoneID);
                        localStorage.setItem("comparePhones", JSON.stringify(comparePhones));
                        updateCompareCount();
                    }

                    if (comparePhones.includes(phone.phoneID)) {
                        compareButton.style.cursor = "not-allowed";
                        compareButton.style.backgroundColor = "#1f6e0b";
                        compareButton.onclick = null;
                    }

                    const compareIcon = document.getElementById("osszehasonlitas");
                    const buttonRect = compareButton.getBoundingClientRect();
                    const compareRect = compareIcon.getBoundingClientRect();

                    const animDot = document.createElement("div");
                    animDot.style.position = "fixed";
                    animDot.style.left = buttonRect.left + buttonRect.width / 2 + "px";
                    animDot.style.top = buttonRect.top + buttonRect.height / 2 + "px";
                    animDot.style.width = "16px";
                    animDot.style.height = "16px";
                    animDot.style.background = "#68F145";
                    animDot.style.borderRadius = "50%";
                    animDot.style.zIndex = "9999";
                    animDot.style.pointerEvents = "none";
                    animDot.style.transition = "all 2s cubic-bezier(.4,2,.6,1)";
                    document.body.appendChild(animDot);

                    setTimeout(() => {
                        const compareCenterX = compareRect.left + compareRect.width / 2;
                        const compareCenterY = compareRect.top + compareRect.height / 2;

                        animDot.style.left = compareCenterX - animDot.offsetWidth / 2 + "px";
                        animDot.style.top = compareCenterY - animDot.offsetHeight / 2 + "px";
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
                .then((response) => response.json())
                .then((data) => {
                    allPhonesData = data;
                    filteredPhones = data;
                    displayPhoneCards();
                    updateCartCount();
                    updateCompareCount();
                })
                .catch((error) => console.error("Hiba a JSON betöltésekor:", error));
        }

        function searchPhonesGET() {
            return fetch(allPhoneNameURL)
                .then((response) => response.json())
                .then((data) => {
                    allPhoneName = data;
                    searchPhones();
                })
                .catch((error) => console.error("Hiba a JSON betöltésekor:", error));
        }

        function searchPhones() {
            let searchDropdown = document.getElementById("searchDropdown");
            searchDropdown.innerHTML = "";

            for (let i = 0; i < allPhoneName.length; i++) {
                searchDropdown.innerHTML += `
                    <div class="dropdown-item" onclick="openPhonePage('${allPhoneName[i].phoneID}')">
                        ${allPhoneName[i].phoneName}
                    </div>
                `;
            }
        }

        function openPhonePage(phoneID) {
            console.log("Clicked phone ID:", phoneID);
            localStorage.setItem("selectedPhone", phoneID);
            window.open('../telefonoldala/telefonoldal.html');
        }

        function searchBarActive() {
            console.log("alma");
            document.getElementById("searchDropdown").style.pointerEvents = "auto";
        }

        document.addEventListener("DOMContentLoaded", () => {
            const contentRow = document.getElementById("contentRow");

            const indicator = document.createElement("div");
            indicator.style.textAlign = "center";
            indicator.style.marginTop = "10px";
            indicator.style.fontSize = "1.2em";
            indicator.style.fontWeight = "bold";

            contentRow.parentElement.appendChild(indicator);
            updateCompareCount();
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

        async function showUsername() {
            const firstname = localStorage.getItem("firstname");
            const jogosultsag = localStorage.getItem("jogosultsag");

            console.log(firstname);
            if (firstname) {
                document.getElementById("firstName").innerText = firstname;
                document.getElementById("dropdownMenu").style.display = "block";
                document.getElementById("loginText").style.display = "none";
            } else {
                document.getElementById("dropdownMenu").style.display = "none";
                document.getElementById("loginText").style.display = "block";
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

        const searchBox = document.getElementById("searchBox");
        const dropdown = document.getElementById("searchDropdown");

        searchBox.addEventListener("focus", () => {
            dropdown.classList.add("active");
        });

        searchBox.addEventListener("blur", () => {
            setTimeout(() => {
                dropdown.classList.remove("active");
            }, 50);
        });

        searchBox.addEventListener("input", () => {
            const filter = searchBox.value.toLowerCase();
            const items = dropdown.querySelectorAll(".dropdown-item");
            items.forEach((item) => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(filter) ? "block" : "none";
            });
        });

        async function applyFilters() {
            const filters = {
                phoneID: 0,
                manufacturerName: document.getElementById("manufacturerName").value || "",
                phoneName: "",
                phoneReleaseDate: "",
                cpuName: document.getElementById("cpuName").value || "",
                phoneAntutu: parseInt(document.getElementById("phoneAntutu").value) || 0,
                cpuMaxClockSpeed: parseFloat(document.getElementById("cpuMaxClockSpeed").value) || 0,
                cpuCoreNumber: parseInt(document.getElementById("cpuCoreNumber").value) || 0,
                screenSizeMin: parseFloat(document.getElementById("screenSizeMin").value) || 0,
                screenSizeMax: parseFloat(document.getElementById("screenSizeMax").value) || 0,
                screenRefreshRateMin: parseInt(document.getElementById("screenRefreshRateMin").value) || 0,
                screenRefreshRateMax: parseInt(document.getElementById("screenRefreshRateMax").value) || 0,
                screenMaxBrightness: parseInt(document.getElementById("screenMaxBrightness").value) || 0,
                connectionMaxWifi: 0,
                connectionMaxBluetooth: 0,
                connectionMaxMobileNetwork: 0,
                connectionDualSim: "",
                connectionESim: "",
                connectionNfc: "",
                ramAmount: parseInt(document.getElementById("ramAmount").value) || 0,
                storageAmount: parseInt(document.getElementById("storageAmount").value) || 0,
                batteryCapacity: parseInt(document.getElementById("batteryCapacity").value) || 0,
                batteryMaxChargingWired: 0,
                batteryMaxChargingWireless: 0,
                phoneWeightMin: parseInt(document.getElementById("phoneWeightMin").value) || 0,
                phoneWeightMax: parseInt(document.getElementById("phoneWeightMax").value) || 0,
                waterproofType: ""
            };

            console.log("Szűrési feltételek:", filters);

            try {
                const resp = await fetch(filterApiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(filters)
                });

                if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);

                const text = await resp.text();
                console.log("Backend raw response:", text);

                let data = null;

                try {
                    data = JSON.parse(text);
                } catch (e) {
                    const arrStart = text.indexOf('[');
                    const objStart = text.indexOf('{');
                    let start = -1, end = -1;

                    if (arrStart !== -1) {
                        start = arrStart;
                        end = text.lastIndexOf(']');
                    } else if (objStart !== -1) {
                        start = objStart;
                        end = text.lastIndexOf('}');
                    }

                    if (start !== -1 && end !== -1 && end > start) {
                        const jsonPart = text.substring(start, end + 1);
                        try {
                            data = JSON.parse(jsonPart);
                        } catch (e2) {
                            console.error("Nem sikerült parse-olni a kinyert JSON részt:", e2);
                            data = [];
                        }
                    } else {
                        console.warn("Backend válaszban nincs JSON rész:", text);
                        data = [];
                    }
                }

                console.log("Parsed filter result:", data);

                if (Array.isArray(data)) {
                    filteredPhones = data;
                } else if (data && Array.isArray(data.result)) {
                    filteredPhones = data.result;
                } else if (data && Array.isArray(data.phones)) {
                    filteredPhones = data.phones;
                } else {
                    filteredPhones = data ? [data] : [];
                }

                displayPhoneCards(filteredPhones);
                updateCompareCount();
                updateCartCount();
            } catch (error) {
                console.error('Hiba a backend szűrés során:', error);
            }
        }


        function resetFilters() {
            document.getElementById("manufacturerName").value = "";
            document.getElementById("cpuName").value = "";
            document.getElementById("phoneAntutu").value = "";
            document.getElementById("cpuMaxClockSpeed").value = "";
            document.getElementById("cpuCoreNumber").value = "";
            document.getElementById("screenSizeMin").value = "";
            document.getElementById("screenSizeMax").value = "";
            document.getElementById("screenRefreshRateMin").value = "";
            document.getElementById("screenRefreshRateMax").value = "";
            document.getElementById("screenMaxBrightness").value = "";
            document.getElementById("ramAmount").value = "";
            document.getElementById("storageAmount").value = "";
            document.getElementById("batteryCapacity").value = "";
            document.getElementById("phoneWeightMin").value = "";
            document.getElementById("phoneWeightMax").value = "";
            
            filteredPhones = allPhonesData;
            displayPhoneCards();
        }

        // Betöltjük a telefon neveket a keresőhöz
        searchPhonesGET();