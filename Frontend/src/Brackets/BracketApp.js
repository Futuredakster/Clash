import React, { useState } from 'react';
import map from 'lodash/map';
import uniq from 'lodash/uniq';
import './Brackets.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const BracketApp = () => {
  const [brackets, setBrackets] = useState([]);
  const [bracketCount, setBracketCount] = useState(0);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const division_id = queryParams.get('division_id') || '';

  // Fetch brackets and generate brackets when the button is clicked
  const generateBracket = async () => {
    if (!division_id) {
      console.error('No division_id provided.');
      return;
    }

    try {
      // Fetch brackets from the backend
      const response = await axios.get('http://localhost:3001/brackets', {
        params: { division_id },
      });
      let fetchedBrackets = response.data;  // Store fetched brackets
      console.log('Fetched brackets:', fetchedBrackets);

      // Sort fetched brackets by bracket_id
      fetchedBrackets = fetchedBrackets.sort((a, b) => a.bracket_id - b.bracket_id);

      let bracketSize = fetchedBrackets.length;  // Use fetched number of brackets
      if (bracketSize === 0) {
        console.error("No brackets found to display");
        return;
      }

      const newBrackets = [];

      for (let i = 0; i < bracketSize; i++) {
        const user1 = fetchedBrackets[i]?.user1 || "Bye";  // Handle empty user1
        const user2 = fetchedBrackets[i]?.user2 || "Bye";  // Handle empty user2

        newBrackets.push({
          nextGame: i + 1 > bracketSize - 1 ? null : i + 1,
          user1: user1,
          user2: user2,
          bracketNo: fetchedBrackets[i].bracket_id,
          bye: !user1 || !user2,
        });
      }

      console.log("newBrackets", newBrackets);
      renderBrackets(newBrackets);
    } catch (error) {
      console.error('Error fetching brackets from backend:', error);
    }
  };

  const renderBrackets = (struct) => {
    // Instead of grouping by round (as your data doesn't seem to have rounds),
    // display each bracket one after the other in a simple list.
    const group = (
      <div className={`group${bracketCount}`} id={`b${bracketCount}`}>
        {map(struct, (gg, idx) => (
          <div key={idx}>
            {gg.bye ? (
              <div></div>
            ) : (
              <div className="bracketbox">
                <span className="info1">Bracket {gg.bracketNo}</span>
                <span className="teama">{gg.user1}</span>  {/* Display user1 */}
                <span className="teamb">{gg.user2}</span>  {/* Display user2 */}
              </div>
            )}
          </div>
        ))}
      </div>
    );

    setBrackets((prevBrackets) => [...prevBrackets, group]);
    setBracketCount((prevCount) => prevCount + 1);
  };

  const clearBrackets = () => {
    setBrackets([]);
  };

  return (
    <div>
      <button id="add" onClick={generateBracket}>Show Brackets</button> {/* Fetches and generates brackets when clicked */}
      <button id="clear" onClick={clearBrackets}>Clear Brackets</button>
      <div className="brackets" id="brackets">
        {brackets.map((bracketGroup, idx) => (
          <div key={idx}>{bracketGroup}</div>
        ))}
      </div>
    </div>
  );
};

export default BracketApp;
