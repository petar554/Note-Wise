import React, { useState, useEffect  } from 'react';
import { Box, Typography, Button } from '@mui/material';
import nounMenuIcon from '../assets/noun-menu-2528077.svg';
import cameraIcon from '../assets/camera.svg';
import '../styles/CaptureImages.css';
import { addImageToNote } from '../services/api';
import Menu from './Menu';

const CaptureImages = ({ notesId, onBack }) => {
  const [imageThumbnails, setImageThumbnails] = useState([]);
  const [imageCount, setImageCount] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  const initCamera = async () => {
    try {
      const video = document.getElementById('video');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      video.srcObject = stream;
    } catch (error) {
      console.error('Camera initialization error:', error);
    }
  };

  useEffect(() => {
    initCamera();
  }, []); 

  const captureImage = async () => {
    const video = document.getElementById('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // convert canvas to blob and upload image
    canvas.toBlob(async (blob) => {
      try {
        const token = localStorage.getItem('token');
        const response = await addImageToNote(notesId, blob, token);
        
        if (response) {
          setImageThumbnails([...imageThumbnails, response.thumbnail_image]);
          setImageCount(response.number_of_images);
        }
      } catch (error) {
        console.error('Error uploading captured image:', error);
      }
    }, 'image/jpeg');
  };

  return (
    <Box className="capture-images-screen main-screen" p={4}>
      <Typography variant="h5" component="h1" fontWeight="bold">
        Capture Images of Your Notes
      </Typography>
      <div id="camera-container">
        <video id="video" autoPlay playsInline></video>
      </div>
      <Button id="snap" onClick={captureImage} startIcon={<img src={cameraIcon} alt="Camera icon" className="camera-icon"/>}>
        </Button>
      <div id='snapshots'></div>
      <div className="thumbnail-container">
        <div className="thumbnail">
        {imageThumbnails.length > 0 && (
            <img
                src={`data:image/jpeg;base64,${imageThumbnails[imageThumbnails.length - 1]}`}
                alt="Captured thumbnail"
            />
        )}
        {imageCount > 0 && <span className="image-count">{imageCount}</span>}
        </div>
      </div>
      <img
        src={nounMenuIcon}
        alt="Menu Icon"
        className="menu-icon"
        onClick={() => setShowMenu(true)} 
      />
      {showMenu && <Menu onClose={() => setShowMenu(false)} />}
    </Box>
  );
};

export default CaptureImages;
