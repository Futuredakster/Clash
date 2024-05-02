import React from 'react';
import { useNavigate } from 'react-router-dom';

const CompetitorView = () => {
    const navigate = useNavigate();
    const navig = () => {
        navigate('/Home')
    }
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 text-primary">
            <div className="bg-black p-5 rounded d-inline-block" style={{ maxWidth: '600px', width: '80%', height:"40%" }}>
                <h1 className=" text-center">Hello</h1>
                <h5  className="text-center"> Start Date End Date</h5>
                <button className='btn btn-primary d-block mx-auto' onClick={navig}> Sign Up!</button>
            </div>
        </div>
    );
};

export default CompetitorView;
