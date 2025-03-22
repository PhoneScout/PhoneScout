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
    // Betöltéskor hívja meg a telefon adatait
    fetch(allPhonesURL)
        .then(response => response.json())
        .then(data => {
            telDataShow(data);  // Hívja meg a funkciót, miután a DOM betöltődött
        })
        .catch(error => console.error("Hiba a telefon adatok betöltésekor:", error));
};

function telDataShow(allPhonesData) {
    let dataPlace = document.getElementById("telData");
    let selectedPhoneID = localStorage.getItem("selectedPhone");

    if (!selectedPhoneID) {
        console.error("No selected phone found in localStorage.");
        return;
    }

    let selectedPhone = allPhonesData.find(item => item.id == selectedPhoneID);

    if (selectedPhone) {
        const phoneName = selectedPhone.name;
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
    let dataPlace = document.getElementById("telData");
    let selectedPhoneID = localStorage.getItem("selectedPhone");

    if (!selectedPhoneID) {
        console.error("No selected phone found in localStorage.");
        return;
    }

    let selectedPhone = allPhonesData.find(item => item.PhoneID == selectedPhoneID);

    if (selectedPhone) {
        dataPlace.innerHTML = `
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-4 svg-container">
                        <object id="mySvg" data="Untitled-1.svg" type="image/svg+xml"></object>
                    </div>
                    <div class="col-md-8 table-container">
                        <table class="table table-striped table-bordered text-center">
                            <thead>
                                <tr>
                                    <th>Név</th>
                                    <th>${selectedPhone.PhoneNev}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td colspan="2"><strong>CPU:</strong></td></tr>
                                <tr><td>Név</td><td>${selectedPhone.CPUNev}</td></tr>
                                <tr><td>Antutu pontszám</td><td>${selectedPhone.CPUAntutu}</td></tr>
                                <tr><td>Max Órajel</td><td>${selectedPhone.CPUMaxOrajel} GHz</td></tr>
                                <tr><td>Magok száma</td><td>${selectedPhone.CPUMagokSzama}</td></tr>
                                <tr><td>Gyártási technológia</td><td>${selectedPhone.CPUGyartasiTechnologia} nm</td></tr>
                                <tr><td colspan="2"><strong>Kijelző</strong></td></tr>
                                <tr><td>Típusa</td><td>${selectedPhone.KijelzoTipusa}</td></tr>
                                <tr><td>Felbontás</td><td>${selectedPhone.KijelzoFelbontasMagassag} x ${selectedPhone.KijelzoFelbontasSzelesseg} px</td></tr>
                                <tr><td>Mérete</td><td>${selectedPhone.KijelzoMerete}”</td></tr>
                                <tr><td>Frissítési ráta</td><td>${selectedPhone.KijelzoFrissitesiRata} Hz</td></tr>
                                <tr><td>Max fényerő</td><td>${selectedPhone.KijelzoMaxFenyero} nit</td></tr>
                                <tr><td>Élessége/Képpontsűrűség</td><td>${selectedPhone.KijelzoElesseg} ppi</td></tr>
                                <tr><td colspan="2"><strong>Csatlakoztathatóság</strong></td></tr>
                                <tr><td>Wi-Fi</td><td>${selectedPhone.CsatlakoztathatosagWifi}</td></tr>
                                <tr><td>Bluetooth</td><td>${selectedPhone.CsatlakoztathatosagBluetooth}</td></tr>
                                <tr><td>Mobilhálózat</td><td>${selectedPhone.CsatlakoztathatosagMobilhalozat}</td></tr>
                                <tr><td>Dual SIM</td><td>${selectedPhone.CsatlakoztathatosagDualSim}</td></tr>
                                <tr><td>E-SIM</td><td>${selectedPhone.CsatlakoztathatosagESim}</td></tr>
                                <tr><td>NFC</td><td>${selectedPhone.CsatlakoztathatosagNfc}</td></tr>
                                <tr><td>Töltő típusa</td><td>${selectedPhone.ToltoTipus}</td></tr>
                                <tr><td>Csatlakozó gyorsasága</td><td>${selectedPhone.CsatlakoztathatosagCsatlakozoGyorsasaga}</td></tr>
                                <tr><td>3,5mm jack</td><td>${selectedPhone.CsatlakoztathatosagJack}</td></tr>
                                <tr><td colspan="2"><strong>Szenzorok/Érzékelők:</strong></td></tr>
                                <tr><td>Ujjlenyomat-olvasó</td><td>${selectedPhone.SzenzorokUjjlenyomatHely}, ${selectedPhone.SzenzorokUjjlenyomatTipus}</td></tr>
                                <tr><td>Infravörös</td><td>${selectedPhone.SzenzorokInfravoros}</td></tr>
                                <tr><td colspan="2"><strong>RAM/Tárhely</strong></td></tr>
                                <tr><td>RAM mennyisége</td><td>${selectedPhone.RamMennyiseg}GB</td></tr>
                                <tr><td>RAM sebesség</td><td>${selectedPhone.RamSebesseg}</td></tr>
                                <tr><td>Tárhely mennyisége</td><td>${selectedPhone.StorageMennyiseg}GB</td></tr>
                                <tr><td>Tárhely sebesség</td><td>${selectedPhone.StorageSebesseg}</td></tr>
                                <tr><td colspan="2"><strong>Akkumulátor & Töltés</strong></td></tr>
                                <tr><td>Akkumulátor kapacitása</td><td>${selectedPhone.AkkumulatorKapacitas}mAh</td></tr>
                                <tr><td>Akkumulátor típusa</td><td>${selectedPhone.AkkumulatorTipusa}</td></tr>
                                <tr><td>Töltő típusa</td><td>${selectedPhone.ToltoTipus}</td></tr>
                                <tr><td>Vezetékes töltés max sebessége</td><td>${selectedPhone.ToltoVezetekes}W</td></tr>
                                <tr><td>Vezeték nélküli töltés max sebessége</td><td>${selectedPhone.ToltoVezeteknelkuli}W</td></tr>
                                <tr><td colspan="2"><strong>Kamera</strong></td></tr>
                                <tr><td>Kamera neve</td><td>${selectedPhone.KameraNev}</td></tr>
                                <tr><td>Kamera felbontása</td><td>${selectedPhone.KameraFelbontas}MP</td></tr>
                                <tr><td>Kamera rekeszértéke</td><td>${selectedPhone.KameraRekeszertek}</td></tr>
                                <tr><td>Fókusztávolság</td><td>${selectedPhone.KameraFokusztavolsag}mm</td></tr>
                                <tr><td>Optikai képstabilizátor (OIS)</td><td>${selectedPhone.KameraOptikaiKepStabilizator}</td></tr>
                                <tr><td colspan="2"><strong>Test/Ház/Külső</strong></td></tr>
                                <tr><td>Magasság</td><td>${selectedPhone.TestMagassag} mm</td></tr>
                                <tr><td>Szélesség</td><td>${selectedPhone.TestSzelesseg} mm</td></tr>
                                <tr><td>Vastagság</td><td>${selectedPhone.TestVastagsag} mm</td></tr>
                                <tr><td>Vízállóság</td><td>${selectedPhone.TestVizalossag}</td></tr>
                                <tr><td>Hátlap anyaga</td><td>${selectedPhone.TestHatlapAnyaga}</td></tr>
                            </tbody>
                        </table>
                    </div>
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
        RamMennyiseg: document.getElementById("RAMAmount").value || 0,
        RamSebesseg: document.getElementById("RAMSpeed").value || "",
        StorageMennyiseg: document.getElementById("StorageAmount").value || 0,
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
