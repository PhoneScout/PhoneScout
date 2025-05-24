const apiUrl = "http://localhost:5287/api/auth";
//const allPhonesURL = "http://localhost:5287/api/allPhones"; //RÉGI BACKEND
const allPhonesURL = "http://localhost:5165/api/postPhone/phonePost1"; // ÚJ BACKEND

let allPhonesData = [];

function getPhoneDatas() {
    return fetch(allPhonesURL)
        .then(response => response.json())
        .then(data => {
            allPhonesData = data;

        })
        .catch(error => console.error('Hiba a JSON betöltésekor:', error));
}
getPhoneDatas();

// ram/storage generálás.

function generateRamStorageCards() {
    let place = document.getElementById("ramstoragePlace");
    let ramStorageCard = document.createElement("div");
    ramStorageCard.classList.add("ramStorage-card");

    ramStorageCard.innerHTML = `
    <div class="dropdown">
        <div class="dropdown-header" onclick="toggleDropdown(this)"> 
            <span class="ramStorageDropdownName">Új Ram / Tárhely</span>
            <button onclick="removeRamStorageCard(this)" class="deleteBtn">X</button>
        </div>
        <div class="dropdown-content">
            <div class="memoryInputs">
                <div class="textBox">
                    <input type="text" class="textBoxInput RAMInput" placeholder=" "
                        onkeyup="modifyMemoryName(this)" />
                    <label class="textBoxLabel">RAM mennyisége</label>
                </div>
                <div class="separator">/</div>
                <div class="textBox">
                    <input type="text" class="textBoxInput StorageInput" placeholder=" "
                        onkeyup="modifyMemoryName(this)" />
                    <label class="textBoxLabel">Tárhely mennyisége</label>
                </div>
            </div>
        </div>
    </div>
    `;
    place.appendChild(ramStorageCard);   
}

function modifyMemoryName(changedInput) {
    const wrapper = changedInput.closest('.dropdown');
    const nameDisplay = wrapper.querySelector('.ramStorageDropdownName');

    const ram = wrapper.querySelector('.RAMInput')?.value || "";
    const storage = wrapper.querySelector('.StorageInput')?.value || "";

    const title = ram && storage ? `${ram}/${storage}` :
        ram ? `${ram}/...` :
            storage ? `.../${storage}` :
                "Új Ram / Tárhely";

    if (nameDisplay) nameDisplay.innerText = title;
}

function removeRamStorageCard(button) {
    const card = button.closest(".ramStorage-card");
    if (card) {
        card.remove();
    }
}





function generateColorCards() {
  let place = document.getElementById("colorPlace");

  let colorCard = document.createElement("div");
  colorCard.classList.add("color-card");

  colorCard.innerHTML = `
    <div class="dropdown">
      <div class="dropdown-header" onclick="toggleDropdown(this)">
        <span class="colorDropdownName">Új Szín</span>
        <button onclick="removeColorCard(this)" class="deleteBtn">X</button>
      </div>
      <div class="dropdown-content">
        <div class="textBox">
          <input type="text" class="colorName textBoxInput" placeholder=" " onkeyup="modifyColorName(this)" />
          <label class="textBoxLabel">Szín név</label>
        </div>
        <div class="textBox">
          <input type="color" class="colorPicker" value="#000000" onchange="syncColorInputs(this)" />
          <label class="textBoxLabel">Szín választó</label>
        </div>
        <div class="textBox">
          <input type="text" class="colorHEX textBoxInput" oninput="syncHEXInput(this)" />
          <label class="textBoxLabel">Szín HEX</label>
        </div>
        <div class="textBox">
          <input type="text" class="colorRGB textBoxInput" readonly/>
          <label class="textBoxLabel">Szín RGB</label>
        </div>
      </div>
    </div>
  `;

  place.appendChild(colorCard);
}

function modifyColorName(inputElement) {
  const wrapper = inputElement.closest('.dropdown');
  const nameDisplay = wrapper.querySelector('.colorDropdownName');
  if (nameDisplay) {
    nameDisplay.innerText = inputElement.value || "Új Szín";
  }
}

// Sync color picker and HEX input when color picker changes
function syncColorInputs(colorPicker) {
  const wrapper = colorPicker.closest('.dropdown');
  const hexInput = wrapper.querySelector('.colorHEX');
  const rgbInput = wrapper.querySelector('.colorRGB');

  if (!hexInput || !rgbInput) return;

  hexInput.value = colorPicker.value.toUpperCase();
  rgbInput.value = hexToRgb(colorPicker.value);
}

// Sync color picker and RGB when HEX input changes
function syncHEXInput(hexInput) {
  const wrapper = hexInput.closest('.dropdown');
  const colorPicker = wrapper.querySelector('.colorPicker');
  const rgbInput = wrapper.querySelector('.colorRGB');
  
  let hex = hexInput.value.trim();

  // Validate hex code format #RRGGBB
  if (/^#([0-9A-Fa-f]{6})$/.test(hex)) {
    if (colorPicker) colorPicker.value = hex;
    if (rgbInput) rgbInput.value = hexToRgb(hex);
  } else {
    if (rgbInput) rgbInput.value = "Invalid HEX";
  }
}

// Helper function to convert HEX to RGB string
function hexToRgb(hex) {
  let r = parseInt(hex.substr(1, 2), 16);
  let g = parseInt(hex.substr(3, 2), 16);
  let b = parseInt(hex.substr(5, 2), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

function removeColorCard(button) {
  const card = button.closest(".color-card");
  if (card) {
    card.remove();
  }
}


function generateCameraCards() {
    let place = document.getElementById("cameraPlace");
    let cameraCard = document.createElement("div");
    cameraCard.classList.add("camera-card");

    cameraCard.innerHTML = `
    <div class="dropdown">
                            <div class="dropdown-header" onclick="toggleDropdown(this)"> <span
                                    class="cameraDropdownName">Új Kamera</span>
                                    <button onclick="removeCameraCard(this)" class="deleteBtn">X</button>

                            </div>
                            <div class="dropdown-content">

                                <div class="textBox">
                                    <input type="text" class="textBoxInput" placeholder=" "
                                        onkeyup="modifyCameraName(this)" />
                                    <label for="CameraName" class="textBoxLabel">Neve</label>
                                </div>
                                <div class="textBox">
                                    <input type="text" id="CameraResolution" class="textBoxInput" placeholder=" " />
                                    <label for="CameraResolution" class="textBoxLabel">Felbontása</label>
                                </div>
                                <div class="textBox">
                                    <input type="text" id="Aperture" class="textBoxInput" placeholder=" " />
                                    <label for="Aperture" class="textBoxLabel">Rekeszértéke</label>
                                </div>
                                <div class="textBox">
                                    <input type="text" id="FocalLength" class="textBoxInput" placeholder=" " />
                                    <label for="FocalLength" class="textBoxLabel">Fókusztávolság (focal length)</label>
                                </div>
                                <div class="textBox">
                                    <input type="text" id="OIS" class="textBoxInput" placeholder=" " />
                                    <label for="OIS" class="textBoxLabel">Optikai képstabilizátor (OIS)</label>
                                </div>
                                <div class="textBox">
                                    <input type="text" id="cameraType" class="textBoxInput" placeholder=" " />
                                    <label for="cameraType" class="textBoxLabel">kameratípus</label>
                                </div>

                            </div>
                        </div>
    `;

    place.appendChild(cameraCard);
}

function modifyCameraName(inputElement) {
    const wrapper = inputElement.closest('.dropdown');
    const nameDisplay = wrapper.querySelector('.cameraDropdownName');
    if (nameDisplay) {
        nameDisplay.innerText = inputElement.value || "Új Kamera";
    }
}

function removeCameraCard(button) {
    const card = button.closest(".camera-card");
    if (card) {
        card.remove();
    }
}


function getValues() {
    //ramstorage
    const ramValues = Array.from(document.querySelectorAll(".RAMAmount")).map(input =>
        parseInt(input.value) || 0
    );
    const storageValues = Array.from(document.querySelectorAll(".StorageAmount")).map(input =>
        parseInt(input.value) || 0
    );
    let ramStorageIDs = [];
    for (let i = 0; i < ramValues.length; i++) {
        ramStorageIDs.push(0)
    }

    //colors
    const colorNames = Array.from(document.querySelectorAll(".colorName")).map(input =>
        input.value || ""
    );
    const hexValues = Array.from(document.querySelectorAll(".colorHEX")).map(input =>
        "#" + input.value || ""
    );
    let colorIDs = [];
    for (let i = 0; i < colorNames.length; i++) {
        colorIDs.push(0)
    }

    //camera
    const cameraName = Array.from(document.querySelectorAll(".CameraName")).map(input =>
        parseInt(input.value) || 0
    );
    const cameraResolution = Array.from(document.querySelectorAll(".CameraResolution")).map(input =>
        parseInt(input.value) || 0
    );
    const cameraAperture = Array.from(document.querySelectorAll(".Aperture")).map(input =>
        parseInt(input.value) || 0
    );
    const cameraFocalLength = Array.from(document.querySelectorAll(".FocalLength")).map(input =>
        parseInt(input.value) || 0
    );
    const cameraOIS = Array.from(document.querySelectorAll(".OIS")).map(input =>
        parseInt(input.value) || 0
    );
    const cameraType = Array.from(document.querySelectorAll(".cameraType")).map(input =>
        parseInt(input.value) || 0
    );
    let cameraIDs = [];
    let cameraTypeIDs = [];

    for (let i = 0; i < cameraName.length; i++) {
        colorIDs.push(0)
    }
    for (let i = 0; i < cameraType.length; i++) {
        colorIDs.push(0)
    }

    PhonePOST(ramValues, storageValues, ramStorageIDs, colorNames, hexValues, colorIDs, cameraName, cameraResolution, cameraAperture, cameraFocalLength, cameraOIS, cameraType, cameraIDs, cameraTypeIDs)
}



//ÚJ TELEFONFELTÖLTÉS

function PhonePOST(ramValues, storageValues, ramStorageIDs, colorNames, hexValues, colorIDs, cameraName, cameraResolution, cameraAperture, cameraFocalLength, cameraOIS, cameraType, cameraIDs, cameraTypeIDs) {
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
        connectionDualSim: document.getElementById("DualSIM").value || "nincs",
        connectionESim: document.getElementById("ESIM").value || "nincs",
        connectionNfc: document.getElementById("NFC").value || "nincs",
        connectionConnectionSpeed: parseInt(document.getElementById("ConnectorSpeed").value) || 0,
        connectionJack: document.getElementById("Jack").value || "nincs",
        sensorsInfrared: document.getElementById("Infrared").value || "nincs",
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
        speakerType: document.getElementById("speaker").value || "",
        phoneWeight: document.getElementById("weight").value || 0.0,

        // Complex nested data
        ramStorage: {
            ID: ramStorageIDs,
            ramAmount: ramValues,
            storageAmount: storageValues
        },
        Color: {
            ID: colorIDs,
            colorName: colorNames,
            colorHex: hexValues
        },
        Camera: {
            ID: cameraIDs,
            cameraName: cameraName,
            cameraResolution: cameraResolution,
            cameraAperture: cameraAperture,
            cameraFocalLength: cameraFocalLength,
            cameraOIS: cameraOIS
        },
        CameraType: {
            ID: cameraTypeIDs,
            cameraType: cameraType
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
        })
        .catch(error => console.error("Error:", error));
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

function toggleDropdown(header) {
    const content = header.nextElementSibling;

    if (content.classList.contains('open')) {
        content.style.height = content.scrollHeight + 'px';
        requestAnimationFrame(() => {
            content.style.height = '0';
            content.style.opacity = '0';
        });
        content.addEventListener('transitionend', () => {
            content.classList.remove('open');
            content.style.height = '';
        }, { once: true });
    } else {
        content.classList.add('open');
        content.style.height = '0';
        content.style.opacity = '0';
        requestAnimationFrame(() => {
            content.style.height = content.scrollHeight + 'px';
            content.style.opacity = '1';
        });
        content.addEventListener('transitionend', () => {
            content.style.height = '';
        }, { once: true });
    }
}

function updateCategoryBorder(dropdown) {
    const inputs = dropdown.querySelectorAll('.textBoxInput');
    let filledCount = 0;

    inputs.forEach(input => {
        if (input.value.trim() !== '') {
            filledCount++;
        }
    });

    const header = dropdown.querySelector('.dropdown-header');
    if (filledCount === 0) {
        header.style.borderColor = 'black';
    } else if (filledCount === inputs.length) {
        header.style.backgroundColor = 'rgb(112, 255, 117)'; // Green
        header.style.color = 'black';
    } else {
        header.style.backgroundColor = 'rgb(254, 219, 136)'; // Yellow
        header.style.color = 'black';
    }
}

//style="background-color: rgb(254, 219, 136); color: black;

function monitorInputs() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const inputs = dropdown.querySelectorAll('.textBoxInput');
        inputs.forEach(input => {
            input.addEventListener('input', () => updateCategoryBorder(dropdown));
        });
        updateCategoryBorder(dropdown); // Initial state
    });
}

// Observe new elements added to the body
const observer = new MutationObserver(() => {
    monitorInputs(); // Re-attach event listeners to new inputs
});

observer.observe(document.body, { childList: true, subtree: true });

// Run once initially for existing inputs
document.addEventListener('DOMContentLoaded', monitorInputs);

const imageInput = document.getElementById('imageInput');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');

imageInput.addEventListener('change', function () {
    Array.from(this.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = file.name;
            img.classList.add('image-preview');
            imagePreviewContainer.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
});

function showStoreAmount() {
    if (document.getElementById("InStore").checked) {
        document.getElementById("storeAmount").style.display = "block"
    }
    else {
        document.getElementById("storeAmount").style.display = "none"
    }
}

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

// Set initial state on load
window.addEventListener("DOMContentLoaded", function () {
    updateSpeakerLabel(document.getElementById("speakerTypeSwitch"));
});
