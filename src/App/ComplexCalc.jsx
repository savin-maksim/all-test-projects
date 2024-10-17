import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Slider } from '@mui/material';
import { create, all, evaluate } from 'mathjs';
import { InitialTutorialModal } from '../Components/InitialTutorialModal';
import { QuestionMarkInstructionsModal } from '../Components/QuestionMarkInstructionsModal';
import { VariableModal } from '../Components/VariableModal';

const initialConfig = {
  number: 'BigNumber',
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
  const [historyType, setHistoryType] = useState('calculations');

  const historyRef = useRef(null);

  const handleClickOutside = useCallback((event) => {
    if (historyRef.current && !historyRef.current.contains(event.target)) {
      setShowHistory(false);
    }
  }, []);

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

  useEffect(() => {
    if (showHistory) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showHistory, handleClickOutside]);

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
  const handleVariableSubmit = useCallback(() => {
    if (variableName && input !== 'Error') {
      let variableValue = input.trim();

      if (!(variableValue.startsWith('(') && variableValue.endsWith(')'))) {
        variableValue = `(${variableValue})`;
      }

      setVariables(prevVariables => ({
        ...prevVariables,
        [variableName]: variableValue
      }));

      setVariableName('');
      setShowVariableModal(false);

      setSnackbarMessage(`Variable "${variableName}" saved successfully`);
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage('Invalid variable name or value');
      setSnackbarOpen(true);
    }
  }, [variableName, input, setVariables, setVariableName, setShowVariableModal, setSnackbarMessage, setSnackbarOpen]);

  const resolveNestedVariables = (expr) => {
    let resolvedExpr = expr;
    let variablesUsed = new Set();
    let iterations = 0;
    const maxIterations = 100; // Prevent infinite loops

    const resolveVariable = (match, varName) => {
      if (variables[varName]) {
        variablesUsed.add(varName);
        // Remove outer parentheses if present, then wrap in parentheses
        return `(${variables[varName].replace(/^\((.+)\)$/, '$1')})`;
      }
      return match; // Return the original match if variable not found
    };

    while (iterations < maxIterations) {
      const prevExpr = resolvedExpr;
      // Use lookbehind and lookahead to avoid matching parts of other variable names
      resolvedExpr = resolvedExpr.replace(/(?<![a-zA-Z0-9_])([a-zA-Z_][a-zA-Z0-9_]*)(?![a-zA-Z0-9_])/g, resolveVariable);

      if (prevExpr === resolvedExpr) {
        break; // Stop if no more replacements were made
      }

      iterations++;
    }

    if (iterations === maxIterations) {
      const unresolvedVariables = resolvedExpr.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g) || [];
      throw new Error(`Max iterations reached. Possible circular reference or undefined variables: ${unresolvedVariables.join(', ')}`);
    }

    return { resolvedExpr, variablesUsed: Array.from(variablesUsed) };
  };
  const calculateResult = () => {
    try {
      const { resolvedExpr, variablesUsed } = resolveNestedVariables(input);

      console.log("Resolved expression:", resolvedExpr); // For debugging

      const result = math.evaluate(resolvedExpr);
      const evaluatedResult = math.round(result, precision);

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

      // Show which variables were used in the calculation
      if (variablesUsed.length > 0) {
        setSnackbarMessage(`Used variables: ${variablesUsed.join(', ')}`);
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.log(error);
      const { resolvedExpr, variablesUsed } = resolveNestedVariables(input);
      const newHistory = [...history, input];
      const newHistoryRes = [...historyRes, String(evaluate(resolvedExpr))];

      setLastExpression(`${newHistory[newHistory.length - 1]} = ${newHistoryRes[newHistoryRes.length - 1]}`);
      setHistory(newHistory);
      setHistoryRes(newHistoryRes);

      setInput(evaluate(resolvedExpr));
      setSnackbarMessage(error.message);
      setSnackbarOpen(true);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const extraButtons = ['(', ')', 'AC', '<-', 'i', ' ∠ ', 'x^', '√', '%', ' / ', ' * ', ' - '];
  const keyboard = ['7', '8', '9', ' + ', '4', '5', '6', '1', '2', '3', '=', '0', '.'];
  const extraButtonsNewKeyboard = ['Instructions', '(', ')', 'AC', '<-', ' deg ', ' rad ', 'det', 'log', 'sin', 'cos', 'tan', 'pi', '=', ' rad to deg', ' deg to rad'];

  return (
    <main className='card'>
      <InitialTutorialModal
        isOpen={showInitialTutorial}
        onClose={() => setShowInitialTutorial(false)}
        handleQuestionMarkClick={handleQuestionMarkClick}
      />
      <QuestionMarkInstructionsModal
        isOpen={showQuestionMarkInstructions}
        onClose={() => setShowQuestionMarkInstructions(false)}
      />
      <VariableModal
        isOpen={showVariableModal}
        onClose={() => setShowVariableModal(false)}
        onSave={handleVariableSubmit}
        variableName={variableName}
        setVariableName={setVariableName}
        currentValue={input}
      />
      {showHistory ? (
        <div className='history-section' ref={historyRef}>
          <div className='history-section-top'>
            <button onClick={clearHistory} style={{ backgroundColor: 'var(--orange-color)', color: 'black' }}>
              Clear {historyType === 'calculations' ? 'History' : 'Variables'}
            </button>
            <button onClick={toggleHistoryType}>
              {historyType === 'calculations' ? 'Variables' : 'Calculations'}
            </button>
            <button style={{ backgroundColor: 'var(--red-color)' }} onClick={() => setShowHistory(false)}>✖</button>
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
                    <button onClick={() => deleteHistoryItem(history.length - index - 1)} style={{ padding: '0.5rem', marginLeft: '1rem', backgroundColor: 'var(--red-color)' }}>✖</button>
                  </div>
                  <div className='history-section-buttons'>
                    <button onClick={() => copyToClipboard(expr)}>Paste Input</button>
                    <button onClick={() => copyToClipboard(historyRes[history.length - index - 1])}>Paste Result</button>
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
                    <button onClick={() => copyToClipboard(name)}>Paste Variable</button>
                    <button onClick={() => copyToClipboard(value)}>Paste Value</button>
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
            <button style={{ padding: '0.5rem' }} onClick={() => setShowVariableModal(true)}>Variable</button>
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
                                : val === 'det'
                                  ? () => addToInputNumber('det([-1, 2; 3, 1])')
                                  : val === 'log'
                                    ? () => addToInputNumber('log(10000, 10)')
                                    : val === '='
                                      ? calculateResult
                                      : val === 'Instructions'
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
    </main>
  )
}

export default ComplexCalcV2
