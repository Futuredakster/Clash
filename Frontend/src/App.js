import Data from './Data';
import Navbar from './Navbar';
import './App.css';


function App() {
  return (
    <body id="page-top">
      <div id="wrapper">
        <Navbar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Data/>
          </div>
        </div>
      </div>
    </body>
  );
}
export default App;
