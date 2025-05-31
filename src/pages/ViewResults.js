import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewResults = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7233/api/Results/detailed"
        );
        setResults(response.data);
        console.log("Received results:", response.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="container mt-4">
      <h2>View Results</h2>

      {/* DEBUG block */}
      <pre style={{ backgroundColor: "#f0f0f0", padding: "10px" }}>
        {JSON.stringify(results, null, 2)}
      </pre>

      {results.length > 0 ? (
        <ul>
          {results.map((res) => (
            <li key={res.resultId}>
              {res.userName} - {res.assessmentTitle} - {res.score} points
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default ViewResults;
