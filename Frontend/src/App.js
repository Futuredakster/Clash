import Home from './Pages/Home';
import CreateUsers from './Pages/CreateUsers';
import Login from './Pages/Login';
import Leftbar from './Leftbar';
import LandingPage from './Pages/LandingPage';
import Tolpbar from './Tolpbar';
import CreateTournaments from './Pages/CreateTournaments';
import MyTournaments from './Pages/MyTournaments';
import AccountUser from './Pages/AccountUser';
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
   <div className="container-fluid">
    <Router>
    <AuthContext.Provider value={{authState, setAuthState}}>
    <div className='row flex-nowrap'>
    <Tolpbar/>
    </div>
    <div className='row flex-nowrap'>
    {authState.status ?(
      <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">    
            <Leftbar />
      </div>
    ) : null}
      <div className='col'>
        <Routes>
        <Route path='/Login' exact element ={<Login/>} />
          <Route path='/CreateUsers' exact element ={<CreateUsers/>} />
          <Route path='/' exact element ={<LandingPage/>} />
          <Route path='/AccountUser' exact element ={<AccountUser/>} />
          <Route path='/CreateTournaments' exact element ={<CreateTournaments/>} />
          <Route path='/MyTournaments' exact element= {<MyTournaments />} />
          <Route path='/Home' exact element={<Home />} />
        </Routes>
      </div>

    </div>
  
    </AuthContext.Provider> 
    </Router>
    </div>
      );
    }
    export default App;