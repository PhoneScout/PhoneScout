import React from 'react'
import './PhoneCard.css'

export default function PhoneCard({ phoneName, phoneInStore, phonePrice, phoneImg }) {
  return (

    <div className='phoneRow'>
      <div className='phoneImage'>
        <img src="./images/14t.png" alt="Telefon képe" />
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

  )
}
