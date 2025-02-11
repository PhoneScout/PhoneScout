const apiUrl = "http://localhost:5287/api/auth";  // Adjust the port if necessary


// HTML content for Újdonságok (New Arrivals)
const newArrivalsContent = `
  <div id="carouselExample" class="carousel slide" data-bs-ride="carousel" data-bs-interval="20000">
            <div class="carousel-inner">
            <div class="carousel-item active">
                <div class="row">
                <div class="col-1 d-flex align-items-center">
                    <button class="carouselButton" data-bs-target="#carouselExample" data-bs-slide="prev">
                    <i class="fa-solid fa-arrow-left"></i>
                    </button>
                </div>

                <div class="col-2">
                    <div class="eventCard">
                        <div class="liveEvent">Élő esemény</div>
                        <div class="eventName">Event Name</div>
                        <img class="eventCompanyLogo" src="./Images/XiaomiLogo.png" alt="Product Image">            
                        <div class="eventDate">Dátum: 2025.05.04</div>

                        <div class="eventButton">
                                Nézd élőben!
                        </div>
                    </div>
                </div>

                <div class="col-2">
                    <div class="phoneCard">
                    <img class="phoneImage" src="./Images/image 3.png" alt="Product Image">
                    <div class="phoneName">Xiaomi 13T</div>
                    <div class="phonePrice">99.000 Ft</div>
                    <div class="phoneStock">Raktáron</div>

                    <div class="cardButtons">
                        <div class="button">
                        <img src="./Images/compare-removebg-preview 1.png" alt="Compare">
                        </div>
                        <div class="button">
                        <img src="./Images/cart-removebg-preview 1.png" alt="Cart">
                        </div>
                    </div>
                    </div>
                </div>
                <div class="col-2">
                    <div class="phoneCard">
                    <img class="phoneImage" src="./Images/image 3.png" alt="Product Image">
                    <div class="phoneName">Xiaomi 13T</div>
                    <div class="phonePrice">99.000 Ft</div>
                    <div class="phoneStock">Raktáron</div>

                    <div class="cardButtons">
                        <div class="button">
                        <img src="./Images/compare-removebg-preview 1.png" alt="Compare">
                        </div>
                        <div class="button">
                        <img src="./Images/cart-removebg-preview 1.png" alt="Cart">
                        </div>
                    </div>
                    </div>
                </div>
                <div class="col-2">
                    <div class="phoneCard">
                    <img class="phoneImage" src="./Images/image 3.png" alt="Product Image">
                    <div class="phoneName">Xiaomi 13T</div>
                    <div class="phonePrice">99.000 Ft</div>
                    <div class="phoneStock">Raktáron</div>

                    <div class="cardButtons">
                        <div class="button">
                        <img src="./Images/compare-removebg-preview 1.png" alt="Compare">
                        </div>
                        <div class="button">
                        <img src="./Images/cart-removebg-preview 1.png" alt="Cart">
                        </div>
                    </div>
                    </div>
                </div>
                <div class="col-2">
                    <div class="phoneCard">
                    <img class="phoneImage" src="./Images/image 3.png" alt="Product Image">
                    <div class="phoneName">Xiaomi 13T</div>
                    <div class="phonePrice">99.000 Ft</div>
                    <div class="phoneStock">Raktáron</div>

                    <div class="cardButtons">
                        <div class="button">
                        <img src="./Images/compare-removebg-preview 1.png" alt="Compare">
                        </div>
                        <div class="button">
                        <img src="./Images/cart-removebg-preview 1.png" alt="Cart">
                        </div>
                    </div>
                    </div>
                </div>

                <div class="col-1 d-flex align-items-center">
                    <button class="carouselButton" data-bs-target="#carouselExample" data-bs-slide="next">
                    <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
                </div>
            </div>
            <div class="carousel-item">
                <div class="row">
                <div class="col-1 d-flex align-items-center">
                    <button class="carouselButton" data-bs-target="#carouselExample" data-bs-slide="prev">
                    <i class="fa-solid fa-arrow-left"></i>
                    </button>
                </div>

                <div class="col-2">
                    <div class="phoneCard">
                    <img class="phoneImage" src="./Images/image 3.png" alt="Product Image">
                    <div class="phoneName">Xiaomi 13T</div>
                    <div class="phonePrice">99.000 Ft</div>
                    <div class="phoneStock">Raktáron</div>

                    <div class="cardButtons">
                        <div class="button">
                        <img src="./Images/compare-removebg-preview 1.png" alt="Compare">
                        </div>
                        <div class="button">
                        <img src="./Images/cart-removebg-preview 1.png" alt="Cart">
                        </div>
                    </div>
                    </div>
                </div>
                <div class="col-2">
                    <div class="phoneCard">
                                <img class="phoneImage" src="./Images/image 3.png" alt="Product Image">
                                <div class="phoneName">Xiaomi 13T</div>
                                <div class="phonePrice">99.000 Ft</div>
                                <div class="phoneStock">Raktáron</div>

                                <div class="cardButtons">
                                    <div class="button">
                                        <img src="./Images/compare-removebg-preview 1.png" alt="Compare">
                                    </div>
                                    <div class="button">
                                        <img src="./Images/cart-removebg-preview 1.png" alt="Cart">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-2">
                            <div class="phoneCard">
                                <img class="phoneImage" src="./Images/image 3.png" alt="Product Image">
                                <div class="phoneName">Xiaomi 13T</div>
                                <div class="phonePrice">99.000 Ft</div>
                                <div class="phoneStock">Raktáron</div>

                                <div class="cardButtons">
                                    <div class="button">
                                        <img src="./Images/compare-removebg-preview 1.png" alt="Compare">
                                    </div>
                                    <div class="button">
                                        <img src="./Images/cart-removebg-preview 1.png" alt="Cart">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-2">
                            <div class="phoneCard">
                                <img class="phoneImage" src="./Images/image 3.png" alt="Product Image">
                                <div class="phoneName">Xiaomi 13T</div>
                                <div class="phonePrice">99.000 Ft</div>
                                <div class="phoneStock">Raktáron</div>

                                <div class="cardButtons">
                                    <div class="button">
                                        <img src="./Images/compare-removebg-preview 1.png" alt="Compare">
                                    </div>
                                    <div class="button">
                                        <img src="./Images/cart-removebg-preview 1.png" alt="Cart">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-2">
                            <div class="phoneCard">
                                <img class="phoneImage" src="./Images/image 3.png" alt="Product Image">
                                <div class="phoneName">Xiaomi 13T</div>
                                <div class="phonePrice">99.000 Ft</div>
                                <div class="phoneStock">Raktáron</div>

                                <div class="cardButtons">
                                    <div class="button">
                                        <img src="./Images/compare-removebg-preview 1.png" alt="Compare">
                                    </div>
                                    <div class="button">
                                        <img src="./Images/cart-removebg-preview 1.png" alt="Cart">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-1">
                            <button class="carouselButton" data-bs-target="#carouselExample" data-bs-slide="next">
                                <i class="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
`;

// HTML content for Legnépszerűbbek (Popular Items)
const popularContent = `
  <div id="carouselExample" class="carousel slide" data-bs-ride="carousel" data-bs-interval="20000">
            <div class="carousel-inner">
            <div class="carousel-item active">
                <div class="row">
                <div class="col-1 d-flex align-items-center">
                    <button class="carouselButton" data-bs-target="#carouselExample" data-bs-slide="prev">
                    <i class="fa-solid fa-arrow-left"></i>
                    </button>
                </div>

                <div class="col-2">
                    <div class="phoneCard">
                    <img class="phoneImage" src="./Images/14t.png" alt="Product Image">
                    <div class="phoneName">Xiaomi 14T</div>
                    <div class="phonePrice">99.000 Ft</div>
                    <div class="phoneStock">Raktáron</div>

                    <div class="cardButtons">
                        <div class="button">
                        <img src="./Images/compare-removebg-preview 1.png" alt="Compare">
                        </div>
                        <div class="button">
                        <img src="./Images/cart-removebg-preview 1.png" alt="Cart">
                        </div>
                    </div>
                    </div>
                </div>
                <div class="col-2">
                    <div class="phoneCard">
                    <img class="phoneImage" src="./Images/14t.png" alt="Product Image">
                    <div class="phoneName">Xiaomi 14T</div>
                    <div class="phonePrice">99.000 Ft</div>
                    <div class="phoneStock">Raktáron</div>

                    <div class="cardButtons">
                        <div class="button">
                        <img src="./Images/compare-removebg-preview 1.png" alt="Compare">
                        </div>
                        <div class="button">
                        <img src="./Images/cart-removebg-preview 1.png" alt="Cart">
                        </div>
                    </div>
                    </div>
                </div>
                <div class="col-2">
                    <div class="phoneCard">
                    <img class="phoneImage" src="./Images/14t.png" alt="Product Image">
                    <div class="phoneName">Xiaomi 14T</div>
                    <div class="phonePrice">99.000 Ft</div>
                    <div class="phoneStock">Raktáron</div>

                    <div class="cardButtons">
                        <div class="button">
                        <img src="./Images/compare-removebg-preview 1.png" alt="Compare">
                        </div>
                        <div class="button">
                        <img src="./Images/cart-removebg-preview 1.png" alt="Cart">
                        </div>
                    </div>
                    </div>
                </div>
                <div class="col-2">
                    <div class="phoneCard">
                    <img class="phoneImage" src="./Images/14t.png" alt="Product Image">
                    <div class="phoneName">Xiaomi 14T</div>
                    <div class="phonePrice">99.000 Ft</div>
                    <div class="phoneStock">Raktáron</div>

                    <div class="cardButtons">
                        <div class="button">
                        <img src="./Images/compare-removebg-preview 1.png" alt="Compare">
                        </div>
                        <div class="button">
                        <img src="./Images/cart-removebg-preview 1.png" alt="Cart">
                        </div>
                    </div>
                    </div>
                </div>
                <div class="col-2">
                    <div class="phoneCard">
                    <img class="phoneImage" src="./Images/14t.png" alt="Product Image">
                    <div class="phoneName">Xiaomi 14T</div>
                    <div class="phonePrice">99.000 Ft</div>
                    <div class="phoneStock">Raktáron</div>

                    <div class="cardButtons">
                        <div class="button">
                        <img src="./Images/compare-removebg-preview 1.png" alt="Compare">
                        </div>
                        <div class="button">
                        <img src="./Images/cart-removebg-preview 1.png" alt="Cart">
                        </div>
                    </div>
                    </div>
                </div>

                <div class="col-1 d-flex align-items-center">
                    <button class="carouselButton" data-bs-target="#carouselExample" data-bs-slide="next">
                    <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
                </div>
            </div>
            <div class="carousel-item">
                <div class="row">
                <div class="col-1 d-flex align-items-center">
                    <button class="carouselButton" data-bs-target="#carouselExample" data-bs-slide="prev">
                    <i class="fa-solid fa-arrow-left"></i>
                    </button>
                </div>

                <div class="col-2">
                    <div class="phoneCard">
                    <img class="phoneImage" src="./Images/14t.png" alt="Product Image">
                    <div class="phoneName">Xiaomi 14T</div>
                    <div class="phonePrice">99.000 Ft</div>
                    <div class="phoneStock">Raktáron</div>

                    <div class="cardButtons">
                        <div class="button">
                        <img src="./Images/compare-removebg-preview 1.png" alt="Compare">
                        </div>
                        <div class="button">
                        <img src="./Images/cart-removebg-preview 1.png" alt="Cart">
                        </div>
                    </div>
                    </div>
                </div>
                <div class="col-2">
                    <div class="phoneCard">
                                <img class="phoneImage" src="./Images/14t.png" alt="Product Image">
                                <div class="phoneName">Xiaomi 14T</div>
                                <div class="phonePrice">99.000 Ft</div>
                                <div class="phoneStock">Raktáron</div>

                                <div class="cardButtons">
                                    <div class="button">
                                        <img src="./Images/compare-removebg-preview 1.png" alt="Compare">
                                    </div>
                                    <div class="button">
                                        <img src="./Images/cart-removebg-preview 1.png" alt="Cart">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-2">
                            <div class="phoneCard">
                                <img class="phoneImage" src="./Images/image 3.png" alt="Product Image">
                                <div class="phoneName">Xiaomi 14T</div>
                                <div class="phonePrice">99.000 Ft</div>
                                <div class="phoneStock">Raktáron</div>

                                <div class="cardButtons">
                                    <div class="button">
                                        <img src="./Images/compare-removebg-preview 1.png" alt="Compare">
                                    </div>
                                    <div class="button">
                                        <img src="./Images/cart-removebg-preview 1.png" alt="Cart">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-2">
                            <div class="phoneCard">
                                <img class="phoneImage" src="./Images/image 3.png" alt="Product Image">
                                <div class="phoneName">Xiaomi 14T</div>
                                <div class="phonePrice">99.000 Ft</div>
                                <div class="phoneStock">Raktáron</div>

                                <div class="cardButtons">
                                    <div class="button">
                                        <img src="./Images/compare-removebg-preview 1.png" alt="Compare">
                                    </div>
                                    <div class="button">
                                        <img src="./Images/cart-removebg-preview 1.png" alt="Cart">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-2">
                            <div class="phoneCard">
                                <img class="phoneImage" src="./Images/image 3.png" alt="Product Image">
                                <div class="phoneName">Xiaomi 14T</div>
                                <div class="phonePrice">99.000 Ft</div>
                                <div class="phoneStock">Raktáron</div>

                                <div class="cardButtons">
                                    <div class="button">
                                        <img src="./Images/compare-removebg-preview 1.png" alt="Compare">
                                    </div>
                                    <div class="button">
                                        <img src="./Images/cart-removebg-preview 1.png" alt="Cart">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-1">
                            <button class="carouselButton" data-bs-target="#carouselExample" data-bs-slide="next">
                                <i class="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
`;

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



//Bejelentkezés


async function register() {
    const username = document.getElementById("registerUsername").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    const response = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    });

    const data = await response.text();
    document.getElementById("alertReg").innerText = data;
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
            document.getElementById("alertLog").innerText = `Login successful! Welcome ${username}`;

            // Redirect to index.html and force refresh
            setTimeout(() => {
                window.location.href = "index.html"; // Redirect back
            }, 1000); // Small delay for better UX
        } else {
            document.getElementById("alertLog").innerText = "Login failed.";
        }
    } catch (error) {
        console.error("Login error:", error);
        document.getElementById("alertLog").innerText = "An error occurred.";
    }
}




async function accessProtectedResource() {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
        document.getElementById("response").innerText = "Please log in first.";
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
    alert("Logged out successfully!");
    setTimeout(() => {
        window.location.href = "index.html"; // Redirect back
    }, 1000);
}



function showUsername() {
    const username = localStorage.getItem("username");
    if (username) {
        document.getElementById("userName").innerText = username;
    }
}

// Call showUsername when the page loads
document.addEventListener("DOMContentLoaded", showUsername);
