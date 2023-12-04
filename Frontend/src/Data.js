
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Topbar from './Topbar';
import TableContent from './TableContent';


function Data() {
  const [data, setData] = useState([]);
  const [search,setSearch] = useState('')


  useEffect(() => {
    // Fetch data from the backend API
    axios.get('http://localhost:3001/posts')
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
      <Topbar
      search={search}
      setSearch={setSearch}
      />
      <TableContent
       items={data.filter(item=> ((item.Name).toLowerCase()).includes(search.toLowerCase()))}
      />
    </div>
  );
}


export default Data;