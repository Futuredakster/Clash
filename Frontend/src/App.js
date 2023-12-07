import Home from './Pages/Home';
import CreateAccount from './Pages/CreateAccount';
import Navbar from './Navbar';
import Topbar from './Topbar';
import './App.css';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
function App() {
  return (
   <body id="page-top">
      <div id="wrapper">
        <Navbar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
    <Router>
    <Topbar/>
      <Routes>
        <Route path='/' exact element={<Home/>} />
        <Route path='/CreateAccount' exact element={<CreateAccount/>} />
      </Routes>
    </Router>
    </div>
    </div>
    </div>
    </body>

  );
}
export default App;

