import React from 'react'
import './PhoneCard.css'
import { Link } from 'react-router'

export default function PhoneCard({ phoneId, phoneName, phoneInStore, phonePrice, phoneImg }) {
  
  return (
    <Link to={`/phone/${phoneId}`} className="phone-card-link phoneRow">
      <div className='phoneImage'>
        <img src="/images/14t.png" alt="Telefon képe" />
        <div className='price-bubble'>{phonePrice} Ft</div>
        <div className='stock-bubble phonestockFalse'>{phoneInStore}</div>
      </div>
      <div className='phoneDetails'>
        <h3>{phoneName}</h3>
      </div>
      <div className='cardButtons'>
        <div className='button'>
          <img src="/images/compare-removebg-preview 1.png" alt="Összehasonlítás" />
        </div>
        <div className='button'>
          <img src="/images/cart-removebg-preview 1.png" alt="Kosár" />
        </div>
      </div>
    </Link>
  )
}
