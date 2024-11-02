import React from 'react';
import { Box, Typography } from '@mui/material';
import '../styles/Menu.css';

const Menu = ({ onClose }) => {
  return (
    <Box className="menu-screen">
      <div className="menu-options">
        <Typography variant="h6" className="menu-option">notes</Typography>
        <Typography variant="h6" className="menu-option">setup</Typography>
        <Typography variant="h6" className="menu-option">account</Typography>
        <Typography variant="h6" className="menu-option">logout</Typography>
      </div>
      <div className="menu-close" onClick={onClose}>
        <Typography variant="h5" className="close-icon">X</Typography>
      </div>
    </Box>
  );
};

export default Menu;
