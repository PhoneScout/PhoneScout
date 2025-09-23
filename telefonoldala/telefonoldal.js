const apiUrl = "http://localhost:5287/api/auth";
const allPhonesURL = "http://localhost:5165/api/GETphonePage"; //ÚJ BACKEND
//const allPhonesURL = "http://localhost:5287/api/Phone"; // RÉGI BACKEND

console.log("telefonoldala")

let currentPage = 0;
let phonesPerPage = 5;
let allPhonesData = [];

let previousPages = JSON.parse(localStorage.getItem("pagesHistory")) || [];

function showPreviousPages() {
    let place = document.getElementById("previousPagesPlace");
    place.innerHTML = ""; // clear before rendering

    if (previousPages.length > 1) {
        for (let i = 0; i < previousPages.length - 1; i++) {
            place.innerHTML += `
                <a href="${previousPages[i].pageURL}" target="_blank" class="pagesHistory" onclick="clickedLine(this)">
                    <div>${previousPages[i].pageName}</div>
                </a> /
            `;
        }
        place.innerHTML += `<div class="pagesHistory">${previousPages[previousPages.length - 1].pageName
            }</div>`;
    } else if (previousPages.length === 1) {
        place.innerHTML = `<div class="pagesHistory">${previousPages[0].pageName}</div>`;
    }
}

showPreviousPages();

function addToPreviousPages(line) {
    let name = line.textContent.split("\n");
    if (name.length != 1) {
        previousPages.push({
            pageName: name[name.length - 2].trim(),
            pageURL: line.href,
        });
    } else {
        previousPages.push({ pageName: line.textContent, pageURL: line.href });
    }
    localStorage.setItem("pagesHistory", JSON.stringify(previousPages));
    showPreviousPages(); // update UI
}

function clickedLine(line) {
    let index = 0;

    for (let i = 0; i < previousPages.length; i++) {
        {
            if (line.textContent == previousPages[i].pageName) {
                index = i;
            }
        }
    }

    if (index !== 0) {
        previousPages.splice(index + 1); // delete from index to end
        localStorage.setItem("pagesHistory", JSON.stringify(previousPages));
        showPreviousPages(); // refresh UI
    } else {
        addToPreviousPages(line);
    }
}


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
    cartElement.textContent = `${itemCount}`;
}
updateCartCount()
window.onload = function () {
    // Betöltéskor hívja meg a telefon adatait
    let selectedPhoneID = localStorage.getItem("selectedPhone")
    console.log(selectedPhoneID)
    fetch(allPhonesURL + "/" + selectedPhoneID)//telefon ID, át kell írni az éppen aktívra
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


    let selectedPhone = allPhonesData.find(item => item.phoneID == selectedPhoneID);//telefon ID, át kell írni az éppen aktívra

    let colorPlace = document.getElementById("colorPlace")
    let ramStoragePlace = document.getElementById("ramStoragePlace")


    console.log(selectedPhone)

    //színek adatbázisból
    for (let i = 0; i < selectedPhone.color.colorName.length; i++) {
        let colorHTML = `<button class="color-option" style="background: ${selectedPhone.color.colorHex[i]};" onclick="selectColor(this)"></button>`
        colorPlace.innerHTML += colorHTML
    }

    for (let i = 0; i < selectedPhone.ramStorageG.ramStoragePairs.length; i++) {
        let ramStorageHTML = `<button class="ramTárhelyOption" onclick="selectRamTárhely(this)">${selectedPhone.ramStorageG.ramStoragePairs[i]} GB</button>`
        ramStoragePlace.innerHTML += ramStorageHTML
    }

    // Example structure:
    // selectedPhone.camera.cameraName = ["Main", "Ultra Wide"];
    // selectedPhone.camera.cameraResolution = [50, 12];
    // selectedPhone.camera.kameraAperture = ["f/1.8", "f/2.2"];

    const camNames = selectedPhone.camera.cameraName;
    const camRes = selectedPhone.camera.cameraResolution;
    const camApertures = selectedPhone.camera.cameraAperture;
    const camFocalLengths = selectedPhone.camera.cameraFocalLength;
    const camOISs = selectedPhone.camera.cameraOIS;

    console.log(camOISs)


    cameraPlace.innerHTML = "";

    for (let i = 0; i < camNames.length; i++) {
        cameraPlace.innerHTML += `
    <tr><td class="camera_table">Kamera neve</td><td class="camera_table">${camNames[i]}</td></tr>
    <tr><td class="camera_table">Felbontás</td><td class="camera_table">${camRes[i]} MP</td></tr>
    <tr><td class="camera_table">Rekeszérték</td><td class="camera_table">${camApertures[i]}</td></tr>
    <tr><td class="camera_table">Fókusztávolság</td><td class="camera_table">${camFocalLengths[i]}</td></tr>
    <tr><td class="camera_table">Optikai képstabilizátor</td><td class="camera_table">${camOISs[i]}</td></tr>
  `;
    }

    console.log(allPhonesData)

    if (selectedPhone) {
        const phoneName = selectedPhone.phoneName;
        const phoneStock = selectedPhone.phoneInStore === "van" ? "Raktáron" : "Nincs raktáron";
        const phonePrice = `${selectedPhone.phonePrice} Ft`;

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


    let selectedPhone = allPhonesData.find(item => item.phoneID == selectedPhoneID); //ID!!!!!!!!!!!!!!!!!!!!!
    if (selectedPhone) {
        dataPlace.innerHTML = `
                <div class="row align-items-center">
                        <table class="table table-striped table-bordered text-center" style="border: solid black 1px">
                            <thead>
                                <tr>
                                    <th colspan="2">${selectedPhone.phoneName} telefon adatai</th>
                                </tr>
                            <tbody>                          
        
                            
    <tr><td colspan="2" class="cpu_table"><strong>CPU</strong></td></tr>
    <tr><td class="cpu_table">Név</td><td class="cpu_table">${selectedPhone.cpuName}</td></tr>
    <tr><td class="cpu_table">Antutu pontszám</td><td class="cpu_table">${selectedPhone.phoneAntutu}</td></tr>
    <tr><td class="cpu_table">Max Órajel</td><td class="cpu_table">${selectedPhone.cpuMaxClockSpeed} GHz</td></tr>
    <tr><td class="cpu_table">Magok száma</td><td class="cpu_table">${selectedPhone.cpuCoreNumber}</td></tr>
    <tr><td class="cpu_table">Gyártási technológia</td><td class="cpu_table">${selectedPhone.cpuManufacturingTechnology} nm</td></tr>

    <tr><td colspan="2" class="kijelzo_table"><strong>Kijelző</strong></td></tr>
    <tr><td class="kijelzo_table">Típusa</td><td class="kijelzo_table">${selectedPhone.screenType}</td></tr>
    <tr><td class="kijelzo_table">Felbontás</td><td class="kijelzo_table">${selectedPhone.phoneResolutionHeight} x ${selectedPhone.phoneResolutionWidth} px</td></tr>
    <tr><td class="kijelzo_table">Mérete</td><td class="kijelzo_table">${selectedPhone.screenSize.toFixed(2)}”</td></tr>
    <tr><td class="kijelzo_table">Frissítési ráta</td><td class="kijelzo_table">${selectedPhone.screenRefreshRate.toFixed(2)} Hz</td></tr>
    <tr><td class="kijelzo_table">Max fényerő</td><td class="kijelzo_table">${selectedPhone.screenMaxBrightness.toFixed(2)} nit</td></tr>
    <tr><td class="kijelzo_table">Élessége/Képpontsűrűség</td><td class="kijelzo_table">${selectedPhone.screenSharpness.toFixed(2)} ppi</td></tr>

    <tr><td colspan="2" class="csatlakozo_table"><strong>Csatlakoztathatóság</strong></td></tr>
    <tr><td class="csatlakozo_table">Wi-Fi</td><td class="csatlakozo_table">Wifi ${selectedPhone.connectionMaxWifi}</td></tr>
    <tr><td class="csatlakozo_table">Bluetooth</td><td class="csatlakozo_table">Bluetooth ${selectedPhone.connectionMaxBluetooth.toFixed(2)}</td></tr>
    <tr><td class="csatlakozo_table">Mobilhálózat</td><td class="csatlakozo_table">${selectedPhone.connectionMaxMobileNetwork}</td></tr>
    <tr><td class="csatlakozo_table">Dual SIM</td><td class="csatlakozo_table">${selectedPhone.connectionDualSim}</td></tr>
    <tr><td class="csatlakozo_table">E-SIM</td><td class="csatlakozo_table">${selectedPhone.connectionESim}</td></tr>
    <tr><td class="csatlakozo_table">NFC</td><td class="csatlakozo_table">${selectedPhone.connectionNfc}</td></tr>

    <tr><td colspan="2" class="ram_storage_table"><strong>RAM / Tárhely</strong></td></tr>
    <tr><td class="ram_storage_table">RAM sebesség</td><td class="ram_storage_table">${selectedPhone.ramSpeed}</td></tr>
    <tr><td class="ram_storage_table">Tárhely sebesség</td><td class="ram_storage_table">${selectedPhone.storageSpeed}</td></tr>

    <tr><td colspan="2" class="akkumulator_table"><strong>Akkumulátor és Töltés</strong></td></tr>
    <tr><td class="akkumulator_table">Akkumulátor kapacitása</td><td class="akkumulator_table">${selectedPhone.batteryCapacity} mAh</td></tr>
    <tr><td class="akkumulator_table">Akkumulátor típusa</td><td class="akkumulator_table">${selectedPhone.batteryType}</td></tr>
    <tr><td class="akkumulator_table">Vezetékes töltés max sebessége</td><td class="akkumulator_table">${selectedPhone.batteryMaxChargingWired}W</td></tr>
    <tr><td class="akkumulator_table">Vezeték nélküli töltés max sebessége</td><td class="akkumulator_table">${selectedPhone.batteryMaxChargingWireless}W</td></tr>

    <tr><td colspan="2" class="camera_table"><strong>Kamera</strong></td></tr>
    <tbody id="cameraPlace"></tbody>

    <tr><td colspan="2" class="test_table"><strong>Test/Ház/Külső</strong></td></tr>
    <tr><td class="test_table">Magasság</td><td class="test_table">${selectedPhone.caseHeight.toFixed(2)} mm</td></tr>
    <tr><td class="test_table">Szélesség</td><td class="test_table">${selectedPhone.caseWidth.toFixed(2)} mm</td></tr>
    <tr><td class="test_table">Vastagság</td><td class="test_table">${selectedPhone.caseThickness.toFixed(2)} mm</td></tr>
    <tr><td class="test_table">Vízállóság</td><td class="test_table">${selectedPhone.waterproofType}</td></tr>
    <tr><td class="test_table">Hátlap anyaga</td><td class="test_table">${selectedPhone.backMaterial}</td></tr>
    <tr><td class="test_table">Súly</td><td class="test_table">${selectedPhone.phoneWeight}</td></tr>
    
    <tr><td colspan="2" class="speaker_table"><strong>Hangszóró</strong></td></tr>
    <tr><td class="speaker_table">Hangszóró</td><td class="speaker_table">${selectedPhone.speakerType}</td></tr>
    
</table>

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
    addSvgHoverEffect("mySvg", "hangszóró", "speaker_table");
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
                tableRows.forEach(function (row) {
                    row.style.backgroundColor = "#38ec38bd";
                });
            });

            targetElement.addEventListener("mouseleave", function () {
                targetElement.style.fill = "";

                const tableRows = document.querySelectorAll(`.${tableClass}`);
                tableRows.forEach(function (row) {
                    row.style.backgroundColor = "";
                });
            });

            targetElement.addEventListener("click", function () {
                const tableRows = document.querySelectorAll(`.${tableClass}`);
                tableRows.forEach(function (row) {
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
        window.location.href = "./telefonoldal.html";
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