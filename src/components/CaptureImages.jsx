import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import nounMenuIcon from '../assets/noun-menu-2528077.svg';
import cameraIcon from '../assets/camera.svg';
import '../styles/CaptureImages.css';
import { addImageToNote, getImageById } from '../services/api';
import Menu from './Menu';

const CaptureImages = ({ notesId, onBack }) => {
  const [imageThumbnails, setImageThumbnails] = useState([]);
  const [imageCount, setImageCount] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [imageCapture, setImageCapture] = useState(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [fullImage, setFullImage] = useState(null);

  const initCamera = async () => {
    try {
      const video = document.getElementById('video');

      const constraints = {
        video: {
          facingMode: 'environment',
          aspectRatio: { ideal: 5 / 3 },
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;

      const track = stream.getVideoTracks()[0];
      setIsFrontCamera(track.getSettings().facingMode === 'user');

      const imageCaptureObj = new ImageCapture(track);
      setImageCapture(imageCaptureObj);

      // #todo: delete
      // testing: log dimensions of the live feed element once metadata is loaded
      video.onloadedmetadata = () => {
        console.log("Live Feed HTML Element Dimensions:", {
          width: video.offsetWidth,
          height: video.offsetHeight,
        });
        console.log("Live Feed Video Source Dimensions:", {
          width: video.videoWidth,
          height: video.videoHeight,
        });
      };

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
    const token = localStorage.getItem('token');

    if (imageCapture) {
      try {
        const blob = await imageCapture.takePhoto();
        const response = await addImageToNote(notesId, blob, token);

        if (response) {
          const imageUrl = URL.createObjectURL(blob);
          setImageThumbnails([...imageThumbnails, { url: imageUrl, id: response.image_id, token }]);
          setImageCount(response.number_of_images);
        }
      } catch (error) {
        console.error('Error capturing image:', error);
      }
    } else {
      const video = document.getElementById('video');
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.width = video.offsetWidth;
      canvas.height = video.offsetHeight;

      if (isFrontCamera) {
        context.scale(-1, 1);
        context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      } else {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      canvas.toBlob(async (blob) => {
        const response = await addImageToNote(notesId, blob, token);

        if (response) {
          const imageUrl = URL.createObjectURL(blob);
          setImageThumbnails([...imageThumbnails, { url: imageUrl, id: response.image_id }]);
          setImageCount(response.number_of_images);
        }
      }, 'image/jpeg');
    }
  };

  const openFullImage = async (imageId) => {
    try {
      const token = localStorage.getItem('token');
      const imageBlob = await getImageById(imageId, token);
      const imageUrl = URL.createObjectURL(imageBlob);
      setFullImage(imageUrl);
      setOpenModal(true);
    } catch (error) {
      console.error('Error fetching full image:', error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFullImage(null);
  };

  return (
    <Box className="dark-mode-container main-screen" p={4}>
      <div id="camera-container">
        <video
          id="video"
          autoPlay
          playsInline
          style={{ transform: isFrontCamera ? 'scaleX(-1)' : 'none' }}
        ></video>
      </div>
      <Button id="snap" onClick={captureImage} startIcon={<img src={cameraIcon} alt="Camera icon" className="camera-icon" />} />
      <div id='snapshots'></div>
      <div className="thumbnail-container">
        <div className="thumbnail">
          {imageThumbnails.length > 0 && (
            <div onClick={() => openFullImage(imageThumbnails[imageThumbnails.length - 1].id)}>
              <img
                src={imageThumbnails[imageThumbnails.length - 1].url}
                alt="Captured thumbnail"
              />
            </div>
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

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogContent className="dialogContent">
          <img src={fullImage} alt="Full-size" style={{ width: '100%' }}/>
        </DialogContent>
        <DialogActions className="dialogAction">
          <Button onClick={handleCloseModal} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CaptureImages;
