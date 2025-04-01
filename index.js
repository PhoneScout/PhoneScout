const apiUrl = "http://localhost:5287/api/auth";
const allPhonesURL = "http://localhost:5287/api/allPhones"; //ÚJ BACKEND
//const allPhonesURL = "http://localhost:5287/api/Phone"; // RÉGI BACKEND


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
window.onload = function () {
    // Betöltéskor hívja meg a telefon adatait
    fetch(allPhonesURL)
        .then(response => response.json())
        .then(data => {
            telDataShow(data);  // Hívja meg a funkciót, miután a DOM betöltődött
            telDataShowMain(data)
        })
        .catch(error => console.error("Hiba a telefon adatok betöltésekor:", error));
};

function telDataShowMain(allPhonesData) {
    let dataPlace = document.getElementById("telData");
    let selectedPhoneID = localStorage.getItem("selectedPhone");

    if (!selectedPhoneID) {
        console.error("No selected phone found in localStorage.");
        return;
    }

    let selectedPhone = allPhonesData.find(item => item.phoneID == selectedPhoneID);
    console.log(selectedPhone)

    if (selectedPhone) {
        const phoneName = selectedPhone.phoneNev;
        const phoneStock = selectedPhone.inStore === "van" ? "Raktáron" : "Nincs raktáron";
        const phonePrice = `${selectedPhone.price} Ft`;

        dataPlace.innerHTML = `
                <div class="phoneName" id="showRequestedDataName">
                ${phoneName}
                </div>
                <br>
                <div class="phoneStock">
                    ${phoneStock}
                </div>
                <br>
                <div class="price">
                    ${phonePrice}
                </div>

                <button class="phoneSiteButton phoneSiteCartButton">Kosárba rakom</button>
                <br>
                <button class="phoneSiteButton phoneSiteCompareButton">Összehasonlítás</button>
            
        `;
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
    console.log(selectedPhone)
    if (selectedPhone) {
        dataPlace.innerHTML = `
                <div class="row align-items-center">
                        <table class="table table-striped table-bordered text-center">
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

                                <tr><td colspan="2" class="ram_storage_table"><strong>RAM/Tárhely</strong></td></tr>
                                <tr><td class="ram_storage_table">RAM/tárhely mennyisége</td><td class="ram_storage_table">${selectedPhone.ramMennyiseg}/${selectedPhone.storageMennyiseg}GB</td></tr>
                                <tr><td class="ram_storage_table">RAM sebesség</td><td class="ram_storage_table">${selectedPhone.ramSebesseg}</td></tr>
                                <tr><td class="ram_storage_table">Tárhely sebesség</td><td class="ram_storage_table">${selectedPhone.storageSebesseg}</td></tr>

                                <tr><td colspan="2" class="akkumulator_table"><strong>Akkumulátor & Töltés</strong></td></tr>
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
    const passwordFix = document.getElementById("registerPasswordAgain").value;
    const name = document.getElementById("registerName").value;
    const address = document.getElementById("registerAddress").value;
    const phoneNumber = document.getElementById("registerPhoneNU").value;

    if (password == passwordFix) {
        try {
            const response = await fetch(`${apiUrl}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.text();

            if (response.ok) {
                document.getElementById("alertReg").innerText = `Sikeres regisztráció! Már be tudsz jelentkezni a fiókodba.`;
                document.getElementById("alertReg").style.color = "green";
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1000);
            } else {
                document.getElementById("alertReg").innerText = `Regisztrációs hiba: ${data}`;
                document.getElementById("alertReg").style.color = "red";
                document.getElementById("registerPassword").value = "";
                document.getElementById("registerPasswordAgain").value = "";
            }

        } catch (error) {
            console.error("Registration error:", error);
            document.getElementById("alertReg").innerText = "Hiba lépett fel regisztráció közben. Próbáld újra";
            document.getElementById("alertReg").style.color = "red";
            document.getElementById("registerPassword").value = "";
            document.getElementById("registerPasswordAgain").value = "";
        }
    }
    else {
        document.getElementById("alertReg").innerText = "A két megadott jelszavad nem egyezik!";
        document.getElementById("alertReg").style.color = "red";
        document.getElementById("registerPassword").value = "";
        document.getElementById("registerPasswordAgain").value = "";
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
            document.getElementById("alertLog").innerText = `Sikeres bejelentkezés! Üdvözlünk ${username}`;
            document.getElementById("alertLog").style.color = "green";

            setTimeout(() => {
                window.location.href = "../index.html";

            }, 1000);
        } else {
            document.getElementById("alertLog").innerText = "Sikertelen bejelentkezés.";
            document.getElementById("loginPassword").value = "";
            document.getElementById("alertLog").style.color = "red";
        }
    } catch (error) {
        console.error("Login error:", error);
        document.getElementById("alertLog").innerText = "Hiba lépett fel bejelentkezés közben, próbáld újra";
        document.getElementById("loginPassword").value = "";
        document.getElementById("alertLog").style.color = "red";
    }
}




async function accessProtectedResource() {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
        document.getElementById("response").innerText = "Először be kell jelentkezned.";
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
    alert("Sikeres kijelentkezés!");
    setTimeout(() => {
        window.location.href = "index.html";
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

function PhonePOST() {
    const phoneDataPOST = {
        PhoneNev: document.getElementById("PhoneName").value || "",
        GyartoNev: document.getElementById("ManufacturerName").value || "",
        GyartoLink : document.getElementById("ManufacturerLink").value || "",
        cpuNev: document.getElementById("CpuName").value || "",
        antutu: document.getElementById("Antutu").value || 0,
        cpuMaxOrajel: document.getElementById("MaxClockspeed").value || 0.0,
        cpuMagokSzama: document.getElementById("CoreNumber").value || 0,
        CPUGyartasiTechnologia: document.getElementById("ManufacturingTechnology").value || 0,
        KijelzoTipusa: document.getElementById("DisplayType").value || "",
        KijelzoFelbontasMagassag: document.getElementById("ResolutionH").value || 0,
        KijelzoFelbontasSzelesseg: document.getElementById("ResolutionW").value || 0,
        KijelzoMerete: document.getElementById("Size").value || 0,
        KijelzoFrissitesiRata: document.getElementById("RefreshRate").value || 0,
        KijelzoMaxFenyero: document.getElementById("MaxBrightness").value || 0,
        KijelzoElesseg: document.getElementById("PixelDensity").value || 0,
        CsatlakoztathatosagWifi: document.getElementById("Wifi").value || 0,
        CsatlakoztathatosagBluetooth: document.getElementById("Bluetooth").value || 0.0,
        CsatlakoztathatosagMobilhalozat: document.getElementById("MobileNetwork").value || 0,
        CsatlakoztathatosagDualSim: document.getElementById("DualSIM").value || "nincs",
        CsatlakoztathatosagESim: document.getElementById("ESIM").value || "nincs",
        CsatlakoztathatosagNfc: document.getElementById("NFC").value || "nincs",
        ToltoTipus: document.getElementById("ChargerType").value || "",
        CsatlakoztathatosagCsatlakozoGyorsasaga: document.getElementById("ConnectorSpeed").value || 0.0,
        CsatlakoztathatosagJackCsatlakozo: document.getElementById("Jack").value || "nincs",
        SzenzorokUjjlenyomatHely: document.getElementById("FingerprintSensorP").value || "",
        SzenzorokUjjlenyomatTipus: document.getElementById("FingerprintSensorT").value || "",
        SzenzorokInfravoros: document.getElementById("Infrared").value || "nincs",
        RamMennyiseg: document.getElementById("RAMAmount").value || "",
        RamSebesseg: document.getElementById("RAMSpeed").value || "",
        StorageMennyiseg: document.getElementById("StorageAmount").value || "",
        StorageSebesseg: document.getElementById("StorageSpeed").value || "",
        AkkumulatorKapacitas: document.getElementById("BatteryCapacity").value || 0,
        AkkumulatorTipusa: document.getElementById("BatteryType").value || "",
        ToltoVezetekes: document.getElementById("WiredChargingSpeed").value || 0,
        ToltoVezeteknelkuli: document.getElementById("WirelessChargingSpeed").value || 0,

        KameraNev: document.getElementById("CameraName").value || "",
        KameraFelbontas: document.getElementById("CameraResolution").value || 0,
        KameraRekeszertek: document.getElementById("Aperture").value || "",
        KameraFokusztavolsag: document.getElementById("FocalLength").value || 0,
        KameraOptikaiKepStabilizator: document.getElementById("OIS").value || "nincs",

        TestMagassag: document.getElementById("Height").value || 0.0,
        TestSzelesseg: document.getElementById("Width").value || 0.0,
        TestVastagsag: document.getElementById("Thickness").value || 0.0,
        TestVizalossag: document.getElementById("WaterResistance").value || "",
        TestHatlapAnyaga: document.getElementById("BackMaterial").value || "",

        SzinNev: document.getElementById("ColorName").value || "",
        SzinHex: document.getElementById("ColorHex").value || "",

    };

    // Check the data before sending




    console.log("NEW");
    fetch(`http://localhost:5287/api/allPhones/phonePost`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(phoneDataPOST) // Send the full object
    })
        .then(response => response.text())
        .then(data => {
            alert(data);
        })
        .catch(error => console.error("Error:", error));
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

function addSvgHoverEffect(svgId, elementId, tableClass) {
    const svgObject = document.getElementById(svgId); // Az object elem ID-ja

    svgObject.addEventListener("load", function () {
        const svgDoc = svgObject.contentDocument;
        if (!svgDoc) return;

        const targetElement = svgDoc.getElementById(elementId);
        if (targetElement) {
            targetElement.addEventListener("mouseenter", function () {
                targetElement.style.fill = "#00FF00"; // Zöld szín

                // A táblázat sorok színezése
                const tableRows = document.querySelectorAll(`.${tableClass}`);
                tableRows.forEach(function(row) {
                    row.style.backgroundColor = "#00FF00"; // Zöld háttér
                });
            });

            targetElement.addEventListener("mouseleave", function () {
                targetElement.style.fill = ""; // Visszaáll az eredeti színre

                // A táblázat sorok eredeti színének visszaállítása
                const tableRows = document.querySelectorAll(`.${tableClass}`);
                tableRows.forEach(function(row) {
                    row.style.backgroundColor = ""; // Eredeti háttér
                });
            });
        }
    });
}

