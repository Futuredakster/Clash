import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Searchbar from '../Searchbar';
import TableContent from '../TableContent';


function Home() {
  const [data, setData] = useState([]);
  const [search,setSearch] = useState('')


  useEffect(() => {
    // Fetch data from the backend API
    axios.get('http://localhost:3001/tournaments')
      .then(response => {
        setData(response.data);
        console.log(data);
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
       items={data.filter(item=> ((item.tournament_name).toLowerCase()).includes(search.toLowerCase()))}
      />
    </div>
  );
}

export default Home;