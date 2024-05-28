import React from 'react'
import { useLocation } from 'react-router-dom';
import {useEffect,useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Divisions = () => {
    const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tournament_id = queryParams.get('tournament_id');
  const tournament_name = queryParams.get('tournament_name');
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const handleViewDetails = (divisionId,age_group) => {
    const queryString = new URLSearchParams({ division_id: divisionId, age_group:age_group }).toString();
    navigate(`/Form?${queryString}`);
};


  useEffect(() => {
    axios.get("http://localhost:3001/divisions/praticepent", {
      params: {
        tournament_id: tournament_id,
      },
    })
      .then(response => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          setData(response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [tournament_id]);

  return (
    <div>
      <h1>{tournament_name}</h1>
      <table>
        <thead>
          <tr>
            <th>Age Group</th>
            <th>Proficiency Level</th>
            <th>Register!</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.age_group}</td>
              <td>{item.proficiency_level}</td>
              <td><button className="btn btn-primary" onClick={ () => handleViewDetails(item.division_id,item.age_group)}> Register!</button></td>
              </tr>
               ))}
               </tbody>
             </table>
    </div>
  )
}
