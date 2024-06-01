import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Divisions.css'; // Import the CSS file

export const Divisions = ({ props, setProps, setDivision }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tournament_id = queryParams.get('tournament_id');
  const [data, setData] = useState([]);
  const [tournamentDetails, setTournamentDetails] = useState({});
  const navigate = useNavigate();

  const handleViewDetails = (item) => {
    setDivision(item);
    const queryString = new URLSearchParams({
      division_id: item.division_id,
    //  age_group: item.age_group
    }).toString();
    navigate(`/Form?${queryString}`);
  };

  const handleView = (item) => {
    setDivision(item);
    const queryString = new URLSearchParams({
      division_id: item.division_id,
    //  age_group: item.age_group
    }).toString();
    navigate(`/DisplayParticipents?${queryString}`);
  };


  const fetchTournamentDetails = async () => {
    try {
      const response = await axios.get("http://localhost:3001/tournaments/default", {
        params: { tournament_id }
      });
      if (response.data.error) {
        alert(response.data.error);
      } else {
        setTournamentDetails(response.data);
        setProps(response.data);
      }
    } catch (error) {
      console.error('Error fetching tournament details:', error);
    }
  };

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

    if (!props || props.length === 0) {
      fetchTournamentDetails();
    }
  }, [tournament_id, props]);

  return (
    <div className="dashboard">
      <div className="header">
        <h1>{tournamentDetails.tournament_name || (props.length !== 0 && props.tournament_name)}</h1>
        <p>Start Date: {tournamentDetails.start_date  || (props.length !== 0 && props.start_date)}</p>
        <p>End Date: {tournamentDetails.end_date  || (props.length !== 0 && props.end_date)}</p>
      </div>
      <div className="dashboard-container">
        {data.map((item, index) => (
          <div className="card" key={index}>
            <div className="card-title">{item.division_name}</div>
            <div className="card-content">
              <p><strong>Gender:</strong>{item.gender}</p>
              <p><strong>Age Range:</strong> {item.age_group}</p>
              <p><strong>Proficiency Level:</strong> {item.proficiency_level}</p>
              <p><strong>Category:</strong>{item.category}</p>
              <p><strong>Number of Competitors:</strong>{item.participant_count}</p>
            </div>
            <button className="btn btn-primary" onClick={() => handleViewDetails(item)}>
              Register!
            </button>
            <button className="btn btn-primary" onClick={() => handleView(item)}>
              See all participants!
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
