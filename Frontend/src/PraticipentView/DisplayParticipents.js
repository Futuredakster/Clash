import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const DisplayParticipants = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const division_id = queryParams.get('division_id') || '';
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3001/participants", {
      params: { division_id: division_id },
    })
    .then(response => {
      setData(response.data);
    })
    .catch(error => {
      setError(error);
    });
  }, [division_id]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Participants</h1>
      {data.length === 0 ? (
        <p>No participants found</p>
      ) : (
        <ul>
          {data.map((participant, index) => (
            <li key={index}>{participant.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DisplayParticipants;
