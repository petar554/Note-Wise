import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../styles/common.css';
import { login } from '../services/api'; 


const SignIn = ({ onLoginSuccess }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { token } = await login(email, password);
      localStorage.setItem('token', token);
      onLoginSuccess();
    } catch (error) {
      setError(t('invalidCredentials'));
    }
  };

  return (
    <Box className="dark-mode-container">
      <Typography variant="h4" component="h1">
        👋 {t('appName')}
      </Typography>

      <Box component="form" onSubmit={handleLogin} className="sign-in-form">
        <TextField
          label={t('email')}
          type="email"
          fullWidth
          variant="outlined"
          InputProps={{ className: 'input-field' }}
          sx={{ mb: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label={t('password')}
          type="password"
          fullWidth
          variant="outlined"
          InputProps={{ className: 'input-field' }}
          sx={{ mb: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          className="sign-in-button"
        >
          {t('signIn')}
        </Button>

        <Link
          href="#"
          underline="hover"
          className="forgot-password-link"
          onClick={() => alert(t('comingSoon'))}
        >
          {t('forgotPassword')}
        </Link>
      </Box>
    </Box>
  );
};

export default SignIn;
