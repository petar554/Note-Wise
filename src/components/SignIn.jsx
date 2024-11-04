import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Link } from '@mui/material';
import { login } from '../services/api';
import HighFiveIcon from '../assets/noun-high-five-1154833.svg';
import '../styles/common.css';
import '../styles/SignIn.css';

const SignIn = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('en');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password, language);
      const { token, localization } = response;
      localStorage.setItem('token', token);
      onLoginSuccess(localization);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Box className="dark-mode-container main-screen" p={2}>
      <Box className="app-logo">
        <img src={HighFiveIcon} alt="App Icon" />
        <Typography variant="h4" component="h1" fontWeight="bold">
          {'appName'}
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleLogin} className="sign-in-form" mt={15}>
        <label className="label" htmlFor="username">{'Username'}</label>
        <TextField
          id="username"
          type="text"
          fullWidth
          variant="outlined"
          InputProps={{ 
            className: 'input-field',
            sx: { backgroundColor: '#E6E6E6', color: '#000000'
          }}}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="label" htmlFor="password">{'Password'}</label>
        <TextField
          id="password"
          type="password"
          fullWidth
          variant="outlined"
          InputProps={{ 
            className: 'input-field',
            sx: { backgroundColor: '#E6E6E6', color: '#000000'
          }}}          
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Box className="forgot-password-container">
          <Link href="#" underline="hover" className="forgot-password-link">
            {'forgot password?'}
          </Link>
        </Box>

        <Box className="sign-in-button-container">
          <Button type="submit" variant="contained" className="sign-in-button">
            {'Sign in'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SignIn;
