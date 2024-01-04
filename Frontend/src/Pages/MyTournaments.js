import React, { useState, useEffect, useContext} from 'react';
import axios from 'axios';
import Searchbar from '../Searchbar';
import TableContent from '../TableContent';
import {AuthContext} from '../helpers/AuthContext';



function MyTournaments() {
  const [data, setData] = useState([]);
  const [search,setSearch] = useState('')
  const {authState, setAuthState} = useContext(AuthContext);

  useEffect(() => {
    // Check if accessToken exists in localStorage
    const accessToken = localStorage.getItem("accessToken");
  
    if (!accessToken) {
      // Handle the case where accessToken is not available
      console.error('Access token not found. API request not made.');
      return;
    }
  
    // Fetch data from the backend API
    axios.get('http://localhost:3001/tournaments/byaccount', {
      headers: {
        accessToken: accessToken,
      },
    })
      .then(response => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          console.log(authState.id);
          setData(response.data);
        
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);


  return (
    
    <div>
      <Searchbar
      search={search}
      setSearch={setSearch}
      />
      <TableContent
        items={Array.isArray(data) ? data.filter(item => ((item.tournament_name).toLowerCase()).includes(search.toLowerCase())) : []}
      />
    </div>
  );
}
export default MyTournaments;