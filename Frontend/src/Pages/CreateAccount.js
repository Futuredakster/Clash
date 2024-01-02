
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import '../App.css';
import { useNavigate } from 'react-router-dom';

function CreatePost( {isValidAccount,setAccount}) {
  
  const navigate = useNavigate();

  const initialValues = {
    account_type: "",
    account_name: "",
    account_description: "",
  };

  const validationSchema = Yup.object().shape({
    account_type: Yup.string().required("You must input an account_type!"),
    account_name: Yup.string().required("You must input an account_name!"),
    account_description: Yup.string().min(3).max(1000).required("Description is required."),
  });

  const onSubmit = (data, { setSubmitting }) => {
  /*  axios.get('http://localhost:3001/accounts', {
      
    })
      .then(response => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          setAccount(response.data);
          console.log(response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  */
    axios.post("http://localhost:3001/accounts", data)
      .then((response) => {
        console.log("Request successful:", response.data);
        setAccount(response.data.account_id);
        // Navigate to '/CreateUsers' after successful submission
        navigate('/CreateUsers');
       
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        // Ensure to reset the form submission state
        setSubmitting(false);
      });
  };
  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <div className="formField">
            <label htmlFor="account_type">Account Type:</label>
            <ErrorMessage name="account_type" component="span" />
            <Field
              type="text"
              id="account_type"
              name="account_type"
              placeholder="(Ex. account_type...)"
            />
          </div>

          <div className="formField">
            <label htmlFor="account_name">Account Name:</label>
            <ErrorMessage name="account_name" component="span" />
            <Field
              type="text"
              id="account_name"
              name="account_name"
              placeholder="(Ex. account_name...)"
            />
          </div>

          <div className="formField">
            <label htmlFor="account_description">Account Description:</label>
            <ErrorMessage name="account_description" component="span" />
            <Field
              type="text"
              id="account_description"
              name="account_description"
              placeholder="(Ex. John123...)"
            />
          </div>

          <button
          type="submit"
          >Create Post
          </button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;


