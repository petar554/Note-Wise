import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Link, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { login } from '../services/api';
import HighFiveIcon from '../assets/noun-high-five-1154833.svg';
import '../styles/common.css';
import '../styles/SignIn.css';

const SignIn = ({ onLoginSuccess }) => {
  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('en');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password, language);
      const { token, localization } = response;
      localStorage.setItem('token', token);
      i18n.changeLanguage(language);
      onLoginSuccess(localization);
    } catch (error) {
      setError(t('invalidCredentials'));
    }
  };

  return (
    <Box className="dark-mode-container login-screen" p={4}>
      <Box className="app-logo" mb={14}>
        <img src={HighFiveIcon} alt="App Icon" />
        <Typography variant="h4" component="h1" fontWeight="bold">
          {t('appName')}
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleLogin} className="sign-in-form">
        <label className="label" htmlFor="username">{t('Username')}</label>
        <TextField
          id="username"
          type="text"
          fullWidth
          variant="outlined"
          InputProps={{ 
            className: 'input-field',
            sx: { backgroundColor: '#ffffff', color: '#000000'
          }}}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="label" htmlFor="password">{t('Password')}</label>
        <TextField
          id="password"
          type="password"
          fullWidth
          variant="outlined"
          InputProps={{ 
            className: 'input-field',
            sx: { backgroundColor: '#ffffff', color: '#000000'
          }}}          
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box className="forgot-password-container">
          <Link href="#" underline="hover" className="forgot-password-link">
            {t('forgot password?')}
          </Link>
        </Box>

        <Box className="sign-in-button-container">
          <Button type="submit" variant="contained" className="sign-in-button">
            {t('Sign in')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SignIn;
