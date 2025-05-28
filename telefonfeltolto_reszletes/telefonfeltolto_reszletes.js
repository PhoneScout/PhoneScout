const apiUrl = "http://localhost:5287/api/auth";
const allPhonesURL = "http://localhost:5287/api/allPhones"; //ÚJ BACKEND
//const allPhonesURL = "http://localhost:5287/api/Phone"; // RÉGI BACKEND

console.log("telefonoldala")

let currentPage = 0;
let phonesPerPage = 5;
let allPhonesData = [];

let kosar = [];

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




let currentFormPage = 1;
const totalPages = 5;

const showFormPage = (page) => {
  document.querySelectorAll('.form-page').forEach((el, index) => {
    el.style.display = (index + 1 === page) ? 'block' : 'none';
  });
  document.getElementById('prevBtn').disabled = (page === 1);
  document.getElementById('nextBtn').textContent = (page === totalPages) ? 'Beküldés' : 'Következő';
};

document.getElementById('nextBtn').addEventListener('click', () => {
  if (currentFormPage < totalPages) {
    currentFormPage++;
    showFormPage(currentFormPage);
  } else {
    document.getElementById("phoneForm").submit(); // Itt lehet beküldeni ténylegesen
    window.location.href = '../telefonfeltoltes/telefonfeltoltes.html'
  }
});

document.getElementById('prevBtn').addEventListener('click', () => {
  if (currentFormPage > 1) {
    currentFormPage--;
    showFormPage(currentFormPage);
  }
});

showFormPage(currentFormPage);


const formSections = document.querySelectorAll('.form-page');
const progressBar = document.querySelector('.progress-bar');
const nextButton = document.getElementById('nextBtn');
const backButton = document.getElementById('backBtn');

let currentStep = 0;

// Összes input mező száma
const totalInputs = Array.from(formSections).reduce((sum, section) => {
  return sum + section.querySelectorAll('input').length;
}, 0);

function updateProgressBar(page) {
  let filledInputs = 0;
  for (let i = 0; i <= page; i++) {
    filledInputs += formSections[i].querySelectorAll('input').length;
  }

  const percentage = Math.round((filledInputs / totalInputs) * 100);
  progressBar.style.width = percentage + '%';
  progressBar.setAttribute('aria-valuenow', percentage);
  progressBar.textContent = percentage + '%';
}

nextButton.addEventListener('click', function () {
  if (currentStep < formSections.length - 1) {
    formSections[currentStep].classList.remove('active');
    currentStep++;
    formSections[currentStep].classList.add('active');
    updateProgressBar(currentStep);
  }
});

backButton.addEventListener('click', function () {
  if (currentStep > 0) {
    formSections[currentStep].classList.remove('active');
    currentStep--;
    formSections[currentStep].classList.add('active');
    updateProgressBar(currentStep);
  }
});

// Indításkor is frissítjük a progress bart
updateProgressBar(currentStep);

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
      sensorsInfrared: document.getElementById("Infrared").checked ? "van" : "nincs",
      batteryCapacity: parseInt(document.getElementById("BatteryCapacity").value) || 0,
      batteryMaxChargingWired: parseInt(document.getElementById("WiredChargingSpeed").value) || 0,
      batteryMaxChargingWireless: parseInt(document.getElementById("WirelessChargingSpeed").value) || 0,
      caseHeight: parseFloat(document.getElementById("Height").value) || 0.0,
      caseWidth: parseFloat(document.getElementById("Width").value) || 0.0,
      caseThickness: parseFloat(document.getElementById("Thickness").value) || 0.0,
      phonePrice: parseInt(document.getElementById("phonePrice").value) || 0,
      phoneInStore: document.getElementById("InStore").value || "",

      // Connection table data
      backMaterial: document.getElementById("BackMaterial").value || "",
      batteryType: document.getElementById("BatteryType").value || "",
      chargerType: document.getElementById("ChargerType").value || "",
      cpuName: document.getElementById("CpuName").value || "",
      cpuMaxClockSpeed: parseInt(document.getElementById("MaxClockspeed").value) || 0,
      cpuCoreNumber: parseInt(document.getElementById("CoreNumber").value) || 0,
      cpuManufacturingTechnology: parseInt(document.getElementById("ManufacturingTechnology").value) || 0,
      manufacturerName: document.getElementById("ManufacturerName").value || "",
      manufacturerURL: document.getElementById("ManufacturerLink").value || "",
      ramSpeed: document.getElementById("RAMSpeed").value || "",
      screenType: document.getElementById("DisplayType").value || "",
      sensorsFingerprintPlace: document.getElementById("FingerprintSensorP").value || "",
      sensorsFingerprintType: document.getElementById("FingerprintSensorT").value || "",
      storageSpeed: document.getElementById("StorageSpeed").value || "",
      waterproofType: document.getElementById("WaterResistance").value || "",
      speakerType: document.getElementById("speaker").checked?"stereo":"mono",
      phoneWeight: document.getElementById("phoneWeight").value || 0.0,

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
      })
      .catch(error => console.error("Error:", error));
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