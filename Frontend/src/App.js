import Home from './Pages/Home';
import CreateAccount from './Pages/CreateAccount';
import CreateUsers from './Pages/CreateUsers';
import Login from './Pages/Login';
import Leftbar from './Leftbar';
import LandingPage from './Pages/LandingPage';
import Tolpbar from './Tolpbar';
import CreateTournaments from './Pages/CreateTournaments';
import {AuthContext} from './helpers/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';



function App() {
const [authState, setAuthState] = useState({username:"", id:0, status:false});
const [isValidAccount, setAccount] = useState(0);


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
          <Route path='/CreateAccount' exact element={<CreateAccount isValidAccount={isValidAccount} setAccount={setAccount} />} />
          <Route path='/CreateUsers' exact element ={<CreateUsers isValidAccount={isValidAccount} setAccount={setAccount}/>} />
          <Route path='/Home' exact element={<Home  isValidAccount={isValidAccount} setAccount={setAccount}/>} />
          <Route path='/' exact element ={<LandingPage/>} />
          <Route path='/CreateTournaments' exact element ={<CreateTournaments  isValidAccount={isValidAccount} setAccount={setAccount}/>} />
        </Routes>
      </div>

    </div>
  
    </AuthContext.Provider> 
    </Router>
    </div>
      );
    }
    export default App;