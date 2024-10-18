import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [question, setQuestion] = useState(null);
  const [currentIndex, setCureentInex] = useState(0);
  const [score, setScore] = useState(0); 
  const [showScore, setShowScore] = useState(false); 
  const input = useRef([]);

  // API fetch
  useEffect(() => {
    axios('https://the-trivia-api.com/v2/questions')
      .then((res) => {
        console.log(res.data);
        setQuestion(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Next button
  const Next = () => {
    const selectedOption = input.current.find(item => item && item.checked);

    if (selectedOption) {
      if (selectedOption.value === question[currentIndex].correctAnswer) {
        setScore(prevScore => prevScore + 10); 
      }
    }

    if (currentIndex < question.length - 1) {
      setCureentInex(currentIndex + 1);

      input.current.forEach(item => {
        if (item) {
          item.checked = false; 
        }
      });
    } else {
     
      setShowScore(true);
    }
  }

  // Shuffle options
  function shuffuling(arr) {
    const shufflearr = [];
    const emptyarray = [];
    for (let i = 0; i < arr.length; i++) {
      const randomnumber = Math.floor(Math.random() * arr.length);

      if (emptyarray.includes(randomnumber)) {
        i--;
      } else {
        emptyarray.push(randomnumber);
        shufflearr[randomnumber] = arr[i];
      }
    }
    return shufflearr;
  }

  return (
    <>
      <div className="quiz-container">
        <h1>Quiz</h1>

        {question && !showScore ? (
          <div>
            <h1>Q{currentIndex + 1}: {question[currentIndex].question.text}</h1>

            {shuffuling([...question[currentIndex].incorrectAnswers, question[currentIndex].correctAnswer]).map((item, index) => (
              <div key={`option ${index}`}>
                <input 
                  type="radio" 
                  name="question" 
                  value={item} 
                  id={index} 
                  ref={(el) => (input.current[index] = el)} />
                
                <label htmlFor={index}>{item}</label>
              </div>
            ))}
          </div>
        ) : showScore ? ( 
          <div>
            <h2>Your final score is: {score}</h2> 
          </div>
        ) : (
          <h1>Loading...</h1>
        )}
      </div>

      <br />

      {!showScore && ( 
        <div className="quiz-container">
          <button onClick={Next}>Next</button>
        </div>
      )}
    </>
  );
}

export default App;
