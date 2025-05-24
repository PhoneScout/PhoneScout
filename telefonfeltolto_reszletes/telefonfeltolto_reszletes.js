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
  const totalPages = 7;

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
      alert("Űrlap beküldve");
      // document.getElementById("phoneForm").submit(); // Itt lehet beküldeni ténylegesen
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