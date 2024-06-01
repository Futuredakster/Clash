import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditUser = () => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Assuming you have a token saved in local storage or another secure place
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      // Handle the case where accessToken is not available
      console.error('Access token not found. API request not made.');
      return;
    }

    const fetchAccountInfo = async () => {
      try {
        const response = await axios.get('http://localhost:3001/accounts/info', {
            headers: {
                accessToken: accessToken,
              }
        });
        setAccount(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountInfo();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Edit User</h1>
      {account && (
        <div>
          <p>Account ID: {account.account_name}</p>
          <p>Account Name: {account.account_type}</p>
          {/* Add more fields as necessary */}
        </div>
      )}
    </div>
  );
};

export default EditUser;
