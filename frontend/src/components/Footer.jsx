import React from 'react'
import './Footer.css';
import { Link } from 'react-router-dom';

// Render the page footer.
export default function Footer() {
  return (
    <footer>
        <h3>Partnereink</h3>
      <div className="partner-logos">
            <img loading="lazy" src="./images/XiaomiLogo.png" alt="Xiaomi"/>
            <img loading="lazy" src="./images/samsung_logo.png" alt="Samsung"/>
            <img loading="lazy" src="./images/apple_logo.png" alt="Apple"/>
            <img loading="lazy" src="./images/huawei_logo.png" alt="Huawei"/>
            <img loading="lazy" src="./images/Honor-logo.png" alt="Honor"/>
            <img loading="lazy" src="./images/Google-logo.png" alt="Google"/>
            <img loading="lazy" src="./images/Motorola-logo.png" alt="Motorola"/>

        </div>
        <h3>PhoneScout</h3>
      <div className="footer-nav">
        <Link to="/elerhetosegek">Elérhetőségek</Link>
        <Link to="/rolunk">Rólunk</Link>
        <Link to="/kapcsolat">Kapcsolat</Link>
        <Link to="/bolt">Bolt</Link>
        </div>
      <div className="address">Miskolc, Palóczy László utca 3, 3525</div>
    </footer>
  )
}