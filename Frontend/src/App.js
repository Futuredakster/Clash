import Home from './Pages/Home';
import CreateUsers from './Pages/CreateUsers';
import Login from './Pages/Login';
import Leftbar from './Leftbar';
import LandingPage from './Pages/LandingPage';
import Tolpbar from './Tolpbar';
import CreateTournaments from './Pages/CreateTournaments';
import MyTournaments from './Pages/MyTournaments';
import AccountUser from './Pages/AccountUser';
import CompetitorView from './PraticipentView/CompetitorView';
import CreateDivision from './Pages/CreateDivision';
import SeeDivisions from './Pages/SeeDivisions';
import DisplayParticipents from './PraticipentView/DisplayParticipents';
import EditUser from './Pages/EditUser';
import SeeParticepents from './Pages/SeeParticepents';
import { ParticipentForm } from './PraticipentView/ParticipentForm';
import { Divisions } from './PraticipentView/Divisions';
import {AuthContext} from './helpers/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import {BrowserRouter as Router,Route,Routes,Navigate} from 'react-router-dom';

const accessToken = localStorage.getItem("accessToken");

function App() {
const [authState, setAuthState] = useState({username:"", id:0, status:false,accoint_id:0});
const [props, setProps] = useState([]);
const [division,setDivision] = useState([]);
console.log(props);




useEffect(() => {
  console.log("firing api");
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
        console.log(response.data.account_id)
        setAuthState({username:response.data.username, id:response.data.id, status:true,account_id:response.data.account_id});
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
          <Route path='/' element={!accessToken ? <Navigate to="/LandingPage" /> : <Navigate to="/Home" />} />
          <Route path='/AccountUser' exact element ={<AccountUser/>} />
          <Route path='/CompetitorView' exact element = {<CompetitorView setProps={setProps} />} />
          <Route path='/LandingPage' exact element ={<LandingPage/>} />
          <Route path='/CreateTournaments' exact element ={<CreateTournaments/>} />
          <Route path ='SeeParticepents' exact element= {<SeeParticepents/>} />
          <Route path='/MyTournaments' exact element= {<MyTournaments />} />
          <Route path='EditUser' exact element= {<EditUser/>} />
          <Route path='/Home' exact element={<Home  />} />
          <Route path='/CreateDivision' exact element={<CreateDivision/>} />
          <Route path='/seeDivisions' exact element={<SeeDivisions/>} />
          <Route path='/Divisions' exact element={<Divisions props={props} setProps={setProps} setDivision={setDivision}/>} />
          <Route path ='/Form' exact element ={<ParticipentForm division={division} />} />
          <Route path ='DisplayParticipents' exact element = {<DisplayParticipents/>} />
        </Routes>
      </div>

    </div>
  
    </AuthContext.Provider> 
    </Router>
    </div>
      );
    }
    export default App;