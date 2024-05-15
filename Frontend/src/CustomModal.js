import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const CustomModal = ({ showModal, handleClose, accountId, tournament_id }) => {
  const [formData, setFormData] = useState({
    tournament_name: "",
    start_date: "",
    end_date: "",
    account_id: accountId,
    tournament_id: tournament_id
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");
    try {
      console.log("about to send p")
      await axios.patch(`http://localhost:3001/tournaments`, formData, {
        headers: {
          accessToken: accessToken,
        }
      });
      console.log('Tournament data updated successfully');
      handleClose(); // Close the modal after successful update
      window.location.reload();
    } catch (error) {
      console.error('Error updating tournament:', error.response.data);
      // Handle error (e.g., display error message to user)
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Custom Modal Title</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="tournament_name">Name:</label>
            <input
              type="text"
              id="tournament_name"
              name="tournament_name"
              value={formData.tournament_name}
              onChange={handleInputChange}
              
            />
          </div>
          <div>
            <label htmlFor="start_date">Start Date:</label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              
            />
          </div>
          <div>
            <label htmlFor="end_date">End Date:</label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              
            />
          </div>
          <button type="submit">Save Changes</button>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
