import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Searchbar from '../Searchbar';

const CompetitorView = () => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3001/tournaments/praticipent', {
            params: {
                tournament_name: search,
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
    }, [search]);

    return (
        <div className="container mt-5">
            <Searchbar
                search={search}
                setSearch={setSearch}
            />
            <div className="row">
                {data.map((item, index) => (
                    <div key={index} className="col-md-4 mb-4">
                        <div className="card h-100">
                            {item.imageUrl && 
                                <img src={item.imageUrl} className="card-img-top" alt={item.tournament_name} />
                            }
                            <div className="card-body">
                                <h5 className="card-title">{item.tournament_name}</h5>
                                <p className="card-text">Start Date: {item.start_date}</p>
                                <p className="card-text">End Date: {item.end_date}</p>
                                <button className="btn btn-primary">View Details</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CompetitorView;
