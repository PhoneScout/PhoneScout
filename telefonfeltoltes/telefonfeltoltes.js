const apiUrl = "http://localhost:5287/api/auth";
const allPhonesURL = "http://localhost:5287/api/allPhones"; //ÚJ BACKEND
//const allPhonesURL = "http://localhost:5287/api/Phone"; // RÉGI BACKEND

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


//ÚJ TELEFONFELTÖLTÉS

function PhonePOST() {
    const phoneDataPOST = {
        PhoneNev: document.getElementById("PhoneName").value || "",
        Ar: document.getElementById("Price").value || 0,
        Raktaron: document.getElementById("InStore").value || "",
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

