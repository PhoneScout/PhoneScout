const apiUrl = "http://localhost:5287/api/auth";
const allPhonesURL = "http://localhost:5165/api/GETphonePage"; //ÚJ BACKEND
//const allPhonesURL = "http://localhost:5287/api/Phone"; // RÉGI BACKEND

console.log("telefonoldala")

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
            window.location.href = "./telefonoldala/index.html"; // This will load the new page.
        };

        phoneCard.style.gridColumn = `${2 + index * 2} / span 2`;

        const phoneImage = document.createElement("img");
        phoneImage.classList.add("phoneImage");
        phoneImage.src = phone.imageUrl || "./Images/image 3.png";
        phoneImage.loading = "lazy";

        const phoneName = document.createElement("div");
        phoneName.classList.add("phoneName");
        phoneName.textContent = phone.phoneNev;

        if (phoneName.textContent.length > 8) {
            phoneName.style.whiteSpace = "normal"; // Engedélyezzük a sortörést
            phoneName.style.wordWrap = "break-word"; // Tördeljük a szavakat, ha szükséges
        }
        if (phoneName.textContent.length > 15) {
            phoneName.style.fontSize = "200%";
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
            event.stopPropagation(); // Prevent triggering the phoneCard click event
            console.log(`Add to cart clicked for phone ID: ${phone.phoneID}`);

            // Retrieve the existing cart from localStorage or initialize an empty object
            let cart = JSON.parse(localStorage.getItem("cart")) || {};

            // Increment the quantity for the phone ID, or set it to 1 if it doesn't exist
            cart[phone.phoneID] = (cart[phone.phoneID] || 0) + 1;

            // Save the updated cart back to localStorage
            localStorage.setItem("cart", JSON.stringify(cart));

            console.log("Current cart:", cart);
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
    cartElement.textContent = `Kosár(${itemCount})`;
}
updateCartCount()
window.onload = function () {
    // Betöltéskor hívja meg a telefon adatait
    let selectedPhoneID = localStorage.getItem("selectedPhone")
    console.log(selectedPhoneID)
    fetch(allPhonesURL + "/" + 57)//telefon ID, át kell írni az éppen aktívra
        .then(response => response.json())
        .then(data => {
            console.log(data)
            telDataShow(data);  // Hívja meg a funkciót, miután a DOM betöltődött
            telDataShowMain(data)
            allPhonesData = data;
        })
        .catch(error => console.error("Hiba a telefon adatok betöltésekor:", error));
};

function telDataShowMain(allPhonesData) {
    let dataPlace = document.getElementById("telData");
    let selectedPhoneID = localStorage.getItem("selectedPhone");
    console.log(selectedPhoneID)
    if (!selectedPhoneID) {
        console.error("No selected phone found in localStorage.");
        return;
    }

    
    let selectedPhone = allPhonesData.find(item => item.phoneID == 57);//telefon ID, át kell írni az éppen aktívra

    let colorPlace = document.getElementById("colorPlace")

    console.log(selectedPhone.color.colorHex.length)

    console.log(selectedPhone)

    //színek adatbázisból
    for (let i = 0; i < selectedPhone.color.colorName.length; i++) {
        let colorHTML = `<button class="color-option" style="background: ${selectedPhone.color.colorHex[i]};" onclick="selectColor(this)"></button>`
        colorPlace.innerHTML += colorHTML        
    }



    console.log(allPhonesData)

    if (selectedPhone) {
        const phoneName = selectedPhone.phoneNev;
        const phoneStock = selectedPhone.inStore === "van" ? "Raktáron" : "Nincs raktáron";
        const phonePrice = `${selectedPhone.ar} Ft`;

        document.getElementById("telData").innerHTML = `
            <div class="phoneName" id="showRequestedDataName">
                ${phoneName}
            </div>
            <div class="phoneStock">
                ${phoneStock}
            </div>
            <div class="price">
                ${phonePrice}
            </div>
            <button class="phoneSiteButton phoneSiteCartButton" id="addToCartButton">Kosárba rakom</button>
            <button class="phoneSiteButton phoneSiteCompareButton">Összehasonlítás</button>
        `;

        // Kosárba rakás logika
        document.getElementById("addToCartButton").onclick = function () {
            let cart = JSON.parse(localStorage.getItem("cart")) || {};
            cart[selectedPhone.phoneID] = (cart[selectedPhone.phoneID] || 0) + 1;
            localStorage.setItem("cart", JSON.stringify(cart));
            console.log("Kosár frissítve:", cart);

            // Frissítse a kosár számlálót
            updateCartCount();
        };

        // Az oldal betöltésekor frissítse a kosár számlálót
        updateCartCount();


    } else {
        console.error("No phone found with the given ID.");
    }
}

function telDataShow(allPhonesData) {
    let dataPlace = document.getElementById("telDataShowTable");
    let selectedPhoneID = localStorage.getItem("selectedPhone");
    console.log(selectedPhoneID)
    if (!selectedPhoneID) {
        console.error("No selected phone found in localStorage.");
        return;
    }

    let selectedPhone = allPhonesData.find(item => item.phoneID == selectedPhoneID);
    if (selectedPhone) {
        dataPlace.innerHTML = `
                <div class="row align-items-center">
                        <table class="table table-striped table-bordered text-center" style="border: solid black 1px">
                            <thead>
                                <tr>
                                    <th colspan="2">${selectedPhone.phoneNev} telefon adatai</th>
                                </tr>
                            <tbody>                          



                                <tr><td colspan="2" class="cpu_table"><strong>CPU</strong></td></tr>
                                <tr><td class="cpu_table">Név</td><td class="cpu_table">${selectedPhone.cpuNev}</td></tr>
                                <tr><td class="cpu_table">Antutu pontszám</td><td class="cpu_table">${selectedPhone.cpuAntutu}</td></tr>
                                <tr><td class="cpu_table">Max Órajel</td><td class="cpu_table">${selectedPhone.cpuMaxOrajel} GHz</td></tr>
                                <tr><td class="cpu_table">Magok száma</td><td class="cpu_table">${selectedPhone.cpuMagokSzama}</td></tr>
                                <tr><td class="cpu_table">Gyártási technológia</td><td class="cpu_table">${selectedPhone.cpuGyartasiTechnologia} nm</td></tr>

                                <tr><td colspan="2" class="kijelzo_table"><strong>Kijelző</strong></td></tr>
                                <tr><td class="kijelzo_table">Típusa</td><td class="kijelzo_table">${selectedPhone.kijelzoTipusa}</td></tr>
                                <tr><td class="kijelzo_table">Felbontás</td><td class="kijelzo_table">${selectedPhone.kijelzoFelbontasMagassag} x ${selectedPhone.kijelzoFelbontasSzelesseg} px</td></tr>
                                <tr><td class="kijelzo_table">Mérete</td><td class="kijelzo_table">${selectedPhone.kijelzoMerete}”</td></tr>
                                <tr><td class="kijelzo_table">Frissítési ráta</td><td class="kijelzo_table">${selectedPhone.kijelzoFrissitesiRata} Hz</td></tr>
                                <tr><td class="kijelzo_table">Max fényerő</td><td class="kijelzo_table">${selectedPhone.kijelzoMaxFenyero} nit</td></tr>
                                <tr><td class="kijelzo_table">Élessége/Képpontsűrűség</td><td class="kijelzo_table">${selectedPhone.kijelzoElesseg} ppi</td></tr>

                                <tr><td colspan="2" class="csatlakozo_table"><strong>Csatlakoztathatóság</strong></td></tr>
                                <tr><td class="csatlakozo_table">Wi-Fi</td><td class="csatlakozo_table">Wifi ${selectedPhone.csatlakoztathatosagWifi}</td></tr>
                                <tr><td class="csatlakozo_table">Bluetooth</td><td class="csatlakozo_table">Bluetooth ${selectedPhone.csatlakoztathatosagBluetooth}</td></tr>
                                <tr><td class="csatlakozo_table">Mobilhálózat</td><td class="csatlakozo_table">${selectedPhone.csatlakoztathatosagMobilhalozat}</td></tr>
                                <tr><td class="csatlakozo_table">Dual SIM</td><td class="csatlakozo_table">${selectedPhone.csatlakoztathatosagDualSim}</td></tr>
                                <tr><td class="csatlakozo_table">E-SIM</td><td class="csatlakozo_table">${selectedPhone.csatlakoztathatosagESim}</td></tr>
                                <tr><td class="csatlakozo_table">NFC</td><td class="csatlakozo_table">${selectedPhone.csatlakoztathatosagNfc}</td></tr>

                                <tr><td colspan="2" class="ram_storage_table"><strong>RAM / Tárhely</strong></td></tr>
                                <tr><td class="ram_storage_table">RAM/tárhely mennyisége</td><td class="ram_storage_table">${selectedPhone.ramMennyiseg}/${selectedPhone.storageMennyiseg}GB</td></tr>
                                <tr><td class="ram_storage_table">RAM sebesség</td><td class="ram_storage_table">${selectedPhone.ramSebesseg}</td></tr>
                                <tr><td class="ram_storage_table">Tárhely sebesség</td><td class="ram_storage_table">${selectedPhone.storageSebesseg}</td></tr>

                                <tr><td colspan="2" class="akkumulator_table"><strong>Akkumulátor és Töltés</strong></td></tr>
                                <tr><td class="akkumulator_table">Akkumulátor kapacitása</td><td class="akkumulator_table">${selectedPhone.akkumulatorKapacitas} mAh</td></tr>
                                <tr><td class="akkumulator_table">Akkumulátor típusa</td><td class="akkumulator_table">${selectedPhone.akkumulatorTipusa}</td></tr>
                                <tr><td class="akkumulator_table">Vezetékes töltés max sebessége</td><td class="akkumulator_table">${selectedPhone.toltoVezetekes}W</td></tr>
                                <tr><td class="akkumulator_table">Vezeték nélküli töltés max sebessége</td><td class="akkumulator_table">${selectedPhone.toltoVezeteknelkuli}W</td></tr>

                                <tr><td colspan="2" class="camera_table"><strong>Kamera</strong></td></tr>
                                <tr><td class="camera_table">Kamera neve</td><td class="camera_table">${selectedPhone.kameraNev}</td></tr>
                                <tr><td class="camera_table">Kamera felbontása</td><td class="camera_table">${selectedPhone.kameraFelbontas}MP</td></tr>
                                <tr><td class="camera_table">Kamera rekeszértéke</td><td class="camera_table">${selectedPhone.kameraRekeszertek}</td></tr>

                                <tr><td colspan="2" class="test_table"><strong>Test/Ház/Külső</strong></td></tr>
                                <tr><td class="test_table">Magasság</td><td class="test_table">${selectedPhone.testMagassag} mm</td></tr>
                                <tr><td class="test_table">Szélesség</td><td class="test_table">${selectedPhone.testSzelesseg} mm</td></tr>
                                <tr><td class="test_table">Vastagság</td><td class="test_table">${selectedPhone.testVastagsag} mm</td></tr>
                                <tr><td class="test_table">Vízállóság</td><td class="test_table">${selectedPhone.testVizalossag}</td></tr>
                                <tr><td class="test_table">Hátlap anyaga</td><td class="test_table">${selectedPhone.testHatlapAnyaga}</td></tr>
                            </tbody>
                        </table>
                    </div>               
            </div>
        `;
    } else {
        console.error("No phone found with the given ID.");
    }
}

document.querySelectorAll('.carouselButton').forEach(button => {
    button.addEventListener('mouseup', function () {
        this.blur();
    });
});

document.addEventListener("DOMContentLoaded", function () {
    addSvgHoverEffect("mySvg", "ram/tárhely", "ram_storage_table");
    addSvgHoverEffect("mySvg", "akkumulátoréstöltés", "akkumulator_table");
    addSvgHoverEffect("mySvg", "csatlakoztathatóság", "csatlakozo_table");
    addSvgHoverEffect("mySvg", "cpu", "cpu_table");
    addSvgHoverEffect("mySvg", "kamera", "camera_table");
});

function selectRamTárhely(element) {
    document.querySelectorAll('.ramTárhelyOption').forEach(option => {
        option.style.border = '1px solid black';
    });
    element.style.border = '2px solid black';
}

function selectColor(element) {
    document.querySelectorAll('.color-option').forEach(option => { 
        option.style.border = '1px solid black';
        option.style.boxShadow = 'none';
    });
    element.style.border = '2px solid black';
    const color = window.getComputedStyle(element).backgroundColor;
    element.style.boxShadow = `0 0 15px ${color}`;
}


function addSvgHoverEffect(svgId, elementId, tableClass) {
    const svgObject = document.getElementById(svgId);

    svgObject.addEventListener("load", function () {
        const svgDoc = svgObject.contentDocument;
        if (!svgDoc) return;

        const targetElement = svgDoc.getElementById(elementId);
        if (targetElement) {
            targetElement.addEventListener("mouseenter", function () {
                targetElement.style.fill = "#38ec38dc";

                const tableRows = document.querySelectorAll(`.${tableClass}`);
                tableRows.forEach(function(row) {
                    row.style.backgroundColor = "#38ec38bd";
                });
            });

            targetElement.addEventListener("mouseleave", function () {
                targetElement.style.fill = "";

                const tableRows = document.querySelectorAll(`.${tableClass}`);
                tableRows.forEach(function(row) {
                    row.style.backgroundColor = "";
                });
            });

            targetElement.addEventListener("click", function () {
                const tableRows = document.querySelectorAll(`.${tableClass}`);
                tableRows.forEach(function(row) {
                    const strongTag = row.querySelector("strong");
                    if (strongTag) {
                        const rowText = strongTag.textContent.trim().replace(/\s+/g, '').toLowerCase();
                        const elementText = elementId.replace(/\s+/g, '').toLowerCase();
                        
                        if (rowText === elementText) {
                            row.scrollIntoView({ behavior: "smooth", block: "center" });
                        }
                    }
                });
            });
        }
    });
}

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

document.querySelector('.moreInfoAboutPhone').addEventListener('click', function () {
    // Kiválasztjuk a táblázat első sorát (az első <tr> elemet)
    const firstRow = document.querySelector('table tr');
    
    // Görgetünk az első sorhoz
    if (firstRow) {
        firstRow.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});


// Call showUsername when the page loads
document.addEventListener("DOMContentLoaded", showUsername);