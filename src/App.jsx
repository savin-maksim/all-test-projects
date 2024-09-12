import { React, useState } from 'react';
import './index.scss';

const questions = [
  {
    title: '1. Какое у Гарри второе имя?',
    variants: ['В смысле второе имя?', 'Артур', 'Джеймс', 'Сириус',],
    correct: 2
  },
  {
    title: '2. Какой журнал издает отец Полумны Лавгуд, Ксенофилиус?',
    variants: ['Ведьмина гора', 'Волшебный вестник', 'Пророк', 'Придира'],
    correct: 3
  },
  {
    title: '3. Кто анонимно отправляет Гарри мантию-невидимку на первое Рождество в Хогвартсе?',
    variants: ['Северус Снейп', 'Альбус Дамблдор', 'Минерва Макгонагалл', 'Сириус Блэк'],
    correct: 1
  },
  {
    title: '4. Какое животное является символом факультета Когтевран Школы Чародейства и Волшебства Хогвартс?',
    variants: ['З - Змея', 'Л - Леу', 'Б - Барсук', 'Нет это ты Барсук, потому что О - Орель'],
    correct: 3
  },
  {
    title: '5. Какое зелье приносит удачу тому, кто его выпьет?',
    variants: ['Амортенция', 'Педигри', 'Ласточка', 'Феликс Фелицис'],
    correct: 3
  },
  {
    title: '6. Как зовут собаку Хагрида?',
    variants: ['Клык', 'Живоглот', 'Пушок', 'Мерлин'],
    correct: 0
  },
  {
    title: '7. Что преподает профессор Макгонагалл?',
    variants: ['Преподаватель прорицаний', 'Преподаватель защиты от темных искусств', 'Преподаватель трансфигурации', 'Преподаватель зельеварения'],
    correct: 2
  },
  {
    title: '8. Какое прозвище было у отца Гарри Поттера, когда он учился в Хогвартсе вместе со своими друзьями (Мародерами)?',
    variants: ['Сохатый', 'Лунатик', 'Хвост', 'Бродяга'],
    correct: 0
  },
  {
    title: '9. Какое второе имя дочери Гарри Поттера?',
    variants: ['Полумна', 'Да там что у всех есть вторые имена?', 'Джинни', 'Лили'],
    correct: 0
  },
  {
    title: '9¾ Какой номер был у платформы, с которой все ученики отправлялись в Хогвартс?',
    variants: ['Да'],
    correct: 0
  }
];

function Result({ correctAnswer }) {
  return (
    <div className="result">
      <img src="https://cdn-icons-png.flaticon.com/512/2278/2278992.png" />
      <h2>Вы отгадали {correctAnswer} ответа из {questions.length}</h2>
      <a href="/">
        <button>Попробовать снова</button>
      </a>
    </div>
  );
}

function Hello({ onStart }) {
  return (
    <div className="result">
      <img src="https://polinka.top/uploads/posts/2023-05/1684862377_polinka-top-p-kartinki-garri-pottera-anime-instagram-38.jpg" />
      <h2>Добро пожаловать, прекрасная волшебница!</h2>
      <p>Ты держишь в руках не просто коробку, а портал в мир захватывающих приключений. Но прежде чем ты отправишься в путешествие по лабиринтам знаний о Хогвартсе и его обитателях, один тайный поклонник, желает преподнести тебе нечто особенное.</p>
      <p>Отсканируй этот код, и ты откроешь путь к волшебному сюрпризу.</p>
      <p>Удачи, волшебница!</p>
      <img className="QR" src="/Hello.svg" alt="QR код" />
      <p className='begins'>
        <button onClick={onStart}>Начать путешествие</button>
      </p>
    </div>
  );
}

function Game({ step, question, onClickVariant }) {

  const percentage = Math.round(step / questions.length * 100)

  return (
    <>
      <div className="progress">
        <div style={{ width: `${percentage}%` }} className="progress__inner"></div>
      </div>
      <h1>{question.title}</h1>
      <ul>
        {question.variants.map((text, index) => (
          <li onClick={() => onClickVariant(index)} key={text}>{text}</li>
        ))}
      </ul>
    </>
  );
}

function App() {

  const [showHello, setShowHello] = useState(false);
  const [step, setStep] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const question = questions[step];

  const onClickVariant = (index) => {
    setStep(step + 1)

    if (index === question.correct) {
      setCorrectAnswer(correctAnswer + 1)
    }
  };

  return (
    <div className="App">
      {showHello ? (
        <Hello onStart={() => setShowHello(false)} />
      ) : (
        step !== questions.length ? (
          <Game step={step} question={question} onClickVariant={onClickVariant} />
        ) : (
          <Result correctAnswer={correctAnswer} />
        )
      )}
    </div>
  );
}

export default App;

