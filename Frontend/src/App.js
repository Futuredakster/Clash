import Home from './Pages/Home';
import CreateAccount from './Pages/CreateAccount';
import CreateUsers from './Pages/CreateUsers';
import Login from './Pages/Login';
import Navbar from './Navbar';
import Topbar from './Topbar';
import LandingPage from './Pages/LandingPage';
import {AuthContext} from './helpers/AuthContext';
import { useState, useEffect } from 'react';

import axios from 'axios';
import './App.css';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';


function App() {
const [authState, setAuthState] = useState({username:"", id:0, status:false});

useEffect(() => {
  console.log("firing api");
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    // Handle the case where there is no access token (e.g., redirect to login page)
    setAuthState({...authState, status:false});
  } else{
  axios.get("http://localhost:3001/users/auth", {
    headers: {
      accessToken: accessToken,
    },
  })
    .then((response) => {
      console.log("got a response", response);
      if (response.data.error) {
        setAuthState({...authState, status:false});
      } else {
        console.log(response.data.username);
        setAuthState({username:response.data.username, id:response.data.id, status:true});
      }
    });
  }
},[]); 


  return (
   <body id="page-top">
    <AuthContext.Provider value={{authState, setAuthState}}>
      <div id="wrapper">
      {authState.status ?(
        <Navbar />
        ) : null}
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
    <Router>
    <Topbar/>
      <Routes>
      <Route path='/Login' exact element ={<Login/>} />
        <Route path='/Home' exact element={<Home/>} />
        <Route path='/CreateAccount' exact element={<CreateAccount/>} />
        <Route path='/CreateUsers' exact element ={<CreateUsers/>} />
        <Route path='/' exact element ={<LandingPage/>} />
      </Routes>
    </Router>
    </div>
    </div>
    </div>
    </AuthContext.Provider>
    </body>
      );
    }
    export default App;