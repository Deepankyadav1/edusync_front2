import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

const AddAssessment = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      answer: "",
      marks: 1,
    },
  ]);
  const [maxScore, setMaxScore] = useState(100);
  const [remainingMarks, setRemainingMarks] = useState(100);
  const [error, setError] = useState(null);

  // 🔁 Recalculate remaining marks whenever questions or maxScore changes
  useEffect(() => {
    const totalAssigned = questions.reduce(
      (acc, q) => acc + Number(q.marks),
      0
    );
    setRemainingMarks(maxScore - totalAssigned);
  }, [questions, maxScore]);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    if (field === "options") {
      updated[index].options = value;
    } else {
      updated[index][field] = value;
    }
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        answer: "",
        marks: 1,
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      courseId,
      title,
      questions: JSON.stringify(questions),
      maxScore: Number(maxScore),
    };

    try {
      await API.post("/assessments", payload);
      alert("Assessment added!");
      navigate(`/courses/${courseId}`);
    } catch (error) {
      setError("Failed to add assessment. Please try again.");
      console.error("Failed to add assessment", error);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      <h3>Add Quiz (Assessment)</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Max Score</label>
        <input
          className="form-control mb-2"
          type="number"
          value={maxScore}
          onChange={(e) => setMaxScore(Number(e.target.value))}
        />

        <label className="fw-bold">
          Remaining Marks:{" "}
          <span style={{ color: remainingMarks < 0 ? "red" : "green" }}>
            {remainingMarks}
          </span>
        </label>

        <h5 className="mt-4">Questions</h5>
        {questions.map((q, index) => (
          <div key={index} className="border p-3 mb-3 rounded bg-light">
            <strong>Question {index + 1}</strong>
            <input
              className="form-control mb-2 mt-1"
              placeholder="Enter question"
              value={q.question}
              onChange={(e) =>
                handleQuestionChange(index, "question", e.target.value)
              }
            />

            <div className="row">
              {q.options.map((opt, optIdx) => (
                <div key={optIdx} className="col-md-6 mb-2">
                  <input
                    className="form-control"
                    placeholder={`Option ${optIdx + 1}`}
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(index, optIdx, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            <label>Correct Answer</label>
            <select
              className="form-select mb-2"
              value={q.answer}
              onChange={(e) =>
                handleQuestionChange(index, "answer", e.target.value)
              }
            >
              <option value="">Select correct option</option>
              {q.options.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt || `Option ${i + 1}`}
                </option>
              ))}
            </select>

            <label>Marks for this question</label>
            <input
              className="form-control"
              type="number"
              min="1"
              value={q.marks}
              onChange={(e) =>
                handleQuestionChange(index, "marks", Number(e.target.value))
              }
            />
          </div>
        ))}

        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={addQuestion}
        >
          ➕ Add Another Question
        </button>

        <button type="submit" className="btn btn-primary w-100">
          ✅ Create Quiz
        </button>
      </form>
    </div>
  );
};

export default AddAssessment;
