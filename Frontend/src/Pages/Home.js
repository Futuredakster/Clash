import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Searchbar from '../Searchbar';
import TableContent from '../TableContent';


function Home() {
  const [data, setData] = useState([]);
  const [search,setSearch] = useState('')


  useEffect(() => {
    // Check if accessToken exists in localStorage
    const accessToken = localStorage.getItem("accessToken");
  
    if (!accessToken) {
      // Handle the case where accessToken is not available
      console.error('Access token not found. API request not made.');
      return;
    }
  
    // Fetch data from the backend API
    axios.get('http://localhost:3001/tournaments', {
      headers: {
        accessToken: accessToken,
      },
    })
      .then(response => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          setData(response.data);
          console.log(response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
  


  return (
    <div className="Data">
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

export default Home;