import React, { useState, useEffect } from 'react';
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

  const [imageCapture, setImageCapture] = useState(null);

  const initCamera = async () => {
    try {
      const video = document.getElementById('video');

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("getUserMedia is not supported by this browser.");
      }

      //constraints for higher resolution in portrait mode
      const constraints = {
        video: {
          facingMode: 'environment', // use rear camera for better quality
          width: { ideal: 1080 },    // adjust based on device capabilities
          height: { ideal: 1920 },
          aspectRatio: { ideal: 9 / 16 }, // ensure portrait mode aspect ratio
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;

      // create ImageCapture object for high-resolution photos
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();

      // adjust focus if supported
      if (capabilities.focusMode && capabilities.focusMode.includes('continuous')) {
        await track.applyConstraints({
          advanced: [{ focusMode: 'continuous' }]
        });
      } else if (capabilities.focusMode && capabilities.focusMode.includes('manual')) {
        await track.applyConstraints({
          advanced: [{
            focusMode: 'manual',
            focusDistance: capabilities.focusDistance.min
          }]
        });
      } else {
        console.warn('Manual focus is not supported on this device.');
      }

      // store ImageCapture object in state
      const imageCaptureObj = new ImageCapture(track);
      setImageCapture(imageCaptureObj);

    } catch (error) {
      console.error('Camera initialization error:', error);
    }
  };

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      initCamera();
    } else {
      console.warn("Camera not supported");
    }
  }, []);

  const captureImage = async () => {
    if (imageCapture) {
      try {
        // capture high-resolution photo using ImageCapture API
        const blob = await imageCapture.takePhoto();

        // upload blob to server
        const token = localStorage.getItem('token');
        const response = await addImageToNote(notesId, blob, token);

        if (response) {
          setImageThumbnails([...imageThumbnails, response.thumbnail_image]);
          setImageCount(response.number_of_images);
        }
      } catch (error) {
        console.error('Error capturing image:', error);
      }
    } else {
      console.warn('ImageCapture is not available. Falling back to canvas capture.');
      // fallback: Capture image from video element using canvas
      const video = document.getElementById('video');
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

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
    }
  };

  return (
    <Box className="dark-mode-container main-screen" p={4}>
      <div id="camera-container">
        <video id="video" autoPlay playsInline style={{ transform: 'scaleX(-1)' }}></video>
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
        className="menu-icon2"
        onClick={() => setShowMenu(true)} 
      />
      {showMenu && <Menu onClose={() => setShowMenu(false)} />}
    </Box>
  );
};

export default CaptureImages;
