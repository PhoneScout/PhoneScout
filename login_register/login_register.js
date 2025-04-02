const apiUrl = "http://localhost:5287/api/auth";
const allPhonesURL = "http://localhost:5287/api/allPhones"; //ÚJ BACKEND


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