import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, CircularProgress, Alert, Box, Button } from '@mui/material';
import UserModal from '../UserModal'; // Make sure the path to UserModal is correct
import AccountModal from '../AccountModal'; // Import the AccountModal component
import PasswordModal from '../PasswordModal'; // Import the PasswordModal component

const EditUser = () => {
  const [account, setAccount] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

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

  const handleShowUserModal = () => setShowUserModal(true);
  const handleCloseUserModal = () => setShowUserModal(false);
  const handleShowAccountModal = () => setShowAccountModal(true);
  const handleCloseAccountModal = () => setShowAccountModal(false);
  const handleShowPasswordModal = () => setShowPasswordModal(true);
  const handleClosePasswordModal = () => setShowPasswordModal(false);

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
            <Typography variant="body1">Account Description: {account.account_description}</Typography>
            <Button variant="contained" color="primary" onClick={handleShowAccountModal}>
              Edit Account
            </Button>
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
            <Button variant="contained" color="primary" onClick={handleShowUserModal}>
              Edit User
            </Button>
            <Button variant="contained" color="secondary" onClick={handleShowPasswordModal} sx={{ marginLeft: 2 }}>
              Change Password
            </Button>
          </Box>
        ) : (
          <Typography>No user information available.</Typography>
        )}
      </Paper>

      {user && (
        <>
          <UserModal
            showModal={showUserModal}
            handleClose={handleCloseUserModal}
            user_id={user.user_id} // Assuming user object has a user_id
          />
          <PasswordModal
            showModal={showPasswordModal}
            handleClose={handleClosePasswordModal}
            user_id={user.user_id} // Assuming user object has a user_id
          />
        </>
      )}

      {account && (
        <AccountModal
          showModal={showAccountModal}
          handleClose={handleCloseAccountModal}
          account_id={account.account_id}
        />
      )}
    </Container>
  );
};

export default EditUser;
