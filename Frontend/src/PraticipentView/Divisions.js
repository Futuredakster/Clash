import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';



export const Divisions = ({ props, setProps, setDivision }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tournament_id = queryParams.get('tournament_id');
  const [data, setData] = useState([]);
  const [tournamentName, setTournamentName] = useState('');
  const navigate = useNavigate();

  // Function to handle the "Register" button click
  const handleViewDetails = (item) => {
    setDivision(item);
    const queryString = new URLSearchParams({
      division_id: item.division_id,
      age_group: item.age_group
    }).toString();
    navigate(`/Form?${queryString}`);
  };

  // Function to fetch the tournament name
  const fetchTournamentName = async () => {
    try {
      const response = await axios.get("http://localhost:3001/tournaments/default", {
        params: { tournament_id }
      });
      if (response.data.error) {
        alert(response.data.error);
      } else {
        setTournamentName(response.data);
        setProps(response.data);
      }
    } catch (error) {
      console.error('Error fetching tournament name:', error);
    }
  };

  // Effect to fetch data when the component mounts or when tournament_id or props change
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/divisions/praticepent", {
          params: { tournament_id }
        });
        if (response.data.error) {
          alert(response.data.error);
        } else {
          setData(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Fetch tournament name only if props is empty
    if (!props || props.length === 0) {
      fetchTournamentName();
    }
  }, [tournament_id, props]);

  return (
    <div className="dashboard">
      <div className="header">
        <h1>{tournamentName.tournament_name || (props.length !== 0 && props.tournament_name)}</h1>
      </div>
      <div className="dashboard-container">
        {data.map((item, index) => (
          <div className="card" key={index}>
            <div className="card-title">{item.age_group}</div>
            <div className="card-content">
              <strong>Proficiency Level:</strong> {item.proficiency_level}
            </div>
            <button className="btn btn-primary" onClick={() => handleViewDetails(item)}>
              Register!
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
