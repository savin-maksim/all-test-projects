import React, { useState } from 'react';
import { create, all } from 'mathjs';

const math = create(all);

function OldCalc() {
   const [input1, setInput1] = useState('');
   const [input2, setInput2] = useState('');
   const [result, setResult] = useState('');
   const [displayMode, setDisplayMode] = useState('algebraic');
   const [lastOperation, setLastOperation] = useState(''); // Добавлено состояние для последней операции

   const parseInput = (input) => {
      if (input.includes('ang')) {
         const [r, theta] = input.split('ang').map(Number);
         const thetaRadians = math.unit(theta, 'deg').toNumber('rad');
         return math.complex({ r: r, phi: thetaRadians });
      } else {
         return math.complex(input);
      }
   };

   const handleOperation = (operation) => {
      try {
         const complex1 = parseInput(input1);
         const complex2 = parseInput(input2);
         let operationResult;

         switch (operation) {
            case '+':
               operationResult = math.add(complex1, complex2);
               break;
            case '-':
               operationResult = math.subtract(complex1, complex2);
               break;
            case '*':
               operationResult = math.multiply(complex1, complex2);
               break;
            case '/':
               operationResult = math.divide(complex1, complex2);
               break;
            default:
               setResult('Неизвестная операция');
               return;
         }

         setLastOperation(operation); // Обновляем состояние последней операции

         if (displayMode === 'algebraic') {
            setResult(operationResult.toString());
         } else {
            const r = operationResult.abs();
            const theta = operationResult.arg();
            const thetaDegrees = math.unit(theta, 'rad').toNumber('deg');
            setResult(`${r.toFixed(3)}ang${thetaDegrees.toFixed(3)}`);
         }
      } catch (error) {
         setResult(`Ошибка: ${error.message}`);
      }
   };

   const toggleDisplayMode = () => {
      setDisplayMode(displayMode === 'algebraic' ? 'exponential' : 'algebraic');
   };

   return (
      <div>
         <input
            type="text"
            value={input1}
            onChange={(e) => setInput1(e.target.value)}
            placeholder="Введите первое комплексное число"
         />
         <input
            type="text"
            value={input2}
            onChange={(e) => setInput2(e.target.value)}
            placeholder="Введите второе комплексное число"
         />
         <div>
            <button onClick={() => handleOperation('+')}>+</button>
            <button onClick={() => handleOperation('-')}>-</button>
            <button onClick={() => handleOperation('*')}>*</button>
            <button onClick={() => handleOperation('/')}>/</button>
         </div>
         <div>
            <button onClick={toggleDisplayMode}>Сменить форму</button>
         </div>

         {lastOperation && <h3>Последняя операция: {lastOperation}</h3>}
         <h2>Результат: {result}</h2>
      </div>
   );
}

export default OldCalc;