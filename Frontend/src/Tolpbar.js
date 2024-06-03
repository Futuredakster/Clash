import { Link } from 'react-router-dom';
import React, { useState,useContext,useEffect } from "react";
import axios from 'axios';
import {AuthContext} from './helpers/AuthContext';

const Tolpbar = () => {
    const {authState, setAuthState} = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('Access token not found. API request not made.');
        setError('Access token not found');
        setLoading(false);
        return;
      }
  
      const fetchAccountInfo = async () => {
        try {
          const [userResponse] = await Promise.all([
            axios.get('http://localhost:3001/users', {
              headers: { accessToken },
            }),
          ]);
          setUser(userResponse.data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAccountInfo();
    }, []);

    const logout = () => {
        localStorage.removeItem("accessToken");
        setAuthState({ username: "", id: 0, status: false ,account_id: 0});
      };

      const checkUsername = () => {
        if (user && user.username) {
            return user.username;
        }
        return authState.username;
    };
    return (
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-3">
    
          <a href="#" className="navbar-brand container">Clash</a>
 
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navmenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
 
          <div className="collapse navbar-collapse" id="navmenu">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                  {!authState.status ?(
            <Link to="/Login" className="nav-link dropdown-toggle">Login</Link> 
            ):(
              <Link to="/LandingPage" className="btn btn-primary" onClick={logout}>
              Logout
            </Link>
                
            )}
              </li>
              <li className="nav-item">
              {!authState.status ?(
                   <Link to="/AccountUser" className="nav-link dropdown-toggle">Create New Account</Link>
            ):(
              <Link to="/EditUser" className="nav-link dropdown-toggle"> {checkUsername()} </Link>
            )}
              </li>
            </ul>
          </div>
        
        </nav>
    );
}
export default Tolpbar;
     