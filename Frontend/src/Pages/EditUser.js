import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, CircularProgress, Alert, Box } from '@mui/material';

const EditUser = () => {
  const [account, setAccount] = useState(null);
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
        const [accountResponse, userResponse] = await Promise.all([
          axios.get('http://localhost:3001/accounts/info', {
            headers: { accessToken },
          }),
          axios.get('http://localhost:3001/users', {
            headers: { accessToken },
          }),
        ]);
        setAccount(accountResponse.data);
        setUser(userResponse.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountInfo();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Account Information
      </Typography>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
        {account ? (
          <Box>
            <Typography variant="h6">Account Name: {account.account_name}</Typography>
            <Typography variant="body1">Account Type: {account.account_type}</Typography>
          </Box>
        ) : (
          <Typography>No account information available.</Typography>
        )}
      </Paper>

      <Typography variant="h4" component="h1" gutterBottom>
        User Information
      </Typography>
      <Paper elevation={3} sx={{ padding: 2 }}>
        {user ? (
          <Box>
            <Typography variant="h6">Username: {user.username}</Typography>
            <Typography variant="body1">Email: {user.email}</Typography>
          </Box>
        ) : (
          <Typography>No user information available.</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default EditUser;
