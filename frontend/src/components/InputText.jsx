import React from 'react'
import './InputText.css'

export default function InputText({type, id, label}) {
    return (
        <div>
            <div class="textBox">
                <input type={type} id={id} class="textBoxInput" placeholder=" " />
                <label for={id} class="textBoxLabel">{label}</label>
            </div>
        </div>
    )
}
