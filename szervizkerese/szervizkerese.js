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
        window.location.href = "./index.html";
    }, 1000);
}



// Call showUsername when the page loads
document.addEventListener("DOMContentLoaded", showUsername);


        function generateUniqueCode() {
            const now = new Date();
            const datePart = now.getFullYear().toString().slice(-2) +
                (now.getMonth() + 1).toString().padStart(2, '0') +
                now.getDate().toString().padStart(2, '0') +
                now.getHours().toString().padStart(2, '0') +
                now.getMinutes().toString().padStart(2, '0');
            const randomPart = Math.floor(1000 + Math.random() * 9000);
            return `PHNSCT-${datePart}-${randomPart}`;
        }

        document.getElementById('atvizsgalas').addEventListener('change', function () {
            document.getElementById('atvizsgalasInfo').style.display = this.checked ? 'block' : 'none';
        });

        document.getElementById('szervizForm').addEventListener('submit', function (e) {
            e.preventDefault();
            const atvizsgalas = document.getElementById('atvizsgalas').checked;
            const kod = generateUniqueCode();
            const feltetelLink = `<a href="../csomagolasfeltetelek.html" target="_blank" style="color:#17a2b8; text-decoration:underline;">ITT</a>`;
            if (atvizsgalas) {
                document.getElementById('formMessage').innerHTML =
                    `<div class="alert alert-info">
                    Kérését megkaptuk, és rögzítettük.<br>
                    <b>Ön <strong>Telefon átvizsgálást</strong> kért.</b><br>
                    <strong>Kérjük, küldje el telefonját postán a következő címre:</strong><br>
                    <b>Cím:</b> Miskolc, Palóczy László utca 3, 3525<br>
                    <b>Név:</b> PhoneScout Szerviz<br>
                    <b>Telefonszám:</b> +36 30 123 4567<br>
                    <b>Email:</b> info@phonescout.hu<br>
                    <br>
                    <b>Bevizsgálási kódja:</b> <span style="font-size:1.2em; color:#17a2b8;"><strong>${kod}</strong></span><br>
                    <b>Kérjük, a csomagba mellékelje:</b><br>
                    <ul>
                        <li>A nevet amit itt megadott,</li>
                        <li>A telefonszámot amit itt megadott,</li>
                        <li>A készüléket a csomagolási feltételeknek megfelelően becsomagolva (A feltételeket ${feltetelLink} megtalálja),</li>
                        <li>A bevizsgálási kódját. Az ön kódja: <strong>${kod}</strong></li>
                    </ul>
                    <br>
                </div>`;
            } else {
                document.getElementById('formMessage').innerHTML =
                    `<div class="alert alert-info">
                    Kérését megkaptuk, és rögzítettük.<br>
                    <strong>Kérjük, küldje el postán a következő címre:</strong><br>
                    <b>Cím:</b> Miskolc, Palóczy László utca 3, 3525<br>
                    <b>Név:</b> PhoneScout Szerviz<br>
                    <b>Telefonszám:</b> +36 30 123 4567<br>
                    <b>Email:</b> info@phonescout.hu<br>
                    <br>
                    <b>Bevizsgálási kódja:</b> <span style="font-size:1.2em; color:#17a2b8;"><strong>${kod}</strong></span><br>
                    <b>Kérjük, a csomagba mellékelje:</b><br>
                    <ul>
                        <li>A nevet amit itt megadott,</li>
                        <li>A telefonszámot amit itt megadott,</li>
                        <li>A készüléket a csomagolási feltételeknek megfelelően becsomagolva (A feltételeket ${feltetelLink} megtalálja),</li>
                        <li>A bevizsgálási kódját. Az ön kódja: <strong>${kod}</strong></li>
                    </ul>
                    <br>
                </div>`;
            }
            this.reset();
            document.getElementById('atvizsgalasInfo').style.display = 'none';
        });