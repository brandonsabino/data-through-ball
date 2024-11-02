import React, { useState, useEffect, useRef } from "react";
import Papa from "papaparse";
import { teamCityMap } from "./Teams.js"

function App() {
  const [data, setData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [uniqueTeams, setUniqueTeams] = useState([]);
  const [showSimplified, setShowSimplified] = useState(true); // Toggle for simplified/full columns
  const [selectedTeam, setSelectedTeam] = useState("Filter by Team"); // Track selected team
  const [dropdownOpen, setDropdownOpen] = useState(false); // Track dropdown state
  const [showTop25, setShowTop25] = useState(false); // Toggle for showing top 25 players
  const dropdownRef = useRef(null); // Reference for dropdown
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

        // Set initial display data to full data
        setDisplayData(fullData);
      },
    });
  }, []);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedTeam("Filter by Team"); // Reset team filter
    setShowSimplified(true); // Reset simplified view toggle
    setShowTop25(false); // Reset top 25 toggle
    setDisplayData(data); // Reset display data to full data
  };

  // Handle team selection
  const handleTeamSelect = (team) => {
    const fullTeamName = teamCityMap[team] || team;
    setSelectedTeam(fullTeamName); // Set selected team name
    setDropdownOpen(false); // Close dropdown after selection

    // Filter display data by selected team or show all players
    if (team === "All") {
      setDisplayData(data); // Show all players
    } else {
      const filteredData = data.filter(row => row.TEAM === team);
      setDisplayData(filteredData);
    }
  };

  // Toggle to show top 25 players
  const handleShowTop25 = () => {
    if (selectedTeam === "Filter by Team") {
      if (showTop25) {
        // If currently showing top 25, reset to all players
        setShowTop25(false);
        setDisplayData(data); // Reset display data to full data
      } else {
        // If not showing top 25, show only top 25 players
        setShowTop25(true);
        setDisplayData((prev) => prev.slice(0, 25)); // Show top 25 players
      }
    }
  };

  return (
    <div className="page">
      <h1>NBA Player Stats</h1>

      <div className="filters">
        <button onClick={handleResetFilters}>
          Reset All Filters
        </button>
        <button
          onClick={handleShowTop25}
          disabled={selectedTeam !== "Filter by Team"} // Disable button when filtering by team
          className={selectedTeam !== "Filter by Team" ? "disabled" : ""}
        >
          {showTop25 ? "Show All Players" : "Show Top 25"}
        </button>
        <label>
          <input
            type="checkbox"
            checked={!showSimplified}
            onChange={() => setShowSimplified((prev) => !prev)}
          />
          Show Simplified Columns
        </label>
        <label className="custom-select" ref={dropdownRef}>
          <div className="select-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
            {selectedTeam}
          </div>
          {dropdownOpen && (
            <ul className="select-options">
              <li onClick={() => handleTeamSelect("All")}>All Teams</li>
              {uniqueTeams.map((team, index) => (
                <li key={index} onClick={() => handleTeamSelect(team)}>
                  {teamCityMap[team] || team}
                </li>
              ))}
            </ul>
          )}
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
