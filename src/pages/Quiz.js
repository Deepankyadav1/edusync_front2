import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

const Quiz = () => {
  const { id } = useParams(); // assessmentId from route
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await API.get(`/assessments/${id}`);
        const quizData = res.data;
        quizData.questions = JSON.parse(quizData.questions); // Parse JSON string to array
        setQuiz(quizData);
      } catch (err) {
        console.error("Failed to fetch quiz:", err);
        alert("Quiz not found.");
        navigate("/courses");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id, navigate]);

  const handleSelect = (qIndex, selectedOption) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: selectedOption }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.answer) {
        score += quiz.maxScore / quiz.questions.length;
      }
    });

    const payload = {
      assessmentId: quiz.assessmentId,
      userId: localStorage.getItem("userId"),
      score: Math.round(score),
      attemptDate: new Date().toISOString(),
    };

    try {
      await API.post("/results", payload);
      alert(`Quiz submitted! Your score: ${Math.round(score)}`);
      navigate("/results");
    } catch (err) {
      console.error("Failed to submit quiz:", err);
      alert("Submission failed. Please try again.");
    }
  };

  if (loading) return <div className="container mt-4">Loading quiz...</div>;

  if (!quiz) return null;

  return (
    <div className="container mt-4">
      <h3>{quiz.title}</h3>
      <form onSubmit={handleSubmit}>
        {quiz.questions.map((q, index) => (
          <div key={index} className="mb-4">
            <p>
              <strong>
                Q{index + 1}: {q.question}
              </strong>
            </p>
            {q.options.map((option, i) => (
              <div className="form-check" key={i}>
                <input
                  className="form-check-input"
                  type="radio"
                  name={`q-${index}`}
                  value={option}
                  checked={answers[index] === option}
                  onChange={() => handleSelect(index, option)}
                  required
                />
                <label className="form-check-label">{option}</label>
              </div>
            ))}
          </div>
        ))}
        <button className="btn btn-primary" type="submit">
          Submit Quiz
        </button>
      </form>
    </div>
  );
};

export default Quiz;
