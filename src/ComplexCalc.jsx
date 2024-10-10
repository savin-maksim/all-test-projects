import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Slider } from '@mui/material';
import { create, all, unit } from 'mathjs';

// configure the default type of numbers as BigNumbers
const initialConfig = {
  // Default type of number
  // Available options: 'number' (default), 'BigNumber', or 'Fraction'
  number: 'BigNumber',

  // Number of significant digits for BigNumbers
  precision: 20
};

const math = create(all, initialConfig);


function ComplexCalcV2() {
  const [input, setInput] = useState('');
  const [lastExpression, setLastExpression] = useState('');
  const [history, setHistory] = useState([]);
  const [historyRes, setHistoryRes] = useState([]);
  const [precision, setPrecision] = useState(3);
  const [showHistory, setShowHistory] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [newKeyboard, setNewKeyboard] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  /// Загрузка данных из localStorage при инициализации компонента
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('calculatorHistory') || '[]');
    const savedHistoryRes = JSON.parse(localStorage.getItem('calculatorHistoryRes') || '[]');
    const savedLastExpression = localStorage.getItem('calculatorLastExpression') || '';
    const savedShowHistory = JSON.parse(localStorage.getItem('calculatorShowHistory') || 'false');

    setHistory(savedHistory);
    setHistoryRes(savedHistoryRes);
    setLastExpression(savedLastExpression);
    setShowHistory(savedShowHistory);
    setIsLoaded(true);
  }, []);

  // Сохранение данных в localStorage при их изменении
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('calculatorHistory', JSON.stringify(history));
      localStorage.setItem('calculatorHistoryRes', JSON.stringify(historyRes));
      localStorage.setItem('calculatorLastExpression', lastExpression);
      localStorage.setItem('calculatorShowHistory', JSON.stringify(showHistory));
    }
  }, [history, historyRes, lastExpression, showHistory, isLoaded]);
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Clipboard functions
  const copyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setInput(text);
        setSnackbarMessage(`Copied: ${text}`);
        setSnackbarOpen(true);
      })
      .catch((err) => {
        setSnackbarMessage('Failed to copy');
        setSnackbarOpen(true);
      });
    setShowHistory(false);
  }, []);
  const clearHistory = () => {
    setHistory([]);
    setHistoryRes([]);
    setLastExpression('');
    setShowHistory(false);
    localStorage.removeItem('calculatorHistory');
    localStorage.removeItem('calculatorHistoryRes');
    localStorage.removeItem('calculatorLastExpression');
    localStorage.removeItem('calculatorShowHistory');
  };

  // Add functions
  const addToInputNumber = val => {
    if (input === 'Error') {
      setInput(val);
    } else {
      setInput(input + val);
    }
  };
  const addToInputExtra = val => {
    if (input === 'Error') {
      setInput(val);
    } else if (['/', '*', '-', '+'].includes(input[input.length - 2]) && val !== '(') {
      setInput(input.slice(0, -3) + val);
    } else {
      setInput(input + val);
    }
  };

  // Clear functions
  const clearInput = () => {
    setInput('');
  }
  const handleBackspace = () => {
    if (input === 'Error') {
      setInput('');
    } else if (['/', '*', '-', '+'].includes(input[input.length - 2])) {
      setInput(input.slice(0, -3));
    }
    else {
      setInput(input.slice(0, -1));
    }
  };

  //Handle functions
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      calculateResult();
    }
  };

  // Math functions
  const convertToPolar = (input) => {
    try {
      const result = input.replace(/\(?\s*(-?\d+(\.\d+)?)\s*[\+\-]\s*(-?\d+(\.\d+)?)i\s*\)?/gi, (_, real, _1, imaginary) => {
        const absValue = math.evaluate(`sqrt(${real}^2+${imaginary}^2)`);
        const angleValue = math.evaluate(`atan2(${imaginary}, ${real})*180/pi`);
        return `(${math.round(absValue, precision)} ∠ ${math.round(angleValue, precision)})`;
      });

      setInput(`${result}`);
    } catch (error) {
      console.log(error);
      setInput('Error');
    }
  };
  const convertToAlgebraic = () => {
    const result = input.replace(/(-?\d+(\.\d+)?) ∠ (-?\d+(\.\d+)?)/g, (_, r, _1, phi) => {
      const a = math.evaluate(`${r}*cos(${phi}*pi/180)`);
      const b = math.evaluate(`${r}*sin(${phi}*pi/180)`);
      return `${math.round(a, precision)} + ${math.round(b, precision)}i`;
    });
    const evaluatedResult = math.evaluate(result);

    if (math.isComplex(evaluatedResult)) {
      setInput(`(${evaluatedResult})`);
    } else {
      setInput(`${evaluatedResult}`);
    }
  };
  const calculateResult = () => {
    try {
      const result = input.replace(/(-?\d+(\.\d+)?) ∠ (-?\d+(\.\d+)?)/g, (_, r, _1, phi) => {
        const a = math.evaluate(`${r}*cos(${phi}*pi/180)`);
        const b = math.evaluate(`${r}*sin(${phi}*pi/180)`);
        return `${a} + ${b}i`;
      });

      const evaluatedResult = math.round(math.evaluate(result), precision);
      const newHistory = [...history, input];
      const newHistoryRes = [...historyRes, String(evaluatedResult)];

      setLastExpression(`${newHistory[newHistory.length - 1]} = ${newHistoryRes[newHistoryRes.length - 1]}`);
      setHistory(newHistory);
      setHistoryRes(newHistoryRes);

      if (math.isComplex(evaluatedResult)) {
        setInput(`(${evaluatedResult})`);
      } else {
        setInput(`${evaluatedResult}`);
      }
    } catch (error) {
      console.log(error)
      setInput('Error');
    }
  };

  const extraButtons = ['(', ')', 'AC', '<-', 'i', ' ∠ ', 'x^', '√', '%', ' / ', ' * ', ' - '];
  const keyboard = ['7', '8', '9', ' + ', '4', '5', '6', '1', '2', '3', '=', '0', '.'];
  const extraButtonsNewKeyboard = ['(', ')', 'AC', '<-', ' deg ', ' rad ', ' grad ', '', 'cos', 'sin', 'tan', 'F[x]', 'e', 'pi', 'det', 'log', '=', 'rad to deg', 'deg to rad'];

  return (
    <div className='card'>
      {showHistory ? (
        <div className='history-section'>
          <div className='history-section-top'>
            <button onClick={clearHistory}>
              Clear History
            </button>
            <button onClick={() => setShowHistory(false)}>
              ✖
            </button>
          </div>
          <div>
            {history.slice().reverse().map((expr, index) => (
              <div className='history-section-cards' key={history.length - index - 1}>
                <div>
                  <h1>
                    {expr} = {historyRes[history.length - index - 1]}
                  </h1>
                  <div className='history-section-buttons'>
                    <button onClick={() => copyToClipboard(expr)}>Copy Input</button>
                    <button onClick={() => copyToClipboard(historyRes[history.length - index - 1])}>Copy Result</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <button className='history-button' data-hover="Go to" onClick={() => setShowHistory(!showHistory)}>
            history
          </button>
          <input className='input-history' disabled value={lastExpression}>
          </input>
          <input className='input-input' onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} value={input}>
          </input>
          <div className="settings">
            <button style={{ padding: '0.5rem' }} onClick={() => convertToPolar(input)}>To Polar</button>
            <button style={{ padding: '0.5rem' }} onClick={() => convertToAlgebraic(input)}>To Algebraic</button>
            {newKeyboard ? (
              <button style={{ padding: '0.5rem' }} onClick={() => setNewKeyboard(!newKeyboard)}>Numbers</button>
            ) : (
              <button style={{ padding: '0.5rem' }} onClick={() => setNewKeyboard(!newKeyboard)}>Functions</button>
            )}

          </div>
          <div>
            {newKeyboard ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', justifyItems: 'center', alignItems: 'center', paddingBottom: 'calc(var(--primary-gap) * 2)' }}>
                  <div>Precision:{precision}</div>
                  <Slider
                    value={precision}
                    min={1}
                    max={20}
                    step={1}
                    onChange={(e, newValue) => setPrecision(newValue)}
                    valueLabelDisplay="auto"
                  />
                </div>
                <div className='extra-buttons-new-keyboard'>
                  {extraButtonsNewKeyboard.map((val) => (
                    <button key={val} onClick={
                      val === 'AC'
                        ? clearInput
                        : val === '<-'
                          ? handleBackspace
                          : val === 'cos'
                            ? () => addToInputExtra('cos(')
                            : val === 'sin'
                              ? () => addToInputExtra('sin(')
                              : val === 'tan'
                                ? () => addToInputExtra('tan(')
                                : val === 'F[x]'
                                  ? () => addToInputExtra('[a=, b=, a*b]')
                                  : val === 'det'
                                    ? () => addToInputExtra('det([-1, 2; 3, 1])')
                                    : val === 'log'
                                      ? () => addToInputExtra('log(10000, 10)')
                                      : val === '='
                                        ? calculateResult
                                        : val === 'rad to deg'
                                          ? () => addToInputExtra(' * 180 / pi ')
                                          : val === 'deg to rad'
                                            ? () => addToInputExtra(' * pi / 180 ')
                                            : () => addToInputExtra(val)}>
                      {val}
                    </button>))}
                </div>
              </>
            ) : (
              <>
                <div className='extra-buttons'>
                  {extraButtons.map((val) => (
                    <button key={val} onClick={
                      val === 'AC'
                        ? clearInput
                        : val === '<-'
                          ? handleBackspace
                          : val === 'x^'
                            ? () => addToInputExtra('^')
                            : val === '√'
                              ? () => addToInputExtra('sqrt(')
                              : () => addToInputExtra(val)}>
                      {val}
                    </button>))}
                </div>
                <div className="keyboard">
                  {keyboard.map((val) => (
                    <button key={val} onClick={
                      val === ' + '
                        ? () => addToInputExtra(val)
                        : val === '='
                          ? calculateResult
                          : () => addToInputNumber(val)
                    }>
                      {val}
                    </button>))}
                </div>
              </>)}
          </div>
        </>
      )}
    </div>
  )
}

export default ComplexCalcV2
