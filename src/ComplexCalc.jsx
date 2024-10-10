import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Slider } from '@mui/material';
import { create, all, unit, evaluate } from 'mathjs';
import Modal from './Modal';

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
  const inputRef = useRef(null);

  const [showInitialTutorial, setShowInitialTutorial] = useState(true);
  const [hasClickedFunctions, setHasClickedFunctions] = useState(false);
  const [showQuestionMarkInstructions, setShowQuestionMarkInstructions] = useState(false);

  // New state for variables
  const [variables, setVariables] = useState({});
  const [showVariableModal, setShowVariableModal] = useState(false);
  const [variableName, setVariableName] = useState('');
  const [showVariablesHistory, setShowVariablesHistory] = useState(false);
  const [historyType, setHistoryType] = useState('calculations'); // 'calculations' or 'variables'

  const toggleHistoryType = () => {
    setHistoryType(prevType => prevType === 'calculations' ? 'variables' : 'calculations');
  };

  const handleFunctionsClick = () => {
    setNewKeyboard(true);
    setHasClickedFunctions(true);
  };

  const handleQuestionMarkClick = () => {
    setShowQuestionMarkInstructions(true);
  };

  const deleteHistoryItem = (index) => {
    setHistory(prevHistory => prevHistory.filter((_, i) => i !== index));
    setHistoryRes(prevHistoryRes => prevHistoryRes.filter((_, i) => i !== index));
  };

  const deleteVariableItem = (name) => {
    setVariables(prevVariables => {
      const newVariables = { ...prevVariables };
      delete newVariables[name];
      return newVariables;
    });
  };

  /// Загрузка данных из localStorage при инициализации компонента
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('calculatorHistory') || '[]');
    const savedHistoryRes = JSON.parse(localStorage.getItem('calculatorHistoryRes') || '[]');
    const savedLastExpression = localStorage.getItem('calculatorLastExpression') || '';
    const savedShowHistory = JSON.parse(localStorage.getItem('calculatorShowHistory') || 'false');
    const savedVariables = JSON.parse(localStorage.getItem('calculatorVariables') || '{}');

    setHistory(savedHistory);
    setHistoryRes(savedHistoryRes);
    setLastExpression(savedLastExpression);
    setShowHistory(savedShowHistory);
    setVariables(savedVariables);
    setIsLoaded(true);
  }, []);

  // Сохранение данных в localStorage при их изменении
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('calculatorHistory', JSON.stringify(history));
      localStorage.setItem('calculatorHistoryRes', JSON.stringify(historyRes));
      localStorage.setItem('calculatorLastExpression', lastExpression);
      localStorage.setItem('calculatorShowHistory', JSON.stringify(showHistory));
      localStorage.setItem('calculatorVariables', JSON.stringify(variables));
    }
  }, [history, historyRes, lastExpression, showHistory, variables, isLoaded]);

  // Scroll Input
  const scrollInputToEnd = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.scrollLeft = inputRef.current.scrollWidth;
    }
  }, []);


  // Clipboard functions
  const copyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setInput(prevInput => prevInput + text);
        setSnackbarMessage(`Appended: ${text}`);
        setSnackbarOpen(true);
      })
      .catch((err) => {
        setSnackbarMessage('Failed to copy');
        setSnackbarOpen(true);
      });
    setShowHistory(false);
  }, []);
  const clearHistory = () => {
    if (historyType === 'calculations') {
      setHistory([]);
      setHistoryRes([]);
      setLastExpression('');
      localStorage.removeItem('calculatorHistory');
      localStorage.removeItem('calculatorHistoryRes');
      localStorage.removeItem('calculatorLastExpression');
    } else {
      setVariables({});
      localStorage.removeItem('calculatorVariables');
    }
  };

  // Add functions
  const addToInputNumber = val => {
    if (input === 'Error') {
      setInput(val);
    } else {
      setInput(prevInput => prevInput + val);
    }
    setTimeout(scrollInputToEnd, 0);
  };
  const addToInputExtra = val => {
    if (input === 'Error') {
      setInput(val);
    } else if (['/', '*', '-', '+'].includes(input[input.length - 2]) && val !== '(') {
      setInput(prevInput => prevInput.slice(0, -3) + val);
    } else {
      setInput(prevInput => prevInput + val);
    }
    setTimeout(scrollInputToEnd, 0);
  };

  // Clear functions
  const clearInput = () => {
    setInput('');
  }
  const handleBackspace = () => {
    if (input === 'Error') {
      setInput('');
    } else if (['/', '*', '-', '+'].includes(input[input.length - 2])) {
      setInput(prevInput => prevInput.slice(0, -3));
    } else {
      setInput(prevInput => prevInput.slice(0, -1));
    }
    setTimeout(scrollInputToEnd, 0);
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
      const result = input.replace(/\(?\s*(-?\d+(\.\d+)?)\s*([+\-])\s*(-?\d+(\.\d+)?)i\s*\)?/gi, (_, real, _1, sign, imaginary) => {
        // Convert both parts to numbers
        const realNum = parseFloat(real);
        const imaginaryNum = parseFloat(imaginary) * (sign === '-' ? -1 : 1);

        const absValue = Math.sqrt(realNum ** 2 + imaginaryNum ** 2);
        const angleValue = Math.atan2(imaginaryNum, realNum) * 180 / Math.PI;

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
      let result = input;

      // Replace variable names with their values
      Object.entries(variables).forEach(([name, value]) => {
        const regex = new RegExp(`\\b${name}\\b`, 'g');
        result = result.replace(regex, value);
      });

      result = result.replace(/(-?\d+(\.\d+)?) ∠ (-?\d+(\.\d+)?)/g, (_, r, _1, phi) => {
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

  const handleVariableSubmit = () => {
    if (variableName && input !== 'Error') {
      let variableValue = input.trim();

      // Check if the expression starts and ends with parentheses
      if (!(variableValue.startsWith('(') && variableValue.endsWith(')'))) {
        // If not, add parentheses
        variableValue = `(${variableValue})`;
      }

      setVariables(prevVariables => ({
        ...prevVariables,
        [variableName]: variableValue
      }));

      setVariableName('');
      setShowVariableModal(false);

      // Optional: Show a confirmation message
      setSnackbarMessage(`Variable "${variableName}" saved successfully`);
      setSnackbarOpen(true);
    } else {
      // Optional: Show an error message
      setSnackbarMessage('Invalid variable name or value');
      setSnackbarOpen(true);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const extraButtons = ['(', ')', 'AC', '<-', 'i', ' ∠ ', 'x^', '√', '%', ' / ', ' * ', ' - '];
  const keyboard = ['7', '8', '9', ' + ', '4', '5', '6', '1', '2', '3', '=', '0', '.'];
  const extraButtonsNewKeyboard = ['Variable', '?', '(', ')', 'AC', '<-', ' deg ', ' rad ', 'det', 'log', 'sin', 'cos', 'tan', 'pi', '=', 'rad to deg', 'deg to rad'];

  return (
    <div className='card'>
      <Modal isOpen={showInitialTutorial} onClose={() => setShowInitialTutorial(false)}>
        <h2 style={{ textAlign: 'center' }}>Welcome to the Complex Calculator!</h2>
        <p>To learn how to use this calculator, first click on the</p>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', }}>
          <button style={{ padding: '0.3rem 1rem', width: '30rem' }}>Functions</button>
        </div>
        <p>then click on the
          <button style={{ marginInline: '1rem', padding: '0.3rem 1rem' }}>?</button></p>
      </Modal>
      <Modal isOpen={showQuestionMarkInstructions} onClose={() => setShowQuestionMarkInstructions(false)}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Calculator Usage Instructions</h2>
        <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ border: '1px solid var(--primary-color)', padding: '1rem', borderRadius: 'var(--button-border-radius)' }}>
            <h3 style={{ textAlign: 'center' }}>Basic Usage</h3>
            <p>
              This calculator functions as a standard text-based calculator.
              Pay special attention to the <button style={{ padding: '0.3rem 1rem', marginRight: '1rem' }}>(</button><button style={{ padding: '0.3rem 1rem' }}>)</button> buttons,
              as an unclosed pair will result in an <span style={{ color: 'red' }}>Error</span>.
            </p>
          </div>
          <div style={{ border: '1px solid var(--primary-color)', padding: '1rem', borderRadius: 'var(--button-border-radius)' }}>
            <h3 style={{ textAlign: 'center' }}>Advanced Usage</h3>
            <p>
              Pressing the <button style={{ padding: '0.3rem 1rem' }}>Functions</button> button reveals an additional keyboard.
            </p>
            <p>
              Trigonometric functions use <span>radians</span> by default in their calculations,
              but you can use the <button style={{ padding: '0.3rem 1rem' }}>deg</button>, <button style={{ padding: '0.3rem 1rem' }}>rad</button>, <button style={{ padding: '0.3rem 1rem' }}>grad</button> buttons for automatic conversion.
            </p>
            <p>
              The calculator can convert any <span>physical quantities</span>.
            </p>
          </div>
          <div style={{ border: '1px solid var(--primary-color)', padding: '1rem', borderRadius: 'var(--button-border-radius)' }}>
            <h3 style={{ textAlign: 'center' }}>Complex Numbers</h3>
            <p>
              For <span>algebraic form</span>, use the format <span>a + bi</span>.
            </p>
            <p>
              In <span>polar form</span>, <span>degrees</span> are always used
              both for manual input and internal calculations.
            </p>
            <p>
              When you press the <button style={{ padding: '0.3rem 1rem' }}>To Polar</button> button, the complex value output will be in degrees, not radians.
            </p>
          </div>
          <div style={{ border: '1px solid var(--primary-color)', padding: '1rem', borderRadius: 'var(--button-border-radius)' }}>
            <h3 style={{ textAlign: 'center' }}>Variables</h3>
            <p>
              To create a variable, click the <button style={{ padding: '0.3rem 1rem' }}>Variables</button> button. A window will appear where you can <span>name your variable</span>. The current value in the input field will be assigned to this variable.
            </p>
            <p>
              You can <span>find all created variables</span> in the history section for later use. Access the history by clicking the <button style={{ padding: '0.3rem 1rem' }}>history</button> button, then select <button style={{ padding: '0.3rem 1rem' }}>Variables</button> to view your saved variables.
            </p>
            <p>
              Use variables in your calculations by simply typing their names in the input field.
            </p>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={showVariableModal}
        onClose={() => setShowVariableModal(false)}
        showSaveButton={true}
        onSave={handleVariableSubmit}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Create Variable</h2>
        <input
          value={variableName}
          onChange={(e) => setVariableName(e.target.value)}
          placeholder="Enter variable name"
          style={{
            width: '100%',
            height: '3rem',
            paddingRight: '1rem',
            textAlign: 'end',
            borderRadius: 'var(--button-border-radius)',
            border: '1px solid slategray',
            outline: 'none',
            fontSize: '1rem',
          }}
        />
        <p style={{ textAlign: 'center' }}>Current value: {input}</p>
      </Modal>
      {showHistory ? (
        <div className='history-section'>
          <div className='history-section-top'>
            <button onClick={clearHistory}>
              Clear {historyType === 'calculations' ? 'History' : 'Variables'}
            </button>
            <button onClick={toggleHistoryType}>
              {historyType === 'calculations' ? 'Variables' : 'Calculations'}
            </button>
            <button onClick={() => setShowHistory(false)}>✖</button>
          </div>
          <h2 style={{ textAlign: 'center' }}>
            {historyType === 'calculations' ? 'Calculations:' : 'Variables:'}
          </h2>
          <div>
            {historyType === 'calculations' ? (
              history.slice().reverse().map((expr, index) => (
                <div className='history-section-cards' key={history.length - index - 1}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>
                      {expr} = {historyRes[history.length - index - 1]}
                    </h1>
                    <button onClick={() => deleteHistoryItem(history.length - index - 1)} style={{ padding: '0.5rem', marginLeft: '1rem' }}>✖</button>
                  </div>
                  <div className='history-section-buttons'>
                    <button onClick={() => copyToClipboard(expr)}>Copy Input</button>
                    <button onClick={() => copyToClipboard(historyRes[history.length - index - 1])}>Copy Result</button>
                  </div>
                </div>
              ))
            ) : (
              Object.entries(variables).map(([name, value], index) => (
                <div className='history-section-cards' key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>{name} = {value}</h1>
                    <button onClick={() => deleteVariableItem(name)} style={{ padding: '0.5rem', marginLeft: '1rem' }}>✖</button>
                  </div>
                  <div className='history-section-buttons'>
                    <button onClick={() => copyToClipboard(name)}>Copy Variable</button>
                    <button onClick={() => copyToClipboard(value)}>Copy Value</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <>
          <button className='history-button' data-hover="Go to" onClick={() => setShowHistory(true)}>
            history
          </button>
          <input className='input-history' disabled value={lastExpression}>
          </input>
          <input
            ref={inputRef}
            className='input-input'
            onChange={(e) => {
              setInput(e.target.value);
              setTimeout(scrollInputToEnd, 0);
            }}
            onKeyDown={handleKeyDown}
            value={input}
            style={{
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              scrollBehavior: 'smooth'
            }}
          />
          <div className="settings">
            <button style={{ padding: '0.5rem' }} onClick={() => convertToPolar(input)}>To Polar</button>
            <button style={{ padding: '0.5rem' }} onClick={() => convertToAlgebraic(input)}>To Algebraic</button>
            {newKeyboard ? (
              <button style={{ padding: '0.5rem' }} onClick={() => setNewKeyboard(!newKeyboard)}>Numbers</button>
            ) : (
              <button style={{ padding: '0.5rem' }} onClick={handleFunctionsClick}>Functions</button>
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
                            ? () => addToInputNumber('cos(')
                            : val === 'sin'
                              ? () => addToInputNumber('sin(')
                              : val === 'tan'
                                ? () => addToInputNumber('tan(')
                                : val === 'Variable'
                                  ? () => setShowVariableModal(true)
                                  : val === 'det'
                                    ? () => addToInputNumber('det([-1, 2; 3, 1])')
                                    : val === 'log'
                                      ? () => addToInputNumber('log(10000, 10)')
                                      : val === '='
                                        ? calculateResult
                                        : val === 'rad to deg'
                                          ? () => addToInputExtra(' * 180 / pi ')
                                          : val === 'deg to rad'
                                            ? () => addToInputExtra(' * pi / 180 ')
                                            : val === '?'
                                              ? handleQuestionMarkClick
                                              : () => addToInputNumber(val)}>
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
