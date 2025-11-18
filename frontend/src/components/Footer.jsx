import React from 'react'
import './Footer.css';

export default function Footer() {
  return (
    <footer>
        <h3>Partnereink</h3>
        <div class="partner-logos">
            <img loading="lazy" src="./images/XiaomiLogo.png" alt="Xiaomi"/>
            <img loading="lazy" src="./images/samsung_logo.png" alt="Samsung"/>
            <img loading="lazy" src="./images/apple_logo.png" alt="Apple"/>
            <img loading="lazy" src="./images/huawei_logo.png" alt="Huawei"/>
            <img loading="lazy" src="./images/sony_logo.png" alt="Sony"/>
        </div>
        <h3>PhoneScout</h3>
        <div class="footer-nav">
            <a href="./elerhetosegek">Elérhetőségek</a>
            <a href="./rolunk">Rólunk</a>
            <a href="./kapcsolat">Kapcsolat</a>
            <a href="./bolt">Bolt</a>
        </div>
        <div class="address">Miskolc, Palóczy László utca 3, 3525</div>
    </footer>
  )
}