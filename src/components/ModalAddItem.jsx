import React, { useState, useRef, useEffect } from "react";

const ModalAddItem = ({ onClose, onAdd, onEdit, item, people }) => {
   const [name, setName] = useState(item?.name || '');
   const [quantity, setQuantity] = useState(item?.quantity || '');
   const [price, setPrice] = useState(item?.price || '');
   const [splitBy, setSplitBy] = useState(item?.splitBy || '');

   const nameRef = useRef(null);
   const quantityRef = useRef(null);
   const priceRef = useRef(null);
   const splitByRef = useRef(null);
   const submitButtonRef = useRef(null);

   useEffect(() => {
      if (nameRef.current) {
         nameRef.current.focus();
      }
   }, []);

   const handleKeyDown = (e, nextRef) => {
      if (e.key === 'Enter') {
         e.preventDefault();
         nextRef?.current?.focus();
      }
   };

   const handleOverlayClick = (e) => {
      if (e.target === e.currentTarget) {
         onClose();
      }
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      if (name && quantity && price) {
         const newItem = { name, quantity, price, splitBy };
         if (item) {
            onEdit(newItem);
         } else {
            onAdd(newItem);
         }
         setName('');
         setQuantity('');
         setPrice('');
         setSplitBy('');
      }
   };

   const handleAllButtonClick = () => {
      const allNames = people.map(person => person.name).join(', ');
      setSplitBy(allNames);
   };

   const handlePriceKeyDown = (e) => {
      if (item) {
         // Если редактируем элемент, подтверждаем форму
         if (e.key === 'Enter') {
            e.preventDefault();
            submitButtonRef.current?.click();
         }
      } else {
         // Если добавляем элемент, переходим в секцию splitBy
         if (e.key === 'Enter') {
            e.preventDefault();
            splitByRef.current?.focus();
         }
      }
   };

   return (
      <div className="modal-overlay" onClick={handleOverlayClick}>
         <div className="modal-card">
            <form onSubmit={handleSubmit}>
               <div className="modal-card-add-item">
                  <input
                     id="name"
                     ref={nameRef}
                     type="text"
                     placeholder="Menu item"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     onKeyDown={(e) => handleKeyDown(e, quantityRef)}
                     required
                  />
                  <div>-</div>
                  <input
                     id="quantity"
                     ref={quantityRef}
                     type="number"
                     placeholder="Units"
                     value={quantity}
                     onChange={(e) => setQuantity(e.target.value)}
                     onKeyDown={(e) => handleKeyDown(e, priceRef)}
                     required
                  />
                  <div>x</div>
                  <input
                     id="price"
                     ref={priceRef}
                     type="text" // Изменено на text
                     inputMode="numeric" // Добавлено для числовой клавиатуры
                     placeholder="Price"
                     value={price}
                     onChange={(e) => setPrice(e.target.value)}
                     onKeyDown={handlePriceKeyDown}
                     required
                  />
                  {!item && (
                     <>
                        <input
                           id="splitBy"
                           ref={splitByRef}
                           type="text"
                           placeholder="Split names (optional)"
                           value={splitBy}
                           onChange={(e) => setSplitBy(e.target.value)}
                        />
                        <button style={{display: 'flex', gap: '1rem', color: 'white'}} type="button" onClick={handleAllButtonClick}>
                           ALL
                        </button>
                     </>
                  )}
               </div>
               <button ref={submitButtonRef} type="submit" className="modal-card-bottom">
                  {item ? 'Update' : 'Add'}
               </button>
            </form>
         </div>
      </div>
   );
};

export default ModalAddItem;
