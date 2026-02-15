// src/components/ImageUpload.js
// Component for uploading and managing plant images

import React, { useState, useEffect } from 'react';
import './ImageUpload.css';
import { getPlantImages, uploadPlantImage, setImageAsPrimary, deleteImage } from '../api';

function ImageUpload({ plantId, plantName, onClose, onImageUploaded }) {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load existing images when component mounts
  useEffect(() => {
    loadImages();
  }, [plantId]);

  const loadImages = async () => {
    try {
      const data = await getPlantImages(plantId);
      setImages(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading images:', error);
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image upload
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please select an image first');
      return;
    }

    setUploading(true);

    try {
      await uploadPlantImage(plantId, selectedFile, caption, isPrimary);
      
      // Reset form
      setSelectedFile(null);
      setCaption('');
      setIsPrimary(false);
      setPreviewUrl(null);
      
      // Reload images
      await loadImages();
      
      // Notify parent component
      if (onImageUploaded) {
        onImageUploaded();
      }

      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Handle setting image as primary
  const handleSetPrimary = async (imageId) => {
    try {
      await setImageAsPrimary(imageId);
      await loadImages();
      
      if (onImageUploaded) {
        onImageUploaded();
      }
      
      alert('Primary image updated!');
    } catch (error) {
      console.error('Error setting primary image:', error);
      alert('Failed to set primary image.');
    }
  };

  // Handle image deletion
  const handleDelete = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await deleteImage(imageId);
      await loadImages();
      
      if (onImageUploaded) {
        onImageUploaded();
      }
      
      alert('Image deleted successfully!');
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image.');
    }
  };

  return (
    <div className="image-upload-modal">
      <div className="image-upload-container">
        <div className="modal-header">
          <h2>📸 Manage Images - {plantName}</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Upload Form */}
          <div className="upload-section">
            <h3>Upload New Image</h3>
            <form onSubmit={handleUpload}>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  id="image-file"
                  className="file-input"
                />
                <label htmlFor="image-file" className="file-label">
                  {selectedFile ? selectedFile.name : 'Choose an image...'}
                </label>
              </div>

              {previewUrl && (
                <div className="image-preview">
                  <img src={previewUrl} alt="Preview" />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="caption">Caption (optional)</label>
                <input
                  type="text"
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g., Full bloom, Young plant, etc."
                />
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={isPrimary}
                    onChange={(e) => setIsPrimary(e.target.checked)}
                  />
                  Set as primary image
                </label>
              </div>

              <button 
                type="submit" 
                className="btn-upload"
                disabled={!selectedFile || uploading}
              >
                {uploading ? 'Uploading...' : '📤 Upload Image'}
              </button>
            </form>
          </div>

          {/* Existing Images */}
          <div className="images-section">
            <h3>Existing Images ({images.length})</h3>
            
            {loading ? (
              <p>Loading images...</p>
            ) : images.length === 0 ? (
              <p className="no-images">No images uploaded yet.</p>
            ) : (
              <div className="images-grid">
                {images.map((image) => (
                  <div key={image.id} className="image-card">
                    <div className="image-wrapper">
                      <img 
                        src={`http://localhost:3001${image.image_url}`} 
                        alt={image.caption || 'Plant image'} 
                      />
                      {image.is_primary && (
                        <span className="primary-badge">⭐ Primary</span>
                      )}
                    </div>
                    
                    {image.caption && (
                      <p className="image-caption">{image.caption}</p>
                    )}
                    
                    <div className="image-actions">
                      {!image.is_primary && (
                        <button
                          className="btn-set-primary"
                          onClick={() => handleSetPrimary(image.id)}
                        >
                          Set as Primary
                        </button>
                      )}
                      <button
                        className="btn-delete-image"
                        onClick={() => handleDelete(image.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-done" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
