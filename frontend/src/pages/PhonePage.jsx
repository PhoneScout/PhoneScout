import React from 'react'
import { useParams } from 'react-router-dom';

export default function PhonePage() {
	const { phoneId } = useParams();
	const params = useParams();
console.log("params:", params);


//fetch('http://localhost:5292/phonePage/2').then(response => response.json()).then(data => console.log(data)) //ID-T KISZEDNI A / MÖGÜL HA VAN

  return (
    <div>PhonePage: {phoneId}</div>
  )
}
