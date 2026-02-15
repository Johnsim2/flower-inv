// src/components/ImageLightbox.js
// Component for viewing images in full size with modal overlay

import React from 'react';
import './ImageLightbox.css';

function ImageLightbox({ image, plantName, onClose }) {
  // Handle clicking outside the image to close
  const handleBackdropClick = (e) => {
    if (e.target.className === 'lightbox-backdrop') {
      onClose();
    }
  };

  // Handle escape key to close
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    // Prevent body scrolling when lightbox is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!image) return null;

  return (
    <div className="lightbox-backdrop" onClick={handleBackdropClick}>
      <div className="lightbox-container">
        {/* Close button */}
        <button className="lightbox-close" onClick={onClose} title="Close (Esc)">
          ✕
        </button>

        {/* Image */}
        <div className="lightbox-image-wrapper">
          <img 
            src={`http://localhost:3001${image}`} 
            alt={plantName}
            className="lightbox-image"
          />
        </div>

        {/* Plant name caption */}
        <div className="lightbox-caption">
          <h3>{plantName}</h3>
          <p className="lightbox-hint">Click outside image or press ESC to close</p>
        </div>
      </div>
    </div>
  );
}

export default ImageLightbox;
