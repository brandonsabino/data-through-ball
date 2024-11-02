import React, { useState, useEffect } from "react";
import Papa from "papaparse";

function App() {
  const [data, setData] = useState([]);
  const [showFullTable, setShowFullTable] = useState(false);
  const simplified = ["RANK", "NAME", "TEAM", "POS", "PPG"];

  useEffect(() => {
    Papa.parse("/nba-metrics-23-24.csv", {
      download: true,
      header: true,
      complete: (result) => {
        setData(result.data); // Ensure entire dataset is set
      },
    });
  }, []);

  const toggleFullTable = () => {
    setShowFullTable(!showFullTable);
  };

  return (
    <div className="page">
      <h1>NBA Player Stats</h1>

      <div className="filters">
        <label>
          <input
            type="checkbox"
            checked={showFullTable}
            onChange={toggleFullTable}
          />
          Show Full Table
        </label>
      </div>

      <table>
        <thead>
          <tr>
            {/* Render headers dynamically based on whether the full table is shown */}
            {data.length > 0 && (showFullTable ?
              Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              )) :
              simplified.map((key) => (
                <th key={key}>{key}</th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {/* Render each row of data, showing either full or simplified columns */}
          {data.map((row, index) => (
            <tr key={index}>
              {(showFullTable ?
                Object.keys(row).map((key) => (
                  <td key={key}>{row[key] || index}</td> // Full data
                )) :
                simplified.map((key) => (
                  <td key={key}>{row[key] || index}</td> // Simplified data
                ))
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
