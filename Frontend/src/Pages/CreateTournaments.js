
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import '../App.css';
import {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import {AuthContext} from '../helpers/AuthContext';
import { Button } from "react-bootstrap";

const CreateTournaments = ( ) => {
    const navigate = useNavigate();
    const {authState, setAuthState} = useContext(AuthContext);

  const initialValues = {
    tournament_name: "",
    start_date: "",
    end_date: "",
    is_published: false,
  };

 

  const validationSchema = Yup.object().shape({
    tournament_name: Yup.string().required("You must create a Tournament Name!!"),
    start_date: Yup.date().nullable().required('Start Date is required'),
    end_date: Yup.date().nullable().required('End Date is required'),
    is_published: Yup.boolean().required('Publication status is required'),
  });

  const onSubmit = (data, { setSubmitting }) => {
    console.log('Submitting data:', data);
    const accessToken = localStorage.getItem("accessToken");
  
    if (!accessToken) {
      // Handle the case where accessToken is not available
      console.error('Access token not found. API request not made.');
      return;
    }
  
  
    axios.post("http://localhost:3001/tournaments", data, {
        headers: {
            accessToken: accessToken,
        }
    })
        .then((response) => {
            console.log("Request successful:", response.data);
            // Navigate to '/CreateUsers' after successful submission
            navigate('/Home');
        })
        .catch((error) => {
            console.error("Error:", error);
        })
        .finally(() => {
            // Ensure to reset the form submission state
            setSubmitting(false);
        });
  };

  const handlePublishButtonClick = (formik) => {
    // Set is_published to true when the "Publish" button is clicked
    formik.setFieldValue('is_published', true);
  };

  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {(formik) => ( 
        <Form className="formContainer">
          <div className="formField">
            <label htmlFor="tournament_name">Tournament Name:</label>
            <ErrorMessage name="tournament_name" component="span" />
            <Field
              type="text"
              id="tournament_name"
              name="tournament_name"
              placeholder="(Ex. USA OPEN...)"
            />
          </div>

          <div className="formField">
            <label htmlFor="start_date">Start Date:</label>
            <ErrorMessage name="start_date" component="span" />
            <Field
              type="text"
              id="start_date"
              name="start_date"
              placeholder="(Ex. MM,DD,YY)"
            />
          </div>

          <div className="formField">
            <label htmlFor="end_date">End Date:</label>
            <ErrorMessage name="end_date" component="span" />
            <Field
              type="text"
              id="end_date"
              name="end_date"
              placeholder="(Ex. MM,DD,YY)"
            />
          </div>
          <div className="formField">
          <button  onClick={() => { handlePublishButtonClick(formik)}}>
                Publish and Submit
              </button>
            </div>
            <button type="submit">Create Tournament</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
export default CreateTournaments;