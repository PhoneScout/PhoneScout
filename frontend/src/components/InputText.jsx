import { useState } from "react";
import "./InputText.css";

export default function InputText({ type, id, label, onChange, inputStyle, value, required, ...rest }) {
  const isCheckbox = type === "checkbox";
  const isPasswordType = type === "password";
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const currentType = isPasswordType 
    ? (isPasswordVisible ? "text" : "password") 
    : type;

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

  return (
    <div className="textBox" style={{ position: 'relative' }}>
      <input
        type={currentType}
        id={id}
        className="textBoxInput"
        placeholder=" "
        onChange={onChange}
        value={value}
        required={required}
        {...rest}
        style={{ 
          ...inputStyle, 
          width: '100%', 
          boxSizing: 'border-box',
          paddingRight: isPasswordType ? "45px" : "12px" 
      }}
      />
      <label htmlFor={id} className="textBoxLabel">
        {label}
      </label>

      {isPasswordType && (
        <i 
          className={`bi ${isPasswordVisible ? 'bi-eye-slash' : 'bi-eye'}`}
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          style={{
            position: 'absolute',
            right: '10px',
            top: '45%',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            zIndex: 10,
            color: '#6c757d',
            fontSize: '1.2rem',
            transition: 'color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.color = '#000'}
          onMouseOut={(e) => e.target.style.color = '#6c757d'}
        />
      )}
    </div>
  );
}
