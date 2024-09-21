import React, { useEffect, useRef } from "react";

const ModalAddPerson = ({ show, onClose, value, onChange, onClick }) => {
  const inputRef = useRef(null); // Создание рефа для инпута

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus(); // Фокус на инпуте при открытии модального окна
    }
  }, [show]); // Выполнить, когда "show" изменяется

  if (!show) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onClick(); // Подтверждение по Enter
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-card">
        <div className="modal-card-main">
          <input
            ref={inputRef} // Присваиваем реф инпуту
            type="text"
            placeholder="Person name"
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            required
          />
          <div className="modal-card-bottom">
            <button onClick={onClick}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAddPerson;
