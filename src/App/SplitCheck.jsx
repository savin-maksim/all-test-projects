import React, { useState, useEffect } from "react";
import { CircleChevronDown, CircleChevronUp, Plus, X, Pencil, Trash, Split, Eye, EyeOff, UserRoundPen, Share2 } from 'lucide-react';

import ModalAddPerson from "../components/ModalAddPerson";
import ModalAddItem from "../components/ModalAddItem";
import ModalManageGuests from "../components/ModalManageGuests";

import html2canvas from 'html2canvas';



function SplitCheck() {
  const [people, setPeople] = useState(() => {
    const savedPeople = localStorage.getItem('people');
    return savedPeople ? JSON.parse(savedPeople) : [];
  });
  const [newPersonName, setNewPersonName] = useState('');
  const [editingItem, setEditingItem] = useState(null); // Добавлено состояние для редактирования элемента
  const [isModalAddPerson, setIsModalAddPerson] = useState(false);
  const [isModalAddItem, setIsModalAddItem] = useState(false);
  const [modalPersonIndex, setModalPersonIndex] = useState(null);
  const [visibleCards, setVisibleCards] = useState(
    Array(people.length).fill(true) // По умолчанию все карточки видимы (развернуты)
  );
  const [showAll, setShowAll] = useState(false); // Состояние для показа всех карточек
  const [isGrandTotalVisible, setIsGrandTotalVisible] = useState(false); // Состояние для сворачивания/разворачивания GrandTotalCard
  const [isModalManageGuests, setIsModalManageGuests] = useState(false);

  useEffect(() => {
    localStorage.setItem('people', JSON.stringify(people));
  }, [people]);

  const shareScreenshots = async () => {
    // Захват скриншотов индивидуальных карточек
    for (const person of people) {
      const cardElement = document.getElementById(`card-${person.name}`);
      if (cardElement) {
        // Сохраняем оригинальный стиль фона
        const originalBackgroundColor = cardElement.style.backgroundColor;

        // Устанавливаем темно-серый фон
        cardElement.style.backgroundColor = '#333'; // Темно-серый цвет

        const canvas = await html2canvas(cardElement, {
          backgroundColor: null,
        });
        const dataURL = canvas.toDataURL('image/png');

        // Создание ссылки для скачивания
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `${person.name}-${calculateTotal(person.orders).toFixed(2)}.png`;
        link.click();
        // Восстанавливаем оригинальный фон
        cardElement.style.backgroundColor = originalBackgroundColor;
      }
    }

    // Захват скриншота для GrandTotalCard
    const grandTotalCardElement = document.getElementById('grand-total-card');
    if (grandTotalCardElement) {

      const originalBackgroundColor = grandTotalCardElement.style.backgroundColor;

      // Устанавливаем темно-серый фон
      grandTotalCardElement.style.backgroundColor = '#333'; // Темно-серый цвет

      const canvas = await html2canvas(grandTotalCardElement, {
        backgroundColor: null,
      });
      const dataURL = canvas.toDataURL('image/png');

      // Создание ссылки для скачивания
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'Total.png';
      link.click();
      // Восстанавливаем оригинальный фон
      grandTotalCardElement.style.backgroundColor = originalBackgroundColor;

    }
  };

  const openModalManageGuests = () => setIsModalManageGuests(true);

  const editGuest = (index, newName) => {
    const updatedPeople = [...people];
    updatedPeople[index].name = newName;
    setPeople(updatedPeople);
  };

  const deleteGuest = (index) => {
    const updatedPeople = people.filter((_, i) => i !== index);
    setPeople(updatedPeople);
  };


  const toggleCardVisibility = (index) => {
    const updatedVisibleCards = [...visibleCards];
    updatedVisibleCards[index] = !updatedVisibleCards[index];
    setVisibleCards(updatedVisibleCards);
  };

  const toggleShowAll = () => {
    const newShowAll = !showAll;
    setShowAll(newShowAll);
    setVisibleCards(Array(people.length).fill(newShowAll)); // Обновляем видимость всех карточек
    setIsGrandTotalVisible(newShowAll); // Сворачиваем/разворачиваем GrandTotalCard вместе с другими карточками
  };

  const openModalAddPerson = () => setIsModalAddPerson(true);
  const closeModalAddPerson = () => setIsModalAddPerson(false);

  const openModalAddItem = (index) => {
    setModalPersonIndex(index); // Открываем модальное окно для конкретного человека
    setIsModalAddItem(true);
  };

  const closeModalAddItem = () => {
    setModalPersonIndex(null); // Закрываем модальное окно
    setEditingItem(null); // Сбрасываем редактируемый элемент при закрытии модального окна
    setIsModalAddItem(false);
  };

  const addPerson = () => {
    if (newPersonName.trim()) {
      const names = newPersonName.split(',')
        .map(name => name.trim())
        .filter(name => name)
        .map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()); // Приведение первой буквы к заглавной

      if (names.length) {
        const newPeople = names.map(name => ({ name, orders: [] }));
        setPeople([...people, ...newPeople]);
        setNewPersonName('');
        setVisibleCards((prev) => [...prev, ...Array(newPeople.length).fill(false)]); // Обновляем видимость карточек
        closeModalAddPerson(); // Закрываем модальное окно после добавления гостей
      }
    }
  };

  const addOrderItem = (personIndex, item) => {
    const newPeople = [...people];
    const names = item.splitBy.split(',').map(name => name.trim()).filter(name => name); // Получаем имена из поля splitBy
    const newId = Math.max(0, ...newPeople[personIndex].orders.map(o => o.id)) + 1;

    if (names.length === 0) {
      // Если поле splitBy пустое, добавляем элемент только в текущую карточку
      newPeople[personIndex].orders.push({
        ...item,
        id: newId,
        price: item.price // Полная цена, без деления
      });
    } else {
      // Распределяем элемент между указанными именами
      names.forEach(name => {
        const personIndexToUpdate = newPeople.findIndex(person => person.name === name); // Находим индекс существующего человека
        if (personIndexToUpdate !== -1) {
          newPeople[personIndexToUpdate].orders.push({
            ...item,
            id: newId,
            price: item.price / names.length // Делим цену на количество персон
          });
        }
      });
    }

    setPeople(newPeople);
    closeModalAddItem(); // Закрываем модальное окно после добавления
  };

  // Функция для открытия модального окна редактирования
  const editOrderItem = (personIndex, item) => {
    setModalPersonIndex(personIndex); // Открываем модальное окно для конкретного человека
    setEditingItem(item); // Устанавливаем элемент для редактирования
    setIsModalAddItem(true);
  };

  const removeOrderItem = (personIndex, itemId) => {
    const newPeople = [...people];
    newPeople[personIndex].orders = newPeople[personIndex].orders.filter(item => item.id !== itemId);
    setPeople(newPeople);
  };

  // Обновление существующего элемента
  const updateOrderItem = (personIndex, itemId, updatedItem) => {
    const newPeople = [...people];
    const itemIndex = newPeople[personIndex].orders.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      newPeople[personIndex].orders[itemIndex] = { ...updatedItem, id: itemId };
      setPeople(newPeople);
    }
    setEditingItem(null); // Очищаем редактируемый элемент после обновления
    closeModalAddItem(); // Закрываем модальное окно после редактирования
  };

  const calculateItemTotal = (item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.price) || 0;
    const splitBy = parseFloat(item.splitBy) || 1;
    return (quantity * price) / splitBy;
  };

  const calculateTotal = (orders) => {
    return orders.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const aggregateOrders = () => {
    const aggregated = {};

    people.forEach(person => {
      person.orders.forEach(item => {
        const key = `${item.name}-${item.price}`; // Ключ для идентификации товара

        const quantity = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.price) || 0;

        if (aggregated[key]) {
          // Если элемент уже есть в агрегированных данных, добавляем количество
          aggregated[key].quantity += quantity;
        } else {
          // Добавляем новый элемент
          aggregated[key] = {
            name: item.name,
            quantity: quantity, // Суммируем порции без учёта разделения
            price: price, // Цена на одну порцию
            splitBy: item.splitBy // Храним информацию о разделении
          };
        }
      });
    });

    return Object.values(aggregated); // Преобразуем в массив для рендера
  };

  const calculateGrandTotal = () => {
    return aggregateOrders().reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  return (
    <div className='main-container'>
      <div className="title">
        <h1>Split Check</h1>
      </div>
      <hr />
      <div className='main-buttons'>
        <div>
          <button onClick={toggleShowAll}>
            {showAll ? (
              <EyeOff className="icons-style-title" />
            ) : (
              <Eye className="icons-style-title" />
            )}
          </button>
        </div>
        <div>
          <button onClick={openModalAddPerson}>
            <Plus className="icons-style-title" />
          </button>
        </div>
        <div>
          <button onClick={openModalManageGuests}>
            <UserRoundPen className="icons-style-title" />
          </button>
        </div>
        <button onClick={shareScreenshots}>
          <Share2 className="icons-style-title" /></button>
      </div>
      {people.length > 0 && (
        <GrandTotalCard
          items={aggregateOrders()}
          total={calculateGrandTotal()}
          isVisible={isGrandTotalVisible}
          toggleVisibility={() => setIsGrandTotalVisible(!isGrandTotalVisible)}
        />
      )}
      {people.map((person, personIndex) => (
        <div key={personIndex}>
          <div id={`card-${person.name}`} className="card">
            <div className={`card-title ${!visibleCards[personIndex] ? 'no-border' : ''}`}>
              <h2>{person.name}</h2>
              <div className='card-title-res'>
                <h2>{calculateTotal(person.orders).toFixed(2)}</h2>
                <button onClick={() => toggleCardVisibility(personIndex)}>
                  {visibleCards[personIndex] ? (
                    <CircleChevronUp className="icons-style" />
                  ) : (
                    <CircleChevronDown className="icons-style" />
                  )}
                </button>
              </div>
            </div>
            {visibleCards[personIndex] && (
              <>
                <div className='card-main'>
                  {person.orders.map((item) => (
                    <div key={item.id} className='card-product'> {/* Используйте уникальный идентификатор для ключа */}
                      <div>
                        <h3>{item.name}</h3>
                        <h3>{item.quantity} × {parseFloat(item.price).toFixed(2)}</h3>
                      </div>
                      <div className='card-product-res'>
                        <div>
                          {item.splitBy && item.splitBy.split(',').length > 1 && <Split className="icons-style" />}
                        </div>
                        <h3>
                          {(item.quantity * item.price).toFixed(2)}
                        </h3>
                        <button onClick={() => editOrderItem(personIndex, item)}><Pencil className="icons-style" /></button>
                        <button onClick={() => removeOrderItem(personIndex, item.id)}><X className="icons-style" /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className='card-bottom' onClick={() => openModalAddItem(personIndex)}>
                  Add item
                </button>
              </>
            )}
          </div>
          {modalPersonIndex === personIndex && (
            <ModalAddItem
              show={isModalAddItem}
              onClose={closeModalAddItem}
              onAdd={(item) => addOrderItem(personIndex, item)}
              onEdit={(updatedItem) => updateOrderItem(personIndex, editingItem.id, updatedItem)}
              item={editingItem}
              onKeyDown={(e) => e.key === 'Enter' && addPerson()}
              people={people}
            />
          )}
        </div>
      ))}
      <ModalAddPerson show={isModalAddPerson} onClose={closeModalAddPerson} value={newPersonName} onClick={addPerson} onChange={(e) => setNewPersonName(e.target.value)} />
      <ModalManageGuests guests={people} onClose={() => setIsModalManageGuests(false)} onEdit={editGuest} onDelete={deleteGuest} show={isModalManageGuests} />

    </div>
  );
}

export default SplitCheck;

function GrandTotalCard({ items, total, isVisible, toggleVisibility }) {
  return (
    <>
      <div id='grand-total-card' className="card-total">
        <div className={`card-title ${!isVisible ? 'no-border' : ''}`}>
          <h2>Total</h2>
          <div className='card-title-res'>
            <h2>{total.toFixed(2)}</h2>
            <button onClick={toggleVisibility}>
              {isVisible ? (
                <CircleChevronUp className="icons-style" />
              ) : (
                <CircleChevronDown className="icons-style" />
              )}
            </button>
          </div>
        </div>

        {isVisible && (
          <div className='card-main'>
            {items.map((item, index) => (
              <div key={index} className='card-product'>
                <div>
                  <h3>{item.name}</h3>
                  <h3>{item.quantity} × {item.price.toFixed(2)}</h3>
                </div>
                <div className='card-product-res'>
                  <div>
                    {item.splitBy && item.splitBy.split(',').length > 1 && <Split className="icons-style" />}
                  </div>
                  <h3>
                    {(item.quantity * item.price).toFixed(2)}

                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <hr />
    </>
  );
}
