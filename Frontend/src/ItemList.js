import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import { useState } from 'react';
import CustomModal from './CustomModal';
import { useNavigate } from "react-router-dom";

const ItemList = ({ items, accountId }) => {
  const accessToken = localStorage.getItem("accessToken");
  const [showModal, setShowModal] = useState(false);
  const [openStates, setOpenStates] = useState(Array(items.length).fill(false));
  const navigate = useNavigate();

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const toggleDropdown = (index) => {
    const newOpenStates = [...openStates];
    newOpenStates[index] = !newOpenStates[index];
    setOpenStates(newOpenStates);
  };
const seeDivision = (tournamentName, tournamentId) =>{
  const queryString = new URLSearchParams({ tournament_name: tournamentName, tournament_id:tournamentId}).toString();
  navigate(`/seeDivisions?${queryString}`);
}
  const onDelete = (tournament_id) => {
    if (!accessToken) {
      console.error('Access token not found. Delete request cannot be made.');
      return;
    }

    axios.delete(`http://localhost:3001/tournaments`, {
      headers: {
        accessToken: accessToken,
      },
      data: {
        tournament_id: tournament_id,
      }
    })
      .then(response => {
        console.log(response.data);
        console.log('Tournament deleted successfully.');
        window.location.reload();
      })
      .catch(error => {
        console.error('Error deleting tournament:', error);
      });
  };

  
  
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Divisions</th>
          <th>Image</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={index}>
            <td>{item.tournament_name}</td>
            <td>{item.start_date}</td>
            <td>{item.end_date}</td>
            {accountId === item.account_id ? (
            <td> <button className="btn btn-primary" onClick={() =>seeDivision(item.tournament_name,item.tournament_id)}> Divisions</button></td>
            ):( 
              <h6> Not Your Tournament</h6>
            )}
            <td>
              {item.imageUrl ? <img src={item.imageUrl} alt={item.tournament_name} width="100" /> : 'No Image'}
            </td>
            <td>
              {accountId === item.account_id ? (
                <Dropdown show={openStates[index]} onClick={() => toggleDropdown(index)}>
                  <Dropdown.Toggle variant="primary" id={`dropdown-basic-${index}`}>
                    Edit
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => onDelete(item.tournament_id)}>Delete</Dropdown.Item>
                    <Dropdown.Item onClick={handleShowModal}> Edit Tournament</Dropdown.Item>
                    <CustomModal showModal={showModal} handleClose={handleCloseModal} accountId={accountId} tournament_id={item.tournament_id} />
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <h6> Not your Tournament</h6>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ItemList;
