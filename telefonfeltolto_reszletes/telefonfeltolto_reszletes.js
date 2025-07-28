const apiUrl = "http://localhost:5287/api/auth";
const allPhonesURL = "http://localhost:5165/api/postPhone/phonePost1"; // ÚJ BACKEND
console.log("telefonoldala");

let currentPage = 0;
let phonesPerPage = 5;
let allPhonesData = [];
let kosar = [];

document.addEventListener("DOMContentLoaded", function () {
    showUsername();

    let currentFormPage = 1;
    const totalPages = 5;
    let currentStep = 0;

    const formSections = document.querySelectorAll('.form-page');
    const progressBar = document.querySelector('.progress-bar');
    const nextButton = document.getElementById('nextBtn');
    const backButton = document.getElementById('prevBtn');

    const showFormPage = (page) => {
        formSections.forEach((el, index) => {
            el.style.display = (index + 1 === page) ? 'block' : 'none';
        });
        backButton.disabled = (page === 1);
        nextButton.textContent = (page === totalPages) ? 'Beküldés' : 'Következő';
    };

    const totalInputs = Array.from(formSections).reduce((sum, section) => {
        return sum + section.querySelectorAll('input').length;
    }, 0);

    function updateProgressBar(step) {
        let filledInputs = 0;
        for (let i = 0; i <= step; i++) {
            filledInputs += formSections[i].querySelectorAll('input').length;
        }

        const percentage = Math.round((filledInputs / totalInputs) * 100);
        progressBar.style.width = percentage + '%';
        progressBar.setAttribute('aria-valuenow', percentage);
        progressBar.textContent = percentage + '%';
    }

    nextButton.addEventListener('click', function () {
        if (currentFormPage < totalPages) {
            currentFormPage++;
            currentStep++;
            showFormPage(currentFormPage);
            updateProgressBar(currentStep);
        } else {
            PhonePOST();
            /*setTimeout(() => {
                window.location.href = '../telefonfeltoltes/telefonfeltoltes.html';
            }, 1000);*/
        }
    });

    backButton.addEventListener('click', function () {
        if (currentFormPage > 1) {
            currentFormPage--;
            currentStep--;
            showFormPage(currentFormPage);
            updateProgressBar(currentStep);
        }
    });

    showFormPage(currentFormPage);
    updateProgressBar(currentStep);
});

function updateSpeakerLabel(switchElem) {
    const mono = document.getElementById("labelMono");
    const stereo = document.getElementById("labelStereo");

    if (switchElem.checked) {
        stereo.style.fontWeight = "bold";
        mono.style.fontWeight = "normal";
    } else {
        mono.style.fontWeight = "bold";
        stereo.style.fontWeight = "normal";
    }
}

function PhonePOST() {
    const phoneDataPOST = {


        // Simple data (must match the C# property names exactly)
        phoneName: document.getElementById("phoneName").value || "",
        phoneAntutu: parseInt(document.getElementById("Antutu").value) || 0,
        phoneResolutionHeight: parseInt(document.getElementById("ResolutionH").value) || 0,
        phoneResolutionWidth: parseInt(document.getElementById("ResolutionW").value) || 0,
        screenSize: parseFloat(document.getElementById("Size").value) || 0.0,
        screenRefreshRate: parseInt(document.getElementById("RefreshRate").value) || 0,
        screenMaxBrightness: parseInt(document.getElementById("MaxBrightness").value) || 0,
        screenSharpness: parseInt(document.getElementById("PixelDensity").value) || 0,
        connectionMaxWifi: parseInt(document.getElementById("Wifi").value) || 0,
        connectionMaxBluetooth: parseFloat(document.getElementById("Bluetooth").value) || 0.0,
        connectionMaxMobileNetwork: parseInt(document.getElementById("MobileNetwork").value) || 0,
        connectionDualSim: document.getElementById("DualSIM").checked ? "van" : "nincs",
        connectionESim: document.getElementById("ESIM").checked ? "van" : "nincs",
        connectionNfc: document.getElementById("NFC").checked ? "van" : "nincs",
        connectionConnectionSpeed: parseInt(document.getElementById("ConnectorSpeed").value) || 0,
        connectionJack: document.getElementById("Jack").checked ? "van" : "nincs",
        sensorsInfrared: "nincs",
        batteryCapacity: parseInt(document.getElementById("BatteryCapacity").value) || 0,
        batteryMaxChargingWired: parseInt(document.getElementById("WiredChargingSpeed").value) || 0,
        batteryMaxChargingWireless: parseInt(document.getElementById("WirelessChargingSpeed").value) || 0,
        caseHeight: parseFloat(document.getElementById("Height").value) || 0.0,
        caseWidth: parseFloat(document.getElementById("Width").value) || 0.0,
        caseThickness: parseFloat(document.getElementById("Thickness").value) || 0.0,
        phoneReleaseDate: "",
        phonePrice: 0,
        phoneInStore: "nincs",
        phoneInStoreAmount: 0,

        // Connection table data
        backMaterial: document.getElementById("BackMaterial").value || "",
        batteryType: document.getElementById("BatteryType").value || "",
        chargerType: document.getElementById("ChargerType").value || "",
        cpuName: document.getElementById("CpuName").value || "",
        cpuMaxClockSpeed: parseInt(document.getElementById("MaxClockspeed").value) || 0,
        cpuCoreNumber: parseInt(document.getElementById("CoreNumber").value) || 0,
        cpuManufacturingTechnology: parseInt(document.getElementById("ManufacturingTechnology").value) || 0,
        manufacturerName: "",
        manufacturerURL: "",
        ramSpeed: "",
        screenType: document.getElementById("DisplayType").value || "",
        sensorsFingerprintPlace: "",
        sensorsFingerprintType: "",
        storageSpeed: "",
        waterproofType: document.getElementById("WaterResistance").value || "",
        speakerType: document.getElementById("speaker").checked ? "stereo" : "mono",
        phoneWeight: 0.0,

        // Complex nested data
        ramStorage: {
            ID: [],
            ramAmount: [],
            storageAmount: []
        },
        Color: {
            ID: [],
            colorName: [],
            colorHex: []
        },
        Camera: {
            ID: [],
            cameraName: [],
            cameraResolution: [],
            cameraAperture: [],
            cameraFocalLength: [],
            cameraOIS: []
        },
        CameraType: {
            ID: [],
            cameraType: []
        }
    };

    // Log the data and send the request
    console.log("Sending:", phoneDataPOST);
    fetch(allPhonesURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(phoneDataPOST)
    })
        .then(response => response.text())
        .then(data => {
            alert(data);
            let lastInsertedPhoneID = data;
            console.log(lastInsertedPhoneID)
            localStorage.setItem("lastID", lastInsertedPhoneID)
            setTimeout(() => {
                window.location.href = "../telefonfeltoltes/telefonfeltoltes.html";
            }, 1000);

        })
        .catch(error => console.error("Error:", error));
}


function showUsername() {
    const firstname = localStorage.getItem("firstname");
    const jogosultsag = localStorage.getItem("jogosultsag");

    console.log(firstname);
    if (firstname) {
        document.getElementById("firstName").innerText = firstname;
        document.getElementById("dropdownMenu").style.display = 'block';
        document.getElementById("loginText").style.display = 'none';
    } else {
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

document.addEventListener("DOMContentLoaded", function () {
    const moreInfoButton = document.querySelector('.moreInfoAboutPhone');
    if (moreInfoButton) {
        moreInfoButton.addEventListener('click', function () {
            const firstRow = document.querySelector('table tr');
            if (firstRow) {
                firstRow.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
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
        window.location.href = "./telefonfeltolto_reszletes.html";
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