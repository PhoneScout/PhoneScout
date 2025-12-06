import React from 'react'
import { useParams } from 'react-router-dom';

export default function PhonePage() {
	const { phoneId } = useParams();
	const params = useParams();
console.log("params:", params);

  return (
    <div>PhonePage: {phoneId}</div>
  )
}
