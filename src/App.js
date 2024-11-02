import React, { useState, useEffect } from "react";
import Papa from "papaparse";

function App() {
  const [data, setData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [uniqueTeams, setUniqueTeams] = useState([]);
  const [showFullTable, setShowFullTable] = useState(false); // Toggle for showing full/limited rows
  const [showSimplified, setShowSimplified] = useState(true); // Toggle for simplified/full columns

  const simplifiedColumns = ["RANK", "NAME", "TEAM", "POS", "PPG"]; // Columns for simplified view

  useEffect(() => {
    Papa.parse("/nba-metrics-23-24.csv", {
      download: true,
      header: true,
      complete: (result) => {
        const fullData = result.data;
        setData(fullData);

        // Store unique teams
        const teams = fullData.map((row) => row["TEAM"]);
        const uniqueTeamsArray = Array.from(new Set(teams));
        setUniqueTeams(uniqueTeamsArray);

        // Set initial display data to first 25 rows
        setDisplayData(fullData.slice(0, 25));
      },
    });
  }, []);

  // Update displayed data when toggling full/limited table
  const handleTableToggle = () => {
    setShowFullTable((prevState) => !prevState);
    setDisplayData(showFullTable ? data.slice(0, 25) : data); // Toggle between all and first 25 rows
  };

  // Toggle between simplified and full columns
  const handleSimplifiedToggle = () => {
    setShowSimplified((prevState) => !prevState);
  };

  return (
    <div className="page">
      <h1>NBA Player Stats</h1>

      <div className="filters">
        <label>
          <input
            type="checkbox"
            checked={showFullTable}
            onChange={handleTableToggle}
          />
          Show Full Table (All Rows)
        </label>
        <label>
          <input
            type="checkbox"
            checked={!showSimplified}
            onChange={handleSimplifiedToggle}
          />
          Show Simplified Columns
        </label>
        <label>
          <select>
            {uniqueTeams.map((team, index) => (
              <option key={index}>{team}</option>
            ))}
          </select>
        </label>
      </div>

      <table>
        <thead>
          <tr>
            {displayData.length > 0 &&
              Object.keys(displayData[0])
                .filter((key) => showSimplified || simplifiedColumns.includes(key)) // Filter headers based on simplified toggle
                .map((key) => (
                  <th key={key}>{key}</th>
                ))}
          </tr>
        </thead>
        <tbody>
          {displayData.map((row, index) => (
            <tr key={index}>
              {Object.keys(row)
                .filter((key) => showSimplified || simplifiedColumns.includes(key)) // Filter cells based on simplified toggle
                .map((key, i) => (
                  <td key={i}>{row[key] !== "" ? row[key] : index + 1}</td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
