import React from "react";
import "./InputText.css";

export default function InputText({ type, id, label }) {
  const normalTypes = ["text", "number", "password"];
  function getInputType() {
    if (normalTypes.includes(type)) {
      return "normal";
    }
  }

  return (
    <div>
      {getInputType() == "normal" ? (
        <div class="textBox">
          <input type={type} id={id} class="textBoxInput" placeholder=" " />
          <label for={id} class="textBoxLabel">
            {label}
          </label>
        </div>
      ) : (
        <div class="textBox">
          <input type={type} id={id} class="textBoxInput" placeholder=" " />
          <label for={id} class="textBoxLabel">
            {label}
          </label>
        </div>
      )}
    </div>
  );
}
