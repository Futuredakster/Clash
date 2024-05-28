import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Container, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export const ParticipentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const division_id = queryParams.get("division_id") || ""; // Assuming you may have division_id in query params
  const age_group = queryParams.get("age_group");
  const proficiency_level = queryParams.get("proficiency_level");

  const initialValues = {
    name: "",
    date_of_birth: "",
    belt_color: "",
    division_id: division_id,
    age_group:age_group,
    proficiency_level:proficiency_level,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    date_of_birth: Yup.date().required("Date of Birth is required"),
    belt_color: Yup.string().required("Belt Color is required"),
    division_id: Yup.number().required("Division ID is required"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    console.log("Submitting values:", values);
    try {
      const response = await axios.post("http://localhost:3001/practicepents", values);

      console.log("Request successful:", response.data);
      if(!response.data.name){
        alert(response.data.error);
        navigate("/CompetitorView");
      } else{
      navigate("/LandingPage");
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container style={{ marginTop: "20vh" }}>
      <Card bg="secondary" text="white">
        <Card.Body>
          <h4 className="card-title">Create Participant</h4>
          <p className="card-text">Please complete the form. It's simple</p>
          <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
            {(formik) => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name:
                  </label>
                  <ErrorMessage name="name" component="div" className="text-danger" />
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter name"
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="date_of_birth" className="form-label">
                    Date of Birth:
                  </label>
                  <ErrorMessage name="date_of_birth" component="div" className="text-danger" />
                  <Field
                    type="date"
                    id="date_of_birth"
                    name="date_of_birth"
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="belt_color" className="form-label">
                    Belt Color:
                  </label>
                  <ErrorMessage name="belt_color" component="div" className="text-danger" />
                  <Field
                    type="text"
                    id="belt_color"
                    name="belt_color"
                    placeholder="Enter belt color"
                    className="form-control"
                  />
                </div>

                {/* Hidden division_id field */}
                <Field type="hidden" name="division_id" />

                <Button type="submit" variant="primary" disabled={formik.isSubmitting}>
                  Create Participant
                </Button>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </Container>
  );
};


