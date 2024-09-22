import React, { useState, useRef, useEffect } from "react";

const ModalAddItem = ({ onClose, onAdd, onEdit, item, people }) => {
   const [name, setName] = useState(item?.name || '');
   const [quantity, setQuantity] = useState(item?.quantity || '');
   const [price, setPrice] = useState(item?.price || '');
   const [splitBy, setSplitBy] = useState(item?.splitBy || '');
   const [showSplitInput, setShowSplitInput] = useState(false);
   const [showRepeatInput, setShowRepeatInput] = useState(false);
   const [repeatValue, setRepeatValue] = useState('');

   const nameRef = useRef(null);
   const quantityRef = useRef(null);
   const priceRef = useRef(null);
   const splitByRef = useRef(null);
   const repeatRef = useRef(null);
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
         const newItem = { name, quantity, price, splitBy, repeat: repeatValue };
         if (item) {
            onEdit(newItem);
         } else {
            onAdd(newItem);
         }
         setName('');
         setQuantity('');
         setPrice('');
         setSplitBy('');
         setRepeatValue('');
         onClose(); // Закрываем модальное окно после добавления/редактирования
      }
   };


   const handleAllButtonClick = () => {
      const allNames = people.map(person => person.name).join(', ');
      if (showSplitInput) {
         setSplitBy(allNames);
      } else if (showRepeatInput) {
         setRepeatValue(allNames);
      }
   };

   const handlePriceKeyDown = (e) => {
      if (e.key === 'Enter') {
         e.preventDefault();
         if (name && quantity && price) {
            handleSubmit(e);
         } else {
            // Если какие-то поля не заполнены, фокусируемся на первом пустом поле
            if (!name) nameRef.current?.focus();
            else if (!quantity) quantityRef.current?.focus();
            else if (!price) priceRef.current?.focus();
         }
      }
   };


   const handleSplitClick = () => {
      setShowSplitInput(true);
      setShowRepeatInput(false);
      setTimeout(() => splitByRef.current?.focus(), 0);
   };

   const handleRepeatClick = () => {
      setShowRepeatInput(true);
      setShowSplitInput(false);
      setTimeout(() => repeatRef.current?.focus(), 0);
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
                     type="text"
                     inputMode="numeric"
                     placeholder="Price"
                     value={price}
                     onChange={(e) => setPrice(e.target.value)}
                     onKeyDown={handlePriceKeyDown}
                     required
                  />
                  {!item && (
                     <>
                        {!showSplitInput && !showRepeatInput && (
                           <div style={{display: 'flex', gap: '1rem'}}>
                              <button id="splitButton" type="button" onClick={handleSplitClick} style={{color: 'white'}}>
                                 Split
                              </button>
                              <button type="button" onClick={handleRepeatClick} style={{color: 'white'}}>
                                 Repeat
                              </button>
                           </div>
                        )}
                        {showSplitInput && (
                           <>
                              <input
                                 id="splitBy"
                                 ref={splitByRef}
                                 type="text"
                                 placeholder="Split names"
                                 value={splitBy}
                                 onChange={(e) => setSplitBy(e.target.value)}
                              />
                              <button style={{display: 'flex', gap: '1rem', color: 'white'}} type="button" onClick={handleAllButtonClick}>
                                 ALL
                              </button>
                           </>
                        )}
                        {showRepeatInput && (
                           <>
                              <input
                                 id="repeat"
                                 ref={repeatRef}
                                 type="text"
                                 placeholder="Repeat by (names)"
                                 value={repeatValue}
                                 onChange={(e) => setRepeatValue(e.target.value)}
                              />
                              <button style={{display: 'flex', gap: '1rem', color: 'white'}} type="button" onClick={handleAllButtonClick}>
                                 ALL
                              </button>
                           </>
                        )}
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