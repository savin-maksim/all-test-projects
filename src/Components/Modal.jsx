import React, { useRef, useEffect } from 'react';

const Modal = ({ isOpen, onClose, children, showSaveButton, onSave }) => {
   const modalRef = useRef();

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
         }
      };

      if (isOpen) {
         document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [isOpen, onClose]);

   if (!isOpen) return null;

   return (
      <div style={{
         position: 'fixed',
         top: 0,
         left: 0,
         right: 0,
         bottom: 0,
         backgroundColor: 'rgba(0, 0, 0, 0.5)',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         zIndex: 1000
      }}>
         <div ref={modalRef} style={{
            background: 'white',
            padding: '1rem',
            borderRadius: 'var(--button-border-radius)',
            maxWidth: '35rem',
            width: '90%',
            minWidth: '20rem',
            maxHeight: '80%',
            overflow: 'auto',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // Internet Explorer 10+
            '&::WebkitScrollbar': { // WebKit
               width: 0,
               height: 0,
               background: 'transparent'
            }
         }}>
            {children}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '2rem', marginTop: '1rem' }}>
               {showSaveButton && (
                  <button onClick={onSave} style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--green-color)' }}>Save Variable</button>
               )}
               <button onClick={onClose} style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--red-color)' }}>Close</button>
            </div>
         </div>
      </div>
   );
};

export default Modal;