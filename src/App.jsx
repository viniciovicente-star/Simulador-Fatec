import React, { useState } from "react";
import data from "./data.json";
import fatecLogo from "./assets/fatec-logo.png";

function App() {
  const [step, setStep] = useState("home");
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const startQuiz = () => setStep("quiz");

  const setAnswer = (id, option) => setAnswers({ ...answers, [id]: option });

  const finishQuiz = () => {
    let points = 0;
    data.forEach(q => { if (answers[q.id] === q.answer) points++; });
    setScore(points);
    setStep("result");
  };

  // Tela inicial
  if(step === "home") {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <img src={fatecLogo} alt="FATEC" style={{ width: "180px", marginBottom: "20px" }} />
        <h1>Simulado FATEC MVP</h1>
        <p>Total de questões: {data.length}</p>
        <button onClick={startQuiz}>Iniciar Simulado</button>
      </div>
    );
  }

  // Tela de quiz (uma questão por vez)
  if(step === "quiz") {
    const q = data[currentIndex];
    return (
      <div className="quiz-container">
        <div className="progress-bar">
          Questão {currentIndex + 1} de {data.length}
        </div>

        <h3>{q.id}. {q.stem} ({q.theme})</h3>
        {q.image && <img src={q.image} alt="questão" />}

        {q.options.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx);
          return (
            <div key={idx}>
              <label>
                <input
                  type="radio"
                  name={`q${q.id}`}
                  value={letter}
                  checked={answers[q.id] === letter}
                  onChange={() => setAnswer(q.id, letter)}
                />
                {letter}) {opt}
              </label>
            </div>
          );
        })}

        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => setCurrentIndex(prev => prev - 1)}
            disabled={currentIndex === 0}
          >
            Anterior
          </button>

          {currentIndex < data.length - 1 ? (
            <button onClick={() => setCurrentIndex(prev => prev + 1)} style={{ marginLeft: "10px" }}>
              Próxima
            </button>
          ) : (
            <button onClick={finishQuiz} style={{ marginLeft: "10px" }}>Finalizar</button>
          )}
        </div>
      </div>
    );
  }

  // Tela de resultado com gabarito
  if(step === "result") {
    return (
      <div className="quiz-container">
        <h2 style={{ textAlign: "center" }}>Resultado</h2>
        <p style={{ textAlign: "center" }}>Você acertou {score} de {data.length} questões.</p>

        <h3>Gabarito:</h3>
        {data.map(q => {
          const userAnswer = answers[q.id];
          const isCorrect = userAnswer === q.answer;
          return (
            <div key={q.id} style={{ marginBottom: "15px", padding: "10px", border: "1px solid #ccc" }}>
              <p><strong>{q.id}. {q.stem}</strong> ({q.theme})</p>
              {q.image && <img src={q.image} alt="questão" />}
              <p>Sua resposta: <span style={{ color: isCorrect ? "green" : "red" }}>{userAnswer || "Não respondida"}</span></p>
              {!isCorrect && <p>Resposta correta: <span style={{ color: "green" }}>{q.answer}</span></p>}
            </div>
          );
        })}

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button onClick={() => {
            setStep("home");
            setAnswers({});
            setCurrentIndex(0);
            setScore(0);
          }}>
            Refazer
          </button>
        </div>
      </div>
    );
  }
}

export default App;
