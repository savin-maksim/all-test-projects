import { Pencil, Trash } from 'lucide-react';
import React, { useRef } from 'react';

function ModalManageGuests({ show, guests, onClose, onEdit, onDelete }) {
   if (!show) return null;

   const handleOverlayClick = (e) => {
      if (e.target === e.currentTarget) {
         onClose();
      }
   };

   // Создаем массив рефов для каждого инпута
   const inputRefs = useRef([]);

   const handleFocus = (index) => {
      // Ставим фокус на нужный инпут по индексу
      if (inputRefs.current[index]) {
         inputRefs.current[index].focus();
      }
   };

   return (
      <div className="modal-overlay" onClick={handleOverlayClick}>
         <div className="modal-card">
            <div className='manage-card-main'>
               {guests.map((guest, index) => (
                  <div key={index} className="manage-card-title">
                     <input
                        type="text"
                        value={guest.name}
                        onChange={(e) => onEdit(index, e.target.value)}
                        ref={(el) => inputRefs.current[index] = el} // Привязываем каждый инпут к своему ref
                     />
                     <button >
                        <Pencil className='icons-style' onClick={() => handleFocus(index)} />
                        <Trash className='icons-style' onClick={() => onDelete(index)}/>
                     </button>
                  </div>
               ))}
               <button className='modal-card-bottom' onClick={onClose}>Close</button>
            </div>
         </div>
      </div>
   );
}

export default ModalManageGuests;
