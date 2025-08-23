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