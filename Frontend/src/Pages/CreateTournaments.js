import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Container, Card, Button } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const CreateTournaments = () => {
  const navigate = useNavigate();

  const initialValues = {
    tournament_name: "",
    start_date: "",
    end_date: "",
    is_published: false,
    image: null,
  };

  const validationSchema = Yup.object().shape({
    tournament_name: Yup.string().required("You must create a Tournament Name!!"),
    start_date: Yup.date().nullable().required("Start Date is required"),
    end_date: Yup.date().nullable().required("End Date is required"),
    is_published: Yup.boolean().required("Publication status is required"),
    image: Yup.mixed().required("Image is required"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("tournament_name", values.tournament_name);
    formData.append("start_date", values.start_date);
    formData.append("end_date", values.end_date);
    formData.append("is_published", values.is_published);
    formData.append("image", values.image);

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found. API request not made.");
        return;
      }

      const response = await axios.post("http://localhost:3001/tournaments", formData, {
        headers: {
          accessToken: accessToken,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Request successful:", response.data);
      const queryString = new URLSearchParams({ tournament_id: response.data.tournament_id}).toString();
      navigate(`/CreateDivision?${queryString}`);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container style={{ marginTop: "20vh" }}>
      <Helmet>
        <title>Create Tournament</title>
        <meta name="description" content="Description of your page" />
      </Helmet>
      <Card bg="secondary" text="white">
        <Card.Body>
          <h4 className="card-title">Create Tournament</h4>
          <p className="card-text">Please complete the form. It's simple</p>
          <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
            {(formik) => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="tournament_name" className="form-label">
                    Tournament Name:
                  </label>
                  <ErrorMessage name="tournament_name" component="div" className="text-danger" />
                  <Field
                    type="text"
                    id="tournament_name"
                    name="tournament_name"
                    placeholder="(Ex. USA OPEN...)"
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="start_date" className="form-label">
                    Start Date:
                  </label>
                  <ErrorMessage name="start_date" component="div" className="text-danger" />
                  <Field type="date" id="start_date" name="start_date" className="form-control" />
                </div>

                <div className="mb-3">
                  <label htmlFor="end_date" className="form-label">
                    End Date:
                  </label>
                  <ErrorMessage name="end_date" component="div" className="text-danger" />
                  <Field type="date" id="end_date" name="end_date" className="form-control" />
                </div>

                <div className="mb-3">
                  <label htmlFor="image" className="form-label">
                    Tournament Image:
                  </label>
                  <ErrorMessage name="image" component="div" className="text-danger" />
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={(event) => formik.setFieldValue("image", event.target.files[0])}
                    className="form-control"
                  />
                </div>

                <div className="mb-3 form-check">
                  <Field type="checkbox" id="is_published" name="is_published" className="form-check-input" />
                  <label htmlFor="is_published" className="form-check-label">
                    Publish this tournament
                  </label>
                  <ErrorMessage name="is_published" component="div" className="text-danger" />
                </div>

                <Button type="submit" variant="primary" disabled={formik.isSubmitting}>
                  Create Tournament
                </Button>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateTournaments;
