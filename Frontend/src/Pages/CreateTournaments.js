
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

const CreateTournaments = ( ) => {
    const navigate = useNavigate();


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
    <Container style={{ marginTop: '20vh' }}>
       <Helmet>
        <title>Create Tournament</title>
        <meta name="description" content="Description of your page" />
        {/* Add more meta tags, link tags, etc. as needed */}
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
                  <Field type="date" id="start_date" name="start_date" placeholder="(Ex. MM,DD,YY)" className="form-control" />
                </div>

                <div className="mb-3">
                  <label htmlFor="end_date" className="form-label">
                    End Date:
                  </label>
                  <ErrorMessage name="end_date" component="div" className="text-danger" />
                  <Field type="date" id="end_date" name="end_date" placeholder="(Ex. MM,DD,YY)" className="form-control" />
                </div>

             {   <button
                role="button"
                  onClick={() => handlePublishButtonClick(formik)}
                  variant="primary"
                  className="mb-3"
                >
                  Publish and Submit
                </button>
            }
                <Button type="submit" variant="primary">
                  Create Tournament
                </Button>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </Container>
  );
}
export default CreateTournaments;