import React, { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import nounTappingIcon from '../assets/noun-hand-using-phone-4230396.svg';
import nounMenuIcon from '../assets/noun-menu-2528077.svg';
import { createNote } from '../services/api';
import '../styles/NewNotes.css';
import Menu from './Menu'; 

const NewNotes = ({ localization, onNoteCreation, onStartCapture }) => {
  const token = localStorage.getItem('token');
  const [showMenu, setShowMenu] = useState(false);

  const handleStart = async () => {
    try {
      const response = await createNote(token);
      const { notes_id } = response;
      onNoteCreation(notes_id);
      onStartCapture(notes_id);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  return (
    <Box className="dark-mode-container main-screen" p={4}>
      <Typography variant="h4" component="h1" fontWeight="bold" className="new-note-headline">
        {localization?.new_note_headline || "Let's create a new note"}
      </Typography>
      <Typography variant="body2" className="new-note-below-headline">
        {localization?.new_note_below_headline || "(it just takes a few seconds)"}
      </Typography>
      <Box className="new-note-image-container">
        <img src={nounTappingIcon} alt="Tapping Icon" />
      </Box>
      <Typography variant="body1" className="new-note-below-image">
        {localization?.new_note_below_image || "Simply take pictures of your notes"}
      </Typography>
      <Box className="start-button-container">
        <Button onClick={handleStart} variant="contained" className="sign-in-button">
          {localization?.new_note_start_button || "Start"}
        </Button>
      </Box>
      <img
        src={nounMenuIcon}
        alt="Menu Icon"
        className="menu-icon"
        onClick={() => setShowMenu(true)} // Show menu on click
      />
      {showMenu && <Menu onClose={() => setShowMenu(false)} />}
    </Box>
  );
};

export default NewNotes;