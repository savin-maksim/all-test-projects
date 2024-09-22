import React, { useState, useEffect } from "react";
import { CircleChevronDown, CircleChevronUp, Plus, X, Pencil, Trash, Split, Eye, EyeOff, UserRoundPen, Share2 } from 'lucide-react';

import ModalAddPerson from "../components/ModalAddPerson";
import ModalAddItem from "../components/ModalAddItem";
import ModalManageGuests from "../components/ModalManageGuests";

import html2canvas from 'html2canvas';
import pako from 'pako'; // Добавьте эту библиотеку в ваш проект


const encodeData = (data) => {
  const compressed = pako.deflate(JSON.stringify(data));
  return btoa(String.fromCharCode.apply(null, compressed))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// Функция для декодирования и распаковки данных
const decodeData = (encodedData) => {
  try {
    const decoded = atob(encodedData.replace(/-/g, '+').replace(/_/g, '/'));
    const charCodes = decoded.split('').map(c => c.charCodeAt(0));
    const decompressed = pako.inflate(new Uint8Array(charCodes));
    return JSON.parse(new TextDecoder().decode(decompressed));
  } catch (error) {
    console.error('Failed to decode data:', error);
    return null;
  }
};

// Функция для оптимизации данных перед сохранением в URL
const optimizeDataForUrl = (people, splitItems, showAll, visibleCards, isGrandTotalVisible) => {
  return {
    p: people.map(person => ({
      n: person.name,
      o: person.orders.map(order => ({
        i: order.id,
        n: order.name,
        q: order.quantity,
        p: order.price,
        s: order.splitItemKey
      }))
    })),
    s: Object.entries(splitItems).map(([key, item]) => [
      key,
      {
        o: item.originalPrice,
        s: item.splitBy,
        p: item.portions,
        q: item.quantity,
        n: item.name
      }
    ]),
    a: showAll,
    v: visibleCards,
    g: isGrandTotalVisible
  };
};

// Функция для восстановления данных из оптимизированного формата
const restoreDataFromOptimized = (data) => {
  return {
    people: data.p.map(person => ({
      name: person.n,
      orders: person.o.map(order => ({
        id: order.i,
        name: order.n,
        quantity: order.q,
        price: order.p,
        splitItemKey: order.s
      }))
    })),
    splitItems: Object.fromEntries(data.s.map(([key, item]) => [
      key,
      {
        originalPrice: item.o,
        splitBy: item.s,
        portions: item.p,
        quantity: item.q,
        name: item.n
      }
    ])),
    showAll: data.a,
    visibleCards: data.v,
    isGrandTotalVisible: data.g
  };
};


function SplitCheck() {
  const [people, setPeople] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');
    if (encodedData) {
      const decodedData = decodeData(encodedData);
      return decodedData ? restoreDataFromOptimized(decodedData).people : [];
    }
    const savedPeople = localStorage.getItem('people');
    return savedPeople ? JSON.parse(savedPeople) : [];
  });

  const [splitItems, setSplitItems] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');
    if (encodedData) {
      const decodedData = decodeData(encodedData);
      return decodedData ? restoreDataFromOptimized(decodedData).splitItems : {};
    }
    const savedSplitItems = localStorage.getItem('splitItems');
    return savedSplitItems ? JSON.parse(savedSplitItems) : {};
  });

  const [showAll, setShowAll] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');
    if (encodedData) {
      const decodedData = decodeData(encodedData);
      return decodedData ? decodedData.a : false;
    }
    return false;
  });

  const [visibleCards, setVisibleCards] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');
    if (encodedData) {
      const decodedData = decodeData(encodedData);
      return decodedData ? decodedData.v : Array(people.length).fill(false);
    }
    return Array(people.length).fill(false);
  });

  const [isGrandTotalVisible, setIsGrandTotalVisible] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');
    if (encodedData) {
      const decodedData = decodeData(encodedData);
      return decodedData ? decodedData.g : false;
    }
    return false;
  });

  const [newPersonName, setNewPersonName] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [isModalAddPerson, setIsModalAddPerson] = useState(false);
  const [isModalAddItem, setIsModalAddItem] = useState(false);
  const [modalPersonIndex, setModalPersonIndex] = useState(null);
  const [isModalManageGuests, setIsModalManageGuests] = useState(false);

  useEffect(() => {
    localStorage.setItem('people', JSON.stringify(people));
    localStorage.setItem('splitItems', JSON.stringify(splitItems));
    updateURL();
  }, [people, splitItems, showAll, visibleCards, isGrandTotalVisible]);




  const updateURL = () => {
    const optimizedData = optimizeDataForUrl(people, splitItems, showAll, visibleCards, isGrandTotalVisible);
    const encodedData = encodeData(optimizedData);
    const newUrl = `${window.location.pathname}?data=${encodedData}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };





  const shareURL = () => {
    const currentURL = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'Split Check',
        url: currentURL
      }).then(() => {
        console.log('Thanks for sharing!');
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(currentURL).then(() => {
        alert('URL copied to clipboard!');
      }).catch(console.error);
    }
  };




  const shareScreenshots = async () => {
    // Инвертируем видимость карточек перед захватом скриншотов
    if (showAll) {
      toggleShowAll();
    }


    // Ждём, чтобы карточки успели измениться в DOM
    await new Promise(resolve => setTimeout(resolve, 300));

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
  const closeModalManageGuests = () => setIsModalManageGuests(false);


  const editGuest = (index, newName) => {
    const updatedPeople = [...people];
    updatedPeople[index].name = newName;
    setPeople(updatedPeople);
  };

  const deleteGuest = (index) => {
    const updatedPeople = people.filter((_, i) => i !== index);
    setPeople(updatedPeople);
  };

  const normalizeName = (name) => {
    return name
      .trim() // Убираем начальные и конечные пробелы
      .toLowerCase() // Приводим к нижнему регистру
      .replace(/\s+/g, ' ') // Заменяем множественные пробелы на один
      .split(' ') // Разбиваем на слова
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Делаем первую букву каждого слова заглавной
      .join(' '); // Соединяем обратно в строку
  };

  const toggleCardVisibility = (index) => {
    const updatedVisibleCards = [...visibleCards];
    updatedVisibleCards[index] = !updatedVisibleCards[index];
    setVisibleCards(updatedVisibleCards);
  };

  const toggleShowAll = () => {
    const newShowAll = !showAll;
    setShowAll(newShowAll);
    setVisibleCards(Array(people.length).fill(newShowAll));
    setIsGrandTotalVisible(newShowAll);
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
    const names = item.splitBy.split(',').map(name => normalizeName(name)).filter(name => name);
    const repeatNames = item.repeat ? item.repeat.split(',').map(name => normalizeName(name)).filter(name => name) : [];
    const newId = Math.max(0, ...newPeople.flatMap(p => p.orders.map(o => o.id))) + 1;

    const normalizedItemName = normalizeName(item.name);

    if (names.length <= 1 && repeatNames.length === 0) {
      // Обычное добавление для одного человека
      newPeople[personIndex].orders.push({
        ...item,
        id: newId,
        name: normalizedItemName,
        price: item.price
      });
    } else {
      const splitPrice = item.price / names.length;
      const splitItemKey = `${normalizedItemName}-${newId}`;

      setSplitItems(prev => ({
        ...prev,
        [splitItemKey]: {
          originalPrice: item.price,
          splitBy: names,
          portions: names.length,
          quantity: parseFloat(item.quantity) || 1,
          name: normalizedItemName
        }
      }));

      // Добавление позиции для разделенных имен
      names.forEach(name => {
        const personIndexToUpdate = newPeople.findIndex(person => normalizeName(person.name) === name);
        if (personIndexToUpdate !== -1) {
          newPeople[personIndexToUpdate].orders.push({
            ...item,
            id: newId,
            name: normalizedItemName,
            price: splitPrice,
            splitItemKey,
            quantity: parseFloat(item.quantity) || 1
          });
        }
      });

      // Добавление позиции для повторяющихся имен
      repeatNames.forEach(name => {
        const personIndexToUpdate = newPeople.findIndex(person => normalizeName(person.name) === name);
        if (personIndexToUpdate !== -1) {
          newPeople[personIndexToUpdate].orders.push({
            ...item,
            id: newId,
            name: normalizedItemName,
            price: item.price,
            quantity: parseFloat(item.quantity) || 1
          });
        }
      });
    }

    setPeople(newPeople);
    closeModalAddItem();
  };



  // Функция для открытия модального окна редактирования
  const editOrderItem = (personIndex, item) => {
    setModalPersonIndex(personIndex); // Открываем модальное окно для конкретного человека
    setEditingItem(item); // Устанавливаем элемент для редактирования
    setIsModalAddItem(true);
  };

  const removeOrderItem = (personIndex, itemId) => {
    const newPeople = [...people];
    const itemToRemove = newPeople[personIndex].orders.find(item => item.id === itemId);

    if (itemToRemove && itemToRemove.splitItemKey) {
      const { splitItemKey } = itemToRemove;
      setSplitItems(prev => {
        const updatedSplitItem = { ...prev[splitItemKey] };
        updatedSplitItem.portions -= 1;

        if (updatedSplitItem.portions > 0) {
          const newSplitPrice = updatedSplitItem.originalPrice / updatedSplitItem.portions;
          newPeople.forEach(person => {
            person.orders = person.orders.map(order => {
              if (order.splitItemKey === splitItemKey) {
                return { ...order, price: newSplitPrice };
              }
              return order;
            });
          });
          return { ...prev, [splitItemKey]: updatedSplitItem };
        } else {
          const { [splitItemKey]: _, ...rest } = prev;
          return rest;
        }
      });
    }

    newPeople[personIndex].orders = newPeople[personIndex].orders.filter(item => item.id !== itemId);
    setPeople(newPeople);
  };


  // Обновление существующего элемента
  const updateOrderItem = (personIndex, itemId, updatedItem) => {
    const newPeople = [...people];
    const itemIndex = newPeople[personIndex].orders.findIndex(item => item.id === itemId);

    if (itemIndex !== -1) {
      const currentItem = newPeople[personIndex].orders[itemIndex];
      const normalizedItemName = normalizeName(updatedItem.name);

      if (currentItem.splitItemKey) {
        setSplitItems(prev => {
          const updatedSplitItem = {
            ...prev[currentItem.splitItemKey],
            quantity: updatedItem.quantity,
            name: normalizedItemName
          };
          return { ...prev, [currentItem.splitItemKey]: updatedSplitItem };
        });

        newPeople.forEach(person => {
          person.orders = person.orders.map(order => {
            if (order.splitItemKey === currentItem.splitItemKey) {
              return { ...order, quantity: updatedItem.quantity, name: normalizedItemName };
            }
            return order;
          });
        });
      } else {
        newPeople[personIndex].orders[itemIndex] = {
          ...updatedItem,
          id: itemId,
          name: normalizedItemName
        };
      }

      setPeople(newPeople);
    }

    setEditingItem(null);
    closeModalAddItem();
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
        const isSplitItem = !!item.splitItemKey;
        const normalizedName = normalizeName(item.name);
        const key = isSplitItem ? item.splitItemKey : `${normalizedName}-${item.price}`;

        const quantity = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.price) || 0;

        if (aggregated[key]) {
          if (!isSplitItem) {
            aggregated[key].quantity += quantity;
          }
        } else {
          if (isSplitItem && splitItems[item.splitItemKey]) {
            const splitItem = splitItems[item.splitItemKey];
            aggregated[key] = {
              name: normalizedName,
              quantity: splitItem.quantity || quantity,
              price: splitItem.originalPrice || price,
              isSplit: true
            };
          } else {
            aggregated[key] = {
              name: normalizedName,
              quantity: quantity,
              price: price,
              isSplit: isSplitItem
            };
          }
        }
      });
    });

    return Object.values(aggregated);
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
      <div className={`main-buttons ${people.length === 0 ? 'single-column' : ''}`}>
        {/* Отображаем кнопку с глазом только если есть люди */}
        {people.length > 0 && (
          <div>
            <button onClick={toggleShowAll}>
              {showAll ? (
                <Eye className="icons-style-title" />
              ) : (
                <EyeOff className="icons-style-title" />
              )}
            </button>
          </div>
        )}
        {/* Кнопка с плюсом всегда отображается */}
        <div>
          <button onClick={openModalAddPerson}>
            <Plus className="icons-style-title" />
          </button>
        </div>
        {/* Отображаем кнопку для управления гостями, если есть люди */}
        {people.length > 0 && (
          <div>
            <button onClick={openModalManageGuests}>
              <UserRoundPen className="icons-style-title" />
            </button>
          </div>
        )}
        {/* Кнопка "Поделиться" только при наличии людей */}
        {people.length > 0 && (
          <>
            <button onClick={shareURL}>
              <Share2 className="icons-style-title" />
            </button>
            {/* <button onClick={shareURL}>
              Share URL
            </button> */}
          </>
        )}
      </div>
      {people.length > 0 && (
        <GrandTotalCard
          items={aggregateOrders()}
          total={calculateGrandTotal()}
          isVisible={!isGrandTotalVisible}
          toggleVisibility={() => setIsGrandTotalVisible(!isGrandTotalVisible)}
        />
      )}
      {people.map((person, personIndex) => (
        <div key={personIndex}>
          <div id={`card-${person.name}`} className="card">
            <div className={`card-title ${!visibleCards[personIndex] ? '' : 'no-border'}`}>
              <h2>{person.name}</h2>
              <div className='card-title-res'>
                <h2>{calculateTotal(person.orders).toFixed(2)}</h2>
                <button onClick={() => toggleCardVisibility(personIndex)}>
                  {visibleCards[personIndex] ? (
                    <CircleChevronDown className="icons-style" />
                  ) : (
                    <CircleChevronUp className="icons-style" />
                  )}
                </button>
              </div>
            </div>
            {!visibleCards[personIndex] && (
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



function GrandTotalCard({ items, isVisible, toggleVisibility }) {
  const formatPrice = (price) => {
    const numPrice = Number(price);
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  return (
    <>
      <div id='grand-total-card' className="card-total">
        <div className={`card-title ${!isVisible ? 'no-border' : ''}`}>
          <h2>Total</h2>
          <div className='card-title-res'>
            <h2>{formatPrice(calculateTotal())}</h2>
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
                  <h3>{item.quantity} × {formatPrice(item.price)}</h3>
                </div>
                <div className='card-product-res'>
                  <div>
                    {item.isSplit && <Split className="icons-style" />}
                  </div>
                  <h3>
                    {formatPrice(item.quantity * item.price)}
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