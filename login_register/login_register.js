const apiUrl = "http://localhost:5287/api/auth";
const allPhonesURL = "http://localhost:5287/api/allPhones"; // ÚJ BACKEND

// Regisztráció
async function register() {
    const lastname = document.getElementById("registerLastName").value;
    const firstname = document.getElementById("registerFirstName").value;
    const middlename = document.getElementById("registerMiddleName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const passwordFix = document.getElementById("registerPasswordAgain").value;
    const postalcode = document.getElementById("registerPostalCode").value;
    const city = document.getElementById("registerCity").value;
    const street = document.getElementById("registerStreet").value;
    const houseNumber = document.getElementById("registerHouseNumber").value;
    const phoneNumber = document.getElementById("registerPhoneNU").value;

    // Fix: define jogosultsag in proper scope
    let jogosultsag = (username === "admin") ? 1 : 0;

    if (password === passwordFix) {
        try {
            const response = await fetch(`${apiUrl}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lastname, firstname, middlename,  email, password, postalcode, city, street, houseNumber, phoneNumber, jogosultsag })
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
            }

        } catch (error) {
            console.error("Registration error:", error);
            document.getElementById("alertReg").innerText = "Hiba lépett fel regisztráció közben. Próbáld újra";
            document.getElementById("alertReg").style.color = "red";
        }

        // Clear password fields
        document.getElementById("registerPassword").value = "";
        document.getElementById("registerPasswordAgain").value = "";

    } else {
        document.getElementById("alertReg").innerText = "A két megadott jelszavad nem egyezik!";
        document.getElementById("alertReg").style.color = "red";
        document.getElementById("registerPassword").value = "";
        document.getElementById("registerPasswordAgain").value = "";
    }
}

// Bejelentkezés
async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch(`${apiUrl}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.token) {
            localStorage.setItem("jwtToken", data.token);
            localStorage.setItem("firstname", firstname);

            const decoded = parseJwt(data.token);
            if (decoded && decoded.Jogosultsag !== undefined) {
                localStorage.setItem("jogosultsag", decoded.Jogosultsag);
            }

            document.getElementById("alertLog").innerText = `Sikeres bejelentkezés! Üdvözlünk ${firstname}`;
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

// JWT dekódoló
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("JWT parsing error:", e);
        return null;
    }
}

// Védett erőforrás elérése
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

// Kijelentkezés
function logout() {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("firstname");
    localStorage.removeItem("jogosultsag");
    alert("Sikeres kijelentkezés!");
    setTimeout(() => {
        window.location.href = "../index.html";
    }, 1000);
}
