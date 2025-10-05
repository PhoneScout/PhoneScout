const allPhoneNameURL = "http://localhost:5165/api/GETphoneNames"; //ÚJ BACKEND



// Initialize history: load from storage, or start with Főoldal
let previousPages = JSON.parse(localStorage.getItem("pagesHistory")) || [
    { pageName: "Főoldal", pageURL: "../fooldal/index.html" }
];

function showPagesHistory() {
    let previousPagesPlace = document.getElementById("previousPagesPlace");
    previousPagesPlace.innerHTML = ""; // clear before rendering

    for (let i = 0; i < previousPages.length; i++) {
        // Add the link
        previousPagesPlace.innerHTML += `
        <a href="${previousPages[i].pageURL}" class="pagesHistory"
           onclick="checkPagesHistory('${previousPages[i].pageName}', '${previousPages[i].pageURL}')">
          <div>${previousPages[i].pageName}</div>
        </a>
      `;

        // Add "/" only if it's not the last item
        if (i < previousPages.length - 1) {
            previousPagesPlace.innerHTML += " / ";
        }
    }
}

function checkPagesHistory(name, url) {
    console.log("Clicked:", name, url);

    // Find if page already exists in history
    let pagePlace = previousPages.findIndex(p => p.pageName === name);

    if (pagePlace === -1) {
        // Page not found → add it
        previousPages.push({ pageName: name, pageURL: url });
    } else {
        // Page found → trim future history
        previousPages.splice(pagePlace + 1);
    }

    // Save to storage
    localStorage.setItem("pagesHistory", JSON.stringify(previousPages));

    // Re-render
    showPagesHistory();
}

// Render on load
window.onload = function () {
    showPagesHistory();
};






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

document.addEventListener("DOMContentLoaded", function () {
  const serviceListItems = document.querySelectorAll("#serviceList li");
  const carousel = document.querySelector('#serviceCarousel');
  const bsCarousel = bootstrap.Carousel.getOrCreateInstance(carousel);

  serviceListItems.forEach((li, idx) => {
    li.addEventListener("click", function () {
      bsCarousel.to(idx);
    });
  });

  carousel.addEventListener('slid.bs.carousel', function (event) {
    const activeSlide = carousel.querySelector('.carousel-item.active');
    if (!activeSlide || !activeSlide.id) return;

    serviceListItems.forEach(el => el.classList.remove('active'));
    const activeListItem = document.getElementById(activeSlide.id);
    if (activeListItem) {
      activeListItem.classList.add('active');
    }
  });

  serviceListItems.forEach(el => el.classList.remove('active'));
  if (serviceListItems[0]) {
    serviceListItems[0].classList.add('active');
  }
});

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || {};
  const itemCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const cartElement = document.getElementById("cart");
  cartElement.textContent = `${itemCount}`;
}

updateCartCount();


function searchPhonesGET() {
  return fetch(allPhoneNameURL)
    .then((response) => response.json())
    .then((data) => {
      allPhoneName = data;
      searchPhones()
    })
    .catch((error) => console.error("Hiba a JSON betöltésekor:", error));


}
searchPhonesGET()

function searchPhones() {
  let searchDropdown = document.getElementById("searchDropdown");
  searchDropdown.innerHTML = "";

  for (let i = 0; i < allPhoneName.length; i++) {
    searchDropdown.innerHTML += `
      <div class="dropdown-item" onclick="openPhonePage('${allPhoneName[i].phoneID}')">
        ${allPhoneName[i].phoneName}
      </div>
    `;
  }
}

function openPhonePage(phoneID) {
  console.log("Clicked phone ID:", phoneID);
  localStorage.setItem("selectedPhone", phoneID);
  window.open('../telefonoldala/telefonoldal.html');
}

function searchBarActive() {
  console.log("alma");
  document.getElementById("searchDropdown").style.pointerEvents = "auto"
}
