import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import nounMenuIcon from '../assets/noun-menu-2528077.svg';
import cameraIcon from '../assets/camera.svg';
import '../styles/CaptureImages.css';
import { addImageToNote } from '../services/api';
import Menu from './Menu';

const CaptureImages = ({ notesId }) => {
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

      // set constraints for a 4:3 aspect ratio
      const constraints = {
        video: {
          facingMode: 'environment',
          aspectRatio: { ideal: 4 / 3 },
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;

      const track = stream.getVideoTracks()[0];
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
      
      // fallback to canvas capture
      const video = document.getElementById('video');
      const canvas = document.createElement('canvas');

      // match the canvas size to video dimensions to ensure the same aspect ratio
      const videoAspectRatio = video.videoWidth / video.videoHeight;
      const width = video.videoWidth;
      const height = video.videoHeight;
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext('2d');
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
      <Button id="snap" onClick={captureImage} startIcon={<img src={cameraIcon} alt="Camera icon" className="camera-icon" />}>
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
