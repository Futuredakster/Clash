import React, { useState, useEffect } from 'react';
import shuffle from 'lodash/shuffle';
import find from 'lodash/find';
import map from 'lodash/map';
import filter from 'lodash/filter';
import uniq from 'lodash/uniq';
import groupBy from 'lodash/groupBy';
import random from 'lodash/random';
import isNaN from 'lodash/isNaN';
import last from 'lodash/last';
import './Brackets.css';

const BracketApp = () => {
  const [brackets, setBrackets] = useState([]);
  const [bracketCount, setBracketCount] = useState(0);
  const [exampleTeams, setExampleTeams] = useState([]);

  const knownBrackets = [2, 4, 8, 16, 32, 64];

  useEffect(() => {
    const teams = [
      "New Jersey Devils", "New York Islanders", "New York Rangers", "Philadelphia Flyers", 
      "New Jersey Devils", "New York Islanders", "New York Rangers", "Philadelphia Flyers", 
      "New Jersey Devils", "New York Islanders", "New York Rangers", "Philadelphia Flyers", 
      "New Jersey Devils", "New York Islanders", "New York Rangers", "Philadelphia Flyers", 
      "New Jersey Devils", "New York Islanders", "New York Rangers", "Philadelphia Flyers", 
      "New Jersey Devils", "New York Islanders", "New York Rangers", "Philadelphia Flyers", 
      "New Jersey Devils", "New York Islanders", "New York Rangers", "Philadelphia Flyers", 
      "New Jersey Devils", "New York Islanders", "New York Rangers", "Philadelphia Flyers", 
      "New Jersey Devils", "New York Islanders", "New York Rangers", "Philadelphia Flyers", 
      "Pittsburgh Penguins", "Boston Bruins", "Buffalo Sabres", "Montreal Canadiens", 
      "Ottawa Senators", "Toronto Maple Leafs", "Carolina Hurricanes", "Florida Panthers", 
      "Tampa Bay Lightning", "Washington Capitals", "Winnipeg Jets", "Chicago Blackhawks", 
      "Columbus Blue Jackets", "Detroit Red Wings", "Nashville Predators", "St. Louis Blues", 
      "Calgary Flames", "Colorado Avalanche", "Edmonton Oilers", "Minnesota Wild", 
      "Vancouver Canucks", "Anaheim Ducks", "Dallas Stars", "Los Angeles Kings", 
      "Phoenix Coyotes", "San Jose Sharks", "Montreal Wanderers", "Quebec Nordiques", 
      "Hartford Whalers"
    ];
    setExampleTeams(shuffle(teams));
  }, []);

  const getBracket = (base) => {
    const closest = find(knownBrackets, (k) => k >= base);
    let byes = closest - base;

    if (byes > 0) base = closest;

    const newBrackets = [];
    let round = 1;
    let baseT = base / 2;
    let baseC = base / 2;
    let teamMark = 0;
    let nextInc = base / 2;

    for (let i = 1; i <= base - 1; i++) {
      let baseR = i / baseT;
      let isBye = false;

      if (byes > 0 && (i % 2 !== 0 || byes >= baseT - i)) {
        isBye = true;
        byes--;
      }

      const last = map(filter(newBrackets, (b) => b.nextGame === i), (b) => ({
        game: b.bracketNo,
        teams: b.teamnames,
      }));

      newBrackets.push({
        lastGames: round === 1 ? null : [last[0].game, last[1].game],
        nextGame: nextInc + i > base - 1 ? null : nextInc + i,
        teamnames: round === 1 ? [exampleTeams[teamMark], exampleTeams[teamMark + 1]] : [last[0].teams[random(1)], last[1].teams[random(1)]],
        bracketNo: i,
        roundNo: round,
        bye: isBye,
      });
      teamMark += 2;
      if (i % 2 !== 0) nextInc--;
      while (baseR >= 1) {
        round++;
        baseC /= 2;
        baseT = baseT + baseC;
        baseR = i / baseT;
      }
    }

    renderBrackets(newBrackets);
  };

  const renderBrackets = (struct) => {
    const groupCount = uniq(map(struct, (s) => s.roundNo)).length;

    const group = (
      <div className={`group${groupCount + 1}`} id={`b${bracketCount}`}>
        {map(Array.from({ length: groupCount }), (_, g) => (
          <div key={g + 1} className={`r${g + 1}`}>
            {map(groupBy(struct, (s) => s.roundNo)[g + 1], (gg, idx) => (
              <div key={idx}>
                {gg.bye ? (
                  <div></div>
                ) : (
                  <div className="bracketbox">
                    <span className="info1">{gg.bracketNo}</span>
                    <span className="info2">{gg.bracketNo}</span>
                    <span className="teama">{gg.teamnames[0]}</span>
                    <span className="teamb">{gg.teamnames[1]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
        <div className={`r${groupCount + 1}`}>
          <div className="final">
            <div className="bracketbox">
              <span className="teamc">{last(struct).teamnames[random(1)]}</span>
            </div>
          </div>
        </div>
      </div>
    );

    setBrackets((prevBrackets) => [...prevBrackets, group]);
    setBracketCount((prevCount) => prevCount + 1);
  };

  const addBracket = () => {
    const opts = parseInt(prompt('Bracket size (number of teams):', 32), 10);

    if (!isNaN(opts) && opts <= last(knownBrackets)) {
      getBracket(opts);
    } else {
      alert('The bracket size you specified is not currently supported.');
    }
  };

  const clearBrackets = () => {
    setBrackets([]);
  };

  return (
    <div>
      <button id="add" onClick={addBracket}>Add Bracket</button>
      <button id="clear" onClick={clearBrackets}>Clear Brackets</button>
      <div className="brackets" id="brackets">{brackets}</div>
    </div>
  );
};

export default BracketApp;