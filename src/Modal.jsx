import React from 'react';

const Modal = ({ isOpen, onClose, children, showSaveButton, onSave }) => {
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
         <div style={{
            background: 'white',
            padding: '1rem',
            borderRadius: 'var(--button-border-radius)',
            maxWidth: '40rem',
            width: '90%',
            minWidth: '20rem',
            maxHeight: '80%',
            overflow: 'auto',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // Internet Explorer 10+
            '&::-webkit-scrollbar': { // WebKit
               width: 0,
               height: 0,
               background: 'transparent'
            }
         }}>
            {children}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '2rem' }}>
               {showSaveButton && (
                  <button onClick={onSave} style={{ padding: '1rem 1rem' }}>Save Variable</button>
               )}
               <button onClick={onClose} style={{ padding: '1rem 1rem' }}>Close</button>
            </div>
         </div>
      </div >
   );
};

export default Modal;