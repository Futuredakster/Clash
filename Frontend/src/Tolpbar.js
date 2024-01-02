import { Link } from 'react-router-dom';
import React, { useState,useContext } from "react";
import {AuthContext} from './helpers/AuthContext';

const Tolpbar = () => {
    const {authState, setAuthState} = useContext(AuthContext);

    const logout = () => {
        localStorage.removeItem("accessToken");
        setAuthState({ username: "", id: 0, status: false });
      };

    return (
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-3">
    
          <a href="#" className="navbar-brand">Clash</a>
 
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
              <Link to="/" className="btn btn-primary" onClick={logout}>
              Logout
            </Link>
                
            )}
              </li>
              <li className="nav-item">
              {!authState.status ?(
                   <Link to="/CreateAccount" className="nav-link dropdown-toggle">Create New Account</Link>
            ):(
              <h1 className="nav-link dropdown-toggle"> {authState.username} </h1>
            )}
              </li>
            </ul>
          </div>
        
        </nav>
    );
}
export default Tolpbar;
     