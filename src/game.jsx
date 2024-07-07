import { React, useState } from 'react';

import Game from './game';
import './index.scss';
import questions from './questions';
import Result from './result';


function App() {

  const [ step, setStep ] = useState(0)
  const [ correctAnswer, setCorrectAnswer ] = useState(0)
  const question = questions[step]

  const onClickVariant = (index) => {
    setStep(step + 1)

    if (index === question.correct) {
      setCorrectAnswer(correctAnswer + 1)
    }
  }

  return (
    <div className="App">
      {
        step !== questions.length ? (
          <Game step={step} question={question} onClickVariant={onClickVariant}/>
        ) : (
          <Result correctAnswer={correctAnswer}/>
        )}
    </div>
  );
}

export default App;
