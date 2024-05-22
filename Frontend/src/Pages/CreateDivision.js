import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Container, Card, Button } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

const CreateDivision = () => {
  const navigate = useNavigate();
  const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tournament_id = queryParams.get('tournament_id');

  const initialValues = {
    age_group: "",
    proficiency_level: "",
    tournament_id: tournament_id,
  };

  const validationSchema = Yup.object().shape({
    tournament_id: Yup.number().required("Tournament ID is required"),
    age_group: Yup.string().required("Age group is required"),
    proficiency_level: Yup.string().required("Proficiency level is required"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    console.log("Submitting values:", values);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found. API request not made.");
        return;
      }

      const response = await axios.post("http://localhost:3001/divisions", values, {
        headers: {
          accessToken: accessToken,
          "Content-Type": "application/json",
        },
      });

      console.log("Request successful:", response.data);
      navigate("/Home");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container style={{ marginTop: "20vh" }}>
      <Helmet>
        <title>Create Division</title>
        <meta name="description" content="Description of your page" />
      </Helmet>
      <Card bg="secondary" text="white">
        <Card.Body>
          <h4 className="card-title">Create Division</h4>
          <p className="card-text">Please complete the form. It's simple</p>
          <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
            {(formik) => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="age_group" className="form-label">
                    Age Group:
                  </label>
                  <ErrorMessage name="age_group" component="div" className="text-danger" />
                  <Field
                    type="text"
                    id="age_group"
                    name="age_group"
                    placeholder="Enter age group"
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="proficiency_level" className="form-label">
                    Proficiency Level:
                  </label>
                  <ErrorMessage name="proficiency_level" component="div" className="text-danger" />
                  <Field
                    type="text"
                    id="proficiency_level"
                    name="proficiency_level"
                    placeholder="Enter proficiency level"
                    className="form-control"
                  />
                </div>

                <Button type="submit" variant="primary" disabled={formik.isSubmitting}>
                  Create Division
                </Button>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateDivision;
