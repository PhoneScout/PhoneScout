import "./InputText.css";

export default function InputText({ type, id, label, onChange, inputStyle }) {
  const isCheckbox = type === "checkbox";

  if (isCheckbox) {
    return (
      <div className="checkboxBox">
        <input
          type="checkbox"
          id={id}
          className="checkboxInput"
        />
        <label htmlFor={id} className="checkboxLabel">
          {label}
        </label>
      </div>
    );
  }

  // Everything else (text, number, email, password, date, color, range, etc.)
  return (
    <div className="textBox">
      <input
        type={type}
        id={id}
        className="textBoxInput"
        placeholder=" "
        onChange={onChange}
        style={inputStyle}
      />
      <label htmlFor={id} className="textBoxLabel">
        {label}
      </label>
    </div>
  );
}
