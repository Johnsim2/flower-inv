// UPDATED src/App.js with Search Functionality
// This replaces your existing App.js

import React, { useState, useEffect } from 'react';
import './App.css';
import PlantList from './components/PlantList';
import PlantForm from './components/PlantForm';
import ImageUpload from './components/ImageUpload';
import ImageLightbox from './components/ImageLightbox';
import SearchBar from './components/SearchBar';
import { getPlants, getPlantNames, getBreeders, createPlant, updatePlant, deletePlant } from './api';

function App() {
  // State management
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [plantNames, setPlantNames] = useState([]);
  const [breeders, setBreeders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxPlantName, setLightboxPlantName] = useState('');
  const [editingPlant, setEditingPlant] = useState(null);
  const [selectedPlantForImages, setSelectedPlantForImages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data when component mounts
  useEffect(() => {
    loadData();
  }, []);

  // Function to load all data from API
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [plantsData, plantNamesData, breedersData] = await Promise.all([
        getPlants(),
        getPlantNames(),
        getBreeders()
      ]);

      setPlants(plantsData);
      setFilteredPlants(plantsData); // Initially show all plants
      setPlantNames(plantNamesData);
      setBreeders(breedersData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Make sure your backend server is running on port 3001.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (searchTerm, searchField) => {
    if (!searchTerm) {
      // No search term - show all plants
      setFilteredPlants(plants);
      return;
    }

    const term = searchTerm.toLowerCase();
    
    const filtered = plants.filter(plant => {
      switch (searchField) {
        case 'code':
          return plant.identification_code?.toLowerCase().includes(term);
        
        case 'variety':
          return plant.variety_name?.toLowerCase().includes(term);
        
        case 'botanical':
          return plant.botanical_name?.toLowerCase().includes(term);
        
        case 'color':
          return plant.flower_color?.toLowerCase().includes(term);
        
        case 'breeder':
          return plant.breeder_name?.toLowerCase().includes(term);
        
        case 'all':
        default:
          // Search in all fields
          return (
            plant.identification_code?.toLowerCase().includes(term) ||
            plant.variety_name?.toLowerCase().includes(term) ||
            plant.botanical_name?.toLowerCase().includes(term) ||
            plant.flower_color?.toLowerCase().includes(term) ||
            plant.breeder_name?.toLowerCase().includes(term) ||
            plant.common_name?.toLowerCase().includes(term) ||
            plant.notes?.toLowerCase().includes(term)
          );
      }
    });

    setFilteredPlants(filtered);
  };

  // Handle adding a new plant
  const handleAddPlant = async (plantData) => {
    try {
      await createPlant(plantData);
      await loadData();
      setShowForm(false);
      alert('Plant added successfully!');
    } catch (err) {
      console.error('Error adding plant:', err);
      alert('Failed to add plant. Please check all required fields.');
    }
  };

  // Handle editing an existing plant
  const handleUpdatePlant = async (plantData) => {
    try {
      await updatePlant(editingPlant.id, plantData);
      await loadData();
      setShowForm(false);
      setEditingPlant(null);
      alert('Plant updated successfully!');
    } catch (err) {
      console.error('Error updating plant:', err);
      alert('Failed to update plant. Please try again.');
    }
  };

  // Handle form submission (add or edit)
  const handleFormSubmit = async (plantData) => {
    if (editingPlant) {
      await handleUpdatePlant(plantData);
    } else {
      await handleAddPlant(plantData);
    }
  };

  // Handle deleting a plant
  const handleDeletePlant = async (plantId) => {
    try {
      await deletePlant(plantId);
      await loadData();
      alert('Plant deleted successfully!');
    } catch (err) {
      console.error('Error deleting plant:', err);
      alert('Failed to delete plant. Please try again.');
    }
  };

  // Handle edit button click
  const handleEditClick = (plant) => {
    setEditingPlant(plant);
    setShowForm(true);
  };

  // Handle cancel form
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPlant(null);
  };

  // Handle manage images button click
  const handleManageImages = (plant) => {
    setSelectedPlantForImages(plant);
    setShowImageUpload(true);
  };

  // Handle close image upload
  const handleCloseImageUpload = () => {
    setShowImageUpload(false);
    setSelectedPlantForImages(null);
  };

  // Handle image uploaded (reload plants to show new primary image)
  const handleImageUploaded = () => {
    loadData();
  };

  // Handle thumbnail click to open lightbox
  const handleImageClick = (imageUrl, plantName) => {
    setLightboxImage(imageUrl);
    setLightboxPlantName(plantName);
    setShowLightbox(true);
  };

  // Handle close lightbox
  const handleCloseLightbox = () => {
    setShowLightbox(false);
    setLightboxImage(null);
    setLightboxPlantName('');
  };

  // Loading state
  if (loading) {
    return (
      <div className="App">
        <div className="loading">
          <h2>Loading...</h2>
          <p>Connecting to database...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="App">
        <div className="error">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          <button onClick={loadData} className="btn-retry">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Main app render
  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1>🌸 Flower Inventory Manager</h1>
          <p>Professional growing management system</p>
        </div>
        {!showForm && (
          <button 
            className="btn-add-new"
            onClick={() => setShowForm(true)}
          >
            ➕ Add New Plant
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="app-main">
        {/* Show form or plant list */}
        {showForm ? (
          <PlantForm
            plantNames={plantNames}
            breeders={breeders}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
            editingPlant={editingPlant}
          />
        ) : (
          <>
            {/* Search Bar */}
            <SearchBar onSearch={handleSearch} />

            {/* Plant List */}
            <PlantList
              plants={filteredPlants}
              onEdit={handleEditClick}
              onDelete={handleDeletePlant}
              onManageImages={handleManageImages}
              onImageClick={handleImageClick}
            />

            {/* Show count */}
            {filteredPlants.length !== plants.length && (
              <div className="search-results-count">
                Showing {filteredPlants.length} of {plants.length} plants
              </div>
            )}
          </>
        )}
      </main>

      {/* Image Upload Modal */}
      {showImageUpload && selectedPlantForImages && (
        <ImageUpload
          plantId={selectedPlantForImages.id}
          plantName={selectedPlantForImages.variety_name}
          onClose={handleCloseImageUpload}
          onImageUploaded={handleImageUploaded}
        />
      )}

      {/* Image Lightbox */}
      {showLightbox && (
        <ImageLightbox
          image={lightboxImage}
          plantName={lightboxPlantName}
          onClose={handleCloseLightbox}
        />
      )}

      {/* Footer */}
      <footer className="app-footer">
        <p>Flower Inventory Manager v1.3 | Total Plants: {plants.length} | Showing: {filteredPlants.length} | With Photos: {plants.filter(p => p.primary_image).length}</p>
      </footer>
    </div>
  );
}

export default App;
