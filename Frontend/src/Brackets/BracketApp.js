import React, { useState } from 'react';
import axios from 'axios';
import './Brackets.css';
import { useLocation } from 'react-router-dom'; // For retrieving division_id from query params

const TournamentBracket = () => {
  const [bracketData, setBracketData] = useState([]);
  const [bracketCount, setBracketCount] = useState(0);

  // Getting division_id from URL params (e.g., ?division_id=123)
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const division_id = queryParams.get('division_id') || '';

  // Fetch brackets and generate them when the button is clicked
  const generateBracket = async () => {
    if (!division_id) {
      console.error('No division_id provided.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/brackets', {
        division_id,
      });
      console.log('Axios response:', response.data);
    } catch (error) {
      console.error('Error making Axios call:', error);
    }

    try {
      // Fetch brackets from the backend with the division_id
      const response = await axios.get('http://localhost:3001/brackets', {
        params: { division_id },
      });

      let fetchedBrackets = response.data;
      console.log('Fetched brackets:', fetchedBrackets);

      // Sort fetched brackets by bracket_id
      fetchedBrackets = fetchedBrackets.sort((a, b) => a.bracket_id - b.bracket_id);

      const newBrackets = [];

      // Build bracket structure based on fetched data
      fetchedBrackets.forEach((bracket) => {
        newBrackets.push({
          user1: bracket.user1 || 'Bye',
          user2: bracket.user2 || 'Bye',
          score1: bracket.score1 || 0, // Assuming the score comes from your backend
          score2: bracket.score2 || 0, // Assuming the score comes from your backend
          winner: bracket.winner, // Assuming your backend provides a winner field
        });
      });

      setBracketData(newBrackets); // Update state with the fetched brackets
      setBracketCount((prevCount) => prevCount + 1); // Track bracket count
    } catch (error) {
      console.error('Error fetching brackets from backend:', error);
    }
  };


  // Clear brackets function
  const clearBrackets = () => {
    setBracketData([]);
    setBracketCount(0);
  };

  return (
    <div>
      <button id="add" onClick={generateBracket}>Show Brackets</button> {/* Fetches and generates brackets when clicked */} 
      <button id="clear" onClick={clearBrackets}>Clear Brackets</button> 

      <main id="tournament" style={{ display: 'flex', flexDirection: 'row' }}>
        {bracketData.length > 0 ? (
          <>
            {/* Vertical stack of initial players */}
            <div className="rounds">
              {bracketData.map((bracket, idx) => (
                <ul className="round" key={idx} style={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '200px', listStyle: 'none', padding: 0
                }}>
                  <li className={`game game-top ${bracket.winner === 'user1' ? 'winner' : ''}`} style={{ borderBottom: '1px solid #aaa', paddingLeft: '20px' }}>
                    {bracket.user1} <span>{bracket.score1}</span>
                  </li>
                  <li className="game-spacer" style={{ borderRight: '1px solid #aaa', minHeight: '40px' }}>&nbsp;</li>
                  <li className={`game game-bottom ${bracket.winner === 'user2' ? 'winner' : ''}`} style={{ borderTop: '1px solid #aaa', paddingLeft: '20px' }}>
                    {bracket.user2} <span>{bracket.score2}</span>
                  </li>
                  <li className="spacer">&nbsp;</li>
                </ul>
              ))}
            </div>
            {/* Horizontal winners */}
            <div className="winners" style={{ display: 'flex', flexDirection: 'row' }}>
              {bracketData.map((bracket, idx) => (
                <div key={idx} style={{ padding: '0 20px' }}>
                  {bracket.winner ? (
                    <div>
                      Winner: {bracket.winner === 'user1' ? bracket.user1 : bracket.user2}
                    </div>
                  ) : (
                    <div>&nbsp;</div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>No brackets to display. Click 'Show Brackets' to fetch data.</p>
        )}
      </main>
    </div>
  );
};

export default TournamentBracket;
