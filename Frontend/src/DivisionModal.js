import React, { useState } from 'react';
import { Button, Modal, Alert, Form } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const DivisionModal = ({ division_id, showModal, handleClose }) => {
  const [formData, setFormData] = useState({
    division_id: division_id,
    age_group: "",
    proficiency_level: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.age_group) newErrors.age_group = "Age group is required";
    if (!formData.proficiency_level) newErrors.proficiency_level = "Proficiency level is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    const accessToken = localStorage.getItem("accessToken");

    try {
      await axios.patch(`http://localhost:3001/divisions`, formData, {
        headers: {
          accessToken: accessToken,
          'Content-Type': 'application/json'
        }
      });
      console.log('Division data created successfully');
      handleClose();
      window.location.reload();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error creating division');
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Create Division</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label htmlFor="age_group">Age Group:</Form.Label>
            <Form.Control
              type="text"
              id="age_group"
              name="age_group"
              value={formData.age_group}
              onChange={handleInputChange}
              isInvalid={!!errors.age_group}
            />
            <Form.Control.Feedback type="invalid">
              {errors.age_group}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="proficiency_level">Proficiency Level:</Form.Label>
            <Form.Control
              type="text"
              id="proficiency_level"
              name="proficiency_level"
              value={formData.proficiency_level}
              onChange={handleInputChange}
              isInvalid={!!errors.proficiency_level}
            />
            <Form.Control.Feedback type="invalid">
              {errors.proficiency_level}
            </Form.Control.Feedback>
          </Form.Group>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DivisionModal;
