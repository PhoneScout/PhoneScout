import React from 'react'
import './PhoneCard.css'

export default function PhoneCard({phoneName, phoneInStore, phonePrice, phoneImg}) {
  const allPhonesURL = "http://localhost:5165/api/GETmainPage"; //ÚJ BACKEND


  let allPhonesData = []






  let currentPage = 0;
  let phonesPerPage = 4;

  function displayPhoneCards() {
    const contentRow = document.getElementById("contentRow");
    contentRow.innerHTML = "";

    const startIndex = currentPage * phonesPerPage;
    const endIndex = startIndex + phonesPerPage;

    allPhonesData.slice(startIndex, endIndex).forEach((phone) => {
      const phoneRow = document.createElement("div");
      phoneRow.classList.add("phoneRow");

      phoneRow.onclick = function () {
        //checkPagesHistory(`${phone.phoneName}`, `../telefonoldala/telefonoldal.html`);
        localStorage.setItem("selectedPhone", phone.phoneID);
        window.location.href = "../telefonoldala/telefonoldal.html";
      };

      const phoneImage = document.createElement("div");
      phoneImage.classList.add("phoneImage");
      phoneImage.innerHTML = `
            <img src="${phone.imageUrl || "../Images/image 3.png"}" alt="${phone.phoneName
        }" loading="lazy">
            <div class="stock-bubble ${phone.phoneInStore === "van"
          ? "phonestockTrue"
          : "phonestockFalse"
        }">
                ${phone.phoneInStore === "van" ? "Raktáron" : "Nincs raktáron"}
            </div>
            <div class="price-bubble">${phone.phonePrice} Ft</div>
        `;

      const phoneName = document.createElement("div");
      phoneName.classList.add("phoneDetails");
      phoneName.innerHTML = `
            <h3 style="margin: 0; font-size: 1.2em;">${phone.phoneName}</h3>
        `;

      const phonePrice = document.createElement("div");
      phonePrice.classList.add("phonePrice");
      phonePrice.textContent = `${phone.phonePrice} Ft`;

      const cardButtons = document.createElement("div");
      cardButtons.classList.add("cardButtons");

      const compareButton = document.createElement("div");
      compareButton.classList.add("button");
      const compareImg = document.createElement("img");
      compareImg.src = "../Images/compare-removebg-preview 1.png";
      compareImg.loading = "lazy";
      compareButton.appendChild(compareImg);

      /*compareButton.onclick = function (event) {
        event.stopPropagation();
        let comparePhones = JSON.parse(
          localStorage.getItem("comparePhones") || "[]"
        );
        if (!comparePhones.includes(phone.phoneID)) {
          comparePhones.push(phone.phoneID);
          localStorage.setItem("comparePhones", JSON.stringify(comparePhones));
          //updateCompareCount();
        }
      };*/

      const cartButton = document.createElement("div");
      cartButton.classList.add("button");
      const cartImg = document.createElement("img");
      cartImg.src = "../Images/cart-removebg-preview 1.png";
      cartImg.loading = "lazy";
      cartButton.appendChild(cartImg);

      // Kosár pont animáció
      /*cartButton.onclick = function (event) {
        event.stopPropagation();
        let cart = JSON.parse(localStorage.getItem("cart")) || {};
        cart[phone.phoneID] = (cart[phone.phoneID] || 0) + 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();

        const cartIcon = document.getElementById("cart");
        const buttonRect = cartButton.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();

        const animDot = document.createElement("div");
        animDot.style.position = "fixed";
        animDot.style.left = buttonRect.left + buttonRect.width / 2 + "px";
        animDot.style.top = buttonRect.top + buttonRect.height / 2 + "px";
        animDot.style.width = "16px";
        animDot.style.height = "16px";
        animDot.style.background = "#68F145";
        animDot.style.borderRadius = "50%";
        animDot.style.zIndex = "9999";
        animDot.style.pointerEvents = "none";
        animDot.style.transition = "all 2s cubic-bezier(.4,2,.6,1)";
        document.body.appendChild(animDot);

        setTimeout(() => {
          const cartCenterX = cartRect.left + cartRect.width / 2;
          const cartCenterY = cartRect.top + cartRect.height / 2;

          animDot.style.left = cartCenterX - animDot.offsetWidth / 2 + "px";
          animDot.style.top = cartCenterY - animDot.offsetHeight / 2 + "px";
          animDot.style.opacity = "0.2";
          animDot.style.transform = "scale(0.5)";
        }, 10);

        setTimeout(() => {
          animDot.style.transition = "all 0.5s cubic-bezier(.4,2,.6,1)";
          animDot.style.transform = "scale(10)";
          animDot.style.opacity = "0";
        }, 450);

        setTimeout(() => {
          animDot.remove();
        }, 1010);
      };*/

      /*compareButton.onclick = function (event) {
        event.stopPropagation();

        let comparePhones = JSON.parse(localStorage.getItem("comparePhones") || "[]");
        if (!comparePhones.includes(phone.phoneID)) {
          comparePhones.push(phone.phoneID);
          localStorage.setItem("comparePhones", JSON.stringify(comparePhones));
          updateCompareCount();
        }

        if (comparePhones.includes(phone.phoneID)) {
          compareButton.style.cursor = "not-allowed";
          compareButton.style.backgroundColor = "#1f6e0b";
          compareButton.onclick = null;
        }

        const compareIcon = document.getElementById("osszehasonlitas");
        const buttonRect = compareButton.getBoundingClientRect();
        const compareRect = compareIcon.getBoundingClientRect();

        const animDot = document.createElement("div");
        animDot.style.position = "fixed";
        animDot.style.left = buttonRect.left + buttonRect.width / 2 + "px";
        animDot.style.top = buttonRect.top + buttonRect.height / 2 + "px";
        animDot.style.width = "16px";
        animDot.style.height = "16px";
        animDot.style.background = "#68F145";
        animDot.style.borderRadius = "50%";
        animDot.style.zIndex = "9999";
        animDot.style.pointerEvents = "none";
        animDot.style.transition = "all 2s cubic-bezier(.4,2,.6,1)";
        document.body.appendChild(animDot);

        setTimeout(() => {
          const compareCenterX = compareRect.left + compareRect.width / 2;
          const compareCenterY = compareRect.top + compareRect.height / 2;

          animDot.style.left = compareCenterX - animDot.offsetWidth / 2 + "px";
          animDot.style.top = compareCenterY - animDot.offsetHeight / 2 + "px";
          animDot.style.opacity = "0.2";
          animDot.style.transform = "scale(0.5)";
        }, 10);

        setTimeout(() => {
          animDot.style.transition = "all 0.5s cubic-bezier(.4,2,.6,1)";
          animDot.style.transform = "scale(10)";
          animDot.style.opacity = "0";
        }, 450);

        setTimeout(() => {
          animDot.remove();
        }, 1010);
      };*/

      cardButtons.appendChild(compareButton);
      cardButtons.appendChild(cartButton);

      phoneRow.appendChild(phoneImage);
      phoneRow.appendChild(phoneName);
      phoneRow.appendChild(cardButtons);

      contentRow.appendChild(phoneRow);

    });
  }

  //displayPhoneCards()

  return (
    <div id='contentRow'>
      <div className='phoneRow'>
        <div className='phoneImage'>
          <img src="./images/XiaomiLogo.png" alt="" />
          <div className='price-bubble'>{phonePrice} Ft</div>
          <div className='stock-bubble phonestockFalse'>{phoneInStore}</div>
        </div>
        <div className='phoneDetails'>
          <h3>{phoneName}</h3>
        </div>
        <div className='cardButtons'>
          <div className='button'>
            <img src="..\images\cart-removebg-preview 1.png" alt="Összehasonlítás" />
          </div>
          <div className='button'>
            <img src="" alt="" />
            <img src=".\images\cart-removebg-preview 1.png" alt="Kosár" />
          </div>
        </div>
      </div>
    </div>
  )
}
