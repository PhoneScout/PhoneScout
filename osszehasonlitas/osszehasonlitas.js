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
    console.log("previouspages");

    console.log(previousPages);

    let name = line.textContent.split("\n");
    if (name.length != 1) {
        console.log(name[name.length - 2].trim());
        alert("alma");
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



document.addEventListener("DOMContentLoaded", async function () {
    //ide kell majd az új végpont vagy mi a gyász
    let allPhonesData = [];
    async function fetchAllPhones() {
        try {
            const res = await fetch("http://localhost:5165/api/GETcomparePage");
            if (res.ok) {
                allPhonesData = await res.json();
            } else {
                allPhonesData = [];
            }
        } catch (e) {
            allPhonesData = [];
        }
    }
    await fetchAllPhones();
    // Mostantól az összes telefon elérhető az allPhonesData tömbben

    const comparePhones = JSON.parse(localStorage.getItem("comparePhones") || "[]");
    const compareResult = document.getElementById("compareResult");
    const filterPanel = document.getElementById("filterPanel");

    // Csoportosított tulajdonságok
    const groupedProps = [
        {
            group: "Általános",
            props: [
                { label: "Ár", key: "phonePrice", format: v => v ? v + " Ft" : "-" },
                { label: "Készleten", key: "phoneInStore" }
            ]
        },
        {
            group: "Kijelző",
            props: [
                {
                    label: "Felbontás",
                    key: "phoneResolution",
                    format: (v, phone) => {
                        // phoneResolutionWidth és phoneResolutionHeight-ból rakjuk össze
                        const w = phone.phoneResolutionWidth || "-";
                        const h = phone.phoneResolutionHeight || "-";
                        return `${w} x ${h}`;
                    }
                },
                { label: "Kijelző méret", key: "screenSize" },
                { label: "Kijelző max fényerő", key: "screenMaxBrightness" },
                { label: "Kijelző élesség", key: "screenSharpness" },
                { label: "Kijelző típusa", key: "screenType" }
            ]
        },
        {
            group: "CPU",
            props: [
                { label: "CPU név", key: "cpuName" },
                { label: "Antutu pontszám", key: "phoneAntutu" },
                { label: "CPU max órajel", key: "cpuMaxClockSpeed" },
                { label: "CPU magok száma", key: "cpuCoreNumber" },
                { label: "CPU gyártástechnológia", key: "cpuManufacturingTechnology" }
            ]
        },
        {
            group: "RAM",
            props: [
                { label: "RAM mennyiség", key: "ramAmount" },
                { label: "RAM sebesség", key: "ramSpeed" }
            ]
        },
        {
            group: "Tárhely",
            props: [
                { label: "Tárhely mennyiség", key: "storageAmount" },
                { label: "Tárhely sebesség", key: "storageSpeed" }
            ]
        },
        {
            group: "Akkumulátor",
            props: [
                { label: "Akkumulátor kapacitás", key: "batteryCapacity" },
                { label: "Max töltés (vezetékes)", key: "batteryMaxChargingWired" },
                { label: "Max töltés (vezetéknélküli)", key: "batteryMaxChargingWireless" }
            ]
        },
        {
            group: "Kapcsolatok",
            props: [
                { label: "Max WiFi", key: "connectionMaxWifi" },
                { label: "Max Bluetooth", key: "connectionMaxBluetooth" },
                { label: "Max Mobilhálózat", key: "connectionMaxMobileNetwork" }
            ]
        },
        {
            group: "Kamerák",
            props: [
                { label: "Kamerák nevei", key: "cameraNames" },
                { label: "Kamerák felbontása", key: "cameraResolutions" },
                { label: "Kamerák rekeszértéke", key: "cameraApertures" },
                { label: "Kamerák fókusztávolsága", key: "cameraFocalLengths" },
                { label: "Kamerák OIS", key: "cameraOISValues" },
                { label: "Kamera típusok", key: "cameraTypes" }
            ]
        },
        {
            group: "Szenzorok",
            props: [
                { label: "Ujjlenyomat helye", key: "sensorsFingerprintPlace" },
                { label: "Ujjlenyomat típusa", key: "sensorsFingerprintType" },
                { label: "Vízállóság", key: "waterproofType" }
            ]
        }
    ];

    if (!comparePhones.length) {
        compareResult.textContent = "Nincs kiválasztott telefon az összehasonlításhoz.";
        if (filterPanel) filterPanel.innerHTML = "";
    }

    // Egyesével lekérjük a telefonokat, majd összegyűjtjük őket
    const phoneRequests = comparePhones.map(id =>
        fetch(`http://localhost:5165/api/GETcomparePage/${id}`)
            .then(res => res.ok ? res.json() : null)
            .catch(() => null)
    );

    // Várjuk meg az összes lekérést
    const phonesRaw = await Promise.all(phoneRequests);
    // Ha a backend egy tömböt ad vissza, flatten; ha objektumot, csak simán
    const phones = phonesRaw.flatMap(p => Array.isArray(p) ? p : (p ? [p] : []));

    if (!phones.length) {
        compareResult.textContent = "A kiválasztott telefon(ok) nem található(k).";
        if (filterPanel) filterPanel.innerHTML = "";
    }

    // Ezeket a property-ket nem lehet bepipálni (nem számban mérhetőek)
    const nonNumericProps = [
        "cameraNames",
        "screenType",
        "cpuName",
        "cameraTypes",
        "sensorsFingerprintPlace",
        "sensorsFingerprintType"
    ];

    // Szűrőpanel generálása
    let highlightDifferences = false;
    let filterHtml = `
    <div class="filter-option mb-2">
        <input type="checkbox" id="highlightDifferences" ${highlightDifferences ? "checked" : ""}>
        <label for="highlightDifferences" style="user-select:none;cursor:pointer;">Különbségek kiemelése</label>
    </div>
    `;

    filterHtml += `<div class="filter-title h5 mb-3">Kiemelés szűrő</div>`;
    groupedProps.forEach((group, idx) => {
        const dropdownId = `filter-group-dropdown-${idx}`;
        filterHtml += `
        <div class="filter-group-dropdown">
            <button type="button" class="filter-group-toggle" data-target="${dropdownId}">
                ${group.group} <span class="dropdown-arrow">&#9660;</span>
            </button>
            <div class="filter-group-content" id="${dropdownId}">
        `;
        group.props.forEach(prop => {
            const checkboxId = `filter-${group.group}-${prop.key}`;
            const isDisabled = nonNumericProps.includes(prop.key);
            filterHtml += `<div class="filter-option">
                <input type="checkbox" class="filter-checkbox" id="${checkboxId}" data-key="${prop.key}" ${isDisabled ? "disabled" : ""}>
                <label for="${checkboxId}"${isDisabled ? ' style="color:#aaa;cursor:not-allowed;" title="Nem összehasonlítható adat/infó"' : ""}>${prop.label}</label>
            </div>`;
        });
        filterHtml += `</div></div>`;
    });
    filterPanel.innerHTML = filterHtml;

    filterPanel.querySelectorAll('.filter-group-toggle').forEach(btn => {
        btn.addEventListener('click', function () {
            const target = document.getElementById(this.dataset.target);
            target.classList.toggle('open');
            this.querySelector('.dropdown-arrow').innerHTML = target.classList.contains('open') ? "&#9650;" : "&#9660;";
        });
    });

    // Különbségek kiemelése checkbox eseménykezelő
    document.getElementById("highlightDifferences").addEventListener("change", function () {
        highlightDifferences = this.checked;
        renderCards();
    });

    // Kiemelés logika
    // Csak property-k vannak a selectedFilters-ben
    let selectedFilters = new Set();

    // Módosított: property-khez hozzárendeljük, hogy min vagy max a "jobb"
    const highlightMode = {
        phonePrice: "min",
        phoneWeight: "min",
        phoneResolution: "max",
        screenSize: "max",
        screenMaxBrightness: "max",
        screenSharpness: "max",
        phoneAntutu: "max",
        cpuMaxClockSpeed: "max",
        cpuCoreNumber: "max",
        cpuManufacturingTechnology: "max",
        ramAmount: "max",
        ramSpeed: "max",
        storageAmount: "max",
        storageSpeed: "max",
        batteryCapacity: "max",
        batteryMaxChargingWired: "max",
        batteryMaxChargingWireless: "max",
        connectionMaxWifi: "max",
        connectionMaxBluetooth: "max",
        connectionMaxMobileNetwork: "max"
        // ha kell még, ide írj property-t
    };

    function renderCards() {
        let rowClass = "compare-cards-row";
        if (phones.length > 2) rowClass += " scrollable-row";

        // Csak a kijelölt property-khez számoljuk a maxot/min-t
        const extremeValues = {};
        groupedProps.forEach(group => {
            group.props.forEach(prop => {
                if (!selectedFilters.has(prop.key)) return;
                let extreme = null;
                phones.forEach(phone => {
                    let value;
                    if (prop.format) {
                        value = prop.format(phone[prop.key], phone);
                    } else {
                        value = phone[prop.key];
                    }
                    // Próbáljuk számmá alakítani (csak ha van értelme)
                    let num = null;
                    if (typeof value === "string") {
                        if (value.match(/^\d+\s*x\s*\d+$/)) {
                            const [w, h] = value.split("x").map(s => parseInt(s.trim(), 10));
                            if (!isNaN(w) && !isNaN(h)) num = w * h;
                        } else {
                            const m = value.replace(/[^\d.]/g, "");
                            if (m && !isNaN(m)) num = parseFloat(m);
                        }
                    } else if (typeof value === "number") {
                        num = value;
                    }
                    if (num !== null && !isNaN(num)) {
                        if (highlightMode[prop.key] === "min") {
                            if (extreme === null || num < extreme) extreme = num;
                        } else {
                            if (extreme === null || num > extreme) extreme = num;
                        }
                    }
                });
                if (extreme !== null) extremeValues[prop.key] = extreme;
            });
        });

        let html = `<div class="compare-cards-wrapper"><div class="${rowClass}">`;
        html += `<div class="empty-col"></div>`;
        phones.forEach(phone => {
            html += `<div class="compare-card">`;
            html += `<div class="compare-card-title">${phone.phoneName || "-"}</div>`;
            html += `<div class="compare-card-parts">`;
            groupedProps.forEach(group => {
                html += `<div class="compare-part-group"><div class="compare-part-group-title">${group.group}</div>`;
                group.props.forEach(prop => {
                    let value;
                    if (prop.format) {
                        value = prop.format(phone[prop.key], phone);
                    } else {
                        value = phone[prop.key];
                    }
                    if (value === undefined || value === null || value === "") value = "-";

                    let highlightClass = "";
                    let displayValue = value;

                    if (selectedFilters.has(prop.key)) {
                        // Tömbös értékeknél (kamera) minden értéket külön vizsgálunk
                        if (typeof value === "string" && value.includes(",") && prop.key.startsWith("camera")) {
                            const vals = value.split(",").map(v => v.trim());
                            displayValue = vals.map(v => {
                                let num = null;
                                const m = v.replace(/[^\d.]/g, "");
                                if (m && !isNaN(m)) num = parseFloat(m);
                                if (num !== null && !isNaN(num) && extremeValues[prop.key] !== undefined) {
                                    if (num === extremeValues[prop.key]) {
                                        return `<span class="highlight-green">${v}</span>`;
                                    } else {
                                        return `<span class="highlight-orange">${v}</span>`;
                                    }
                                }
                                return v;
                            }).join(", ");
                        } else {
                            let num = null;
                            if (typeof value === "string") {
                                if (value.match(/^\d+\s*x\s*\d+$/)) {
                                    const [w, h] = value.split("x").map(s => parseInt(s.trim(), 10));
                                    if (!isNaN(w) && !isNaN(h)) num = w * h;
                                } else {
                                    const m = value.replace(/[^\d.]/g, "");
                                    if (m && !isNaN(m)) num = parseFloat(m);
                                }
                            } else if (typeof value === "number") {
                                num = value;
                            }
                            if (num !== null && !isNaN(num) && extremeValues[prop.key] !== undefined) {
                                if (num === extremeValues[prop.key]) {
                                    highlightClass = "highlight-green";
                                } else {
                                    highlightClass = "highlight-orange";
                                }
                                displayValue = `<span class="${highlightClass}">${value}</span>`;
                            }
                        }
                    }


                    let diffStyle = "";
                    if (highlightDifferences) {
                        // Megnézzük, hogy minden telefonban ugyanaz-e az érték
                        const values = phones.map(p => {
                            if (prop.format) return prop.format(p[prop.key], p);
                            return p[prop.key];
                        });
                        const allEqual = values.every(v => v == values[0]);
                        if (!allEqual) diffStyle = ' style="background:#f0f0f0;"';
                    }

                    html += `<div class="compare-part"${diffStyle}><span class="compare-part-label">${prop.label}:</span> <span class="compare-part-value">${displayValue}</span></div>`;
                });
                html += `</div>`;
            });
            html += `</div></div>`;
        });
        html += `<div class="empty-col"></div>`;
        html += `</div></div>`;

        compareResult.innerHTML = html;
    }

    // Szűrő checkboxok eseménykezelője
    filterPanel.querySelectorAll('.filter-checkbox').forEach(cb => {
        cb.addEventListener('change', function () {
            const key = this.dataset.key;
            if (this.checked) {
                selectedFilters.add(key);
            } else {
                selectedFilters.delete(key);
            }
            renderCards();
        });
    });

    // Kezdeti render
    selectedFilters = new Set();
    renderCards();

    const modalHtml = `
    <div id="addPhoneModal" class="modal" style="display:none; position:fixed; z-index:1000; left:0; top:0; width:100vw; height:100vh; background:rgba(0,0,0,0.4); align-items:center; justify-content:center;">
        <div style="
            background:#fff; 
            padding:24px; 
            border-radius:8px; 
            width:40vw; 
            min-width:320px; 
            max-width:40vw; 
            height:70vh; 
            max-height:70vh; 
            overflow:auto; 
            position:relative;
            display:flex;
            flex-direction:column;
        ">
            <button id="closeModalBtn" style="position:absolute; right:12px; top:12px; background:none; border:none; font-size:1.5em; cursor:pointer;">&times;</button>
            <h4>Telefonok listája</h4>
            <input id="modalPhoneSearch" type="text" class="form-control mb-3" placeholder="Keresés név alapján...">
            <div id="modalPhoneList" style="flex:1 1 0; overflow:auto;"></div>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHtml);

    // Segédfüggvény a telefonlista rendereléséhez keresővel
    function renderModalPhoneList(filter = "") {
        let comparePhones = JSON.parse(localStorage.getItem("comparePhones") || "[]");
        const filterLower = filter.trim().toLowerCase();

        let filteredPhones = allPhonesData;
        if (filterLower) {
            filteredPhones = allPhonesData.filter(phone =>
                phone.phoneName && phone.phoneName.toLowerCase().includes(filterLower)
            );
        }

        if (filteredPhones.length === 0) {
            return `<p>Nincs találat.</p>`;
        }

        return `
            <table style="width:100%; border-collapse:collapse;">
                <thead>
                    <tr>
                        <th style="text-align:left; padding:4px;">Név</th>
                        <th style="text-align:left; padding:4px;"></th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredPhones.map(phone => {
            const idStr = String(phone.phoneID);
            const alreadyAdded = comparePhones.includes(phone.phoneID) || comparePhones.includes(idStr);
            return `
                            <tr>
                                <td style="padding:4px;">${phone.phoneName}</td>
                                <td style="padding:4px;">
                                    <button class="btn btn-sm btn-danger remove-from-compare-btn" data-id="${idStr}" ${alreadyAdded ? "" : "disabled"}>Eltávolítás</button>
                                    ${alreadyAdded
                    ? `<button class="btn btn-sm btn-success add-to-compare-btn" data-id="${idStr}" disabled>Hozzáadva</button>`
                    : `<button class="btn btn-sm btn-success add-to-compare-btn" data-id="${idStr}">Hozzáadás</button>`
                }
                                </td>
                            </tr>
                        `;
        }).join("")}
                </tbody>
            </table>
        `;
    }

    // Gomb eseménykezelő
    document.getElementById("addPhoneBtn").addEventListener("click", function () {
        const modal = document.getElementById("addPhoneModal");
        const modalPhoneList = document.getElementById("modalPhoneList");
        const modalPhoneSearch = document.getElementById("modalPhoneSearch");

        // Friss comparePhones minden modal nyitáskor
        modalPhoneList.innerHTML = renderModalPhoneList();

        // Kereső eseménykezelő
        modalPhoneSearch.value = "";
        modalPhoneSearch.oninput = function () {
            modalPhoneList.innerHTML = renderModalPhoneList(this.value);
            attachModalPhoneListButtonEvents();
        };

        // Gombok eseménykezelőit külön függvénybe tesszük, hogy kereséskor is újra lehessen őket kötni
        function attachModalPhoneListButtonEvents() {
            modalPhoneList.querySelectorAll('.add-to-compare-btn').forEach(btn => {
                btn.addEventListener('click', function () {
                    const id = this.getAttribute('data-id');
                    let comparePhones = JSON.parse(localStorage.getItem("comparePhones") || "[]");
                    if (!comparePhones.includes(id)) {
                        comparePhones.push(id);
                        localStorage.setItem("comparePhones", JSON.stringify(comparePhones));
                        // Frissítsük a modal tartalmát, hogy a gombok állapota is frissüljön
                        modalPhoneList.innerHTML = renderModalPhoneList(modalPhoneSearch.value);
                        attachModalPhoneListButtonEvents();
                    }
                });
            });
            modalPhoneList.querySelectorAll('.remove-from-compare-btn').forEach(btn => {
                btn.addEventListener('click', function () {
                    const id = this.getAttribute('data-id');
                    let comparePhones = JSON.parse(localStorage.getItem("comparePhones") || "[]");
                    comparePhones = comparePhones.filter(cid => String(cid) !== id);
                    localStorage.setItem("comparePhones", JSON.stringify(comparePhones));
                    // Frissítsük a modal tartalmát, hogy a gombok állapota is frissüljön
                    modalPhoneList.innerHTML = renderModalPhoneList(modalPhoneSearch.value);
                    attachModalPhoneListButtonEvents();
                });
            });
        }
        attachModalPhoneListButtonEvents();

        modal.style.display = "flex";
    });

    // Modal bezárás
    document.getElementById("closeModalBtn").onclick = function () {
        document.getElementById("addPhoneModal").style.display = "none";
        location.reload(); // Modal bezáráskor frissítjük az oldalt
    };
    // Modal bezárás háttérre kattintva
    document.getElementById("addPhoneModal").addEventListener("click", function (e) {
        if (e.target === this) {
            this.style.display = "none";
            location.reload(); // Modal bezáráskor frissítjük az oldalt
        }
    });
});

// Nyilak kezelése (marad)
document.addEventListener("DOMContentLoaded", function () {
    const leftBtn = document.getElementById('scrollLeft');
    const rightBtn = document.getElementById('scrollRight');
    function getScrollableRow() {
        return document.querySelector('.compare-cards-row.scrollable-row');
    }
    leftBtn.addEventListener('click', function () {
        const row = getScrollableRow();
        if (row) row.scrollBy({ left: -350, behavior: 'smooth' });
    });
    rightBtn.addEventListener('click', function () {
        const row = getScrollableRow();
        if (row) row.scrollBy({ left: 350, behavior: 'smooth' });
    });
    function toggleArrows() {
        const row = getScrollableRow();
        const show = !!row;
        leftBtn.style.display = show ? 'flex' : 'none';
        rightBtn.style.display = show ? 'flex' : 'none';
    }
    const observer = new MutationObserver(toggleArrows);
    observer.observe(document.getElementById('compareResult'), { childList: true, subtree: true });
    toggleArrows();
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
        window.location.href = "./osszehasonlitas.html";
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