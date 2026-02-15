// UPDATED src/api.js with Image Upload Support
// This replaces your existing api.js file

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// PLANT NAMES API CALLS
// ============================================

export const getPlantNames = async () => {
  try {
    const response = await api.get('/plant-names');
    return response.data;
  } catch (error) {
    console.error('Error fetching plant names:', error);
    throw error;
  }
};

export const createPlantName = async (plantNameData) => {
  try {
    const response = await api.post('/plant-names', plantNameData);
    return response.data;
  } catch (error) {
    console.error('Error creating plant name:', error);
    throw error;
  }
};

// ============================================
// BREEDERS API CALLS
// ============================================

export const getBreeders = async () => {
  try {
    const response = await api.get('/breeders');
    return response.data;
  } catch (error) {
    console.error('Error fetching breeders:', error);
    throw error;
  }
};

export const createBreeder = async (breederData) => {
  try {
    const response = await api.post('/breeders', breederData);
    return response.data;
  } catch (error) {
    console.error('Error creating breeder:', error);
    throw error;
  }
};

// ============================================
// PLANTS API CALLS
// ============================================

export const getPlants = async () => {
  try {
    const response = await api.get('/plants');
    return response.data;
  } catch (error) {
    console.error('Error fetching plants:', error);
    throw error;
  }
};

export const getPlantById = async (id) => {
  try {
    const response = await api.get(`/plants/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching plant:', error);
    throw error;
  }
};

export const createPlant = async (plantData) => {
  try {
    const response = await api.post('/plants', plantData);
    return response.data;
  } catch (error) {
    console.error('Error creating plant:', error);
    throw error;
  }
};

export const updatePlant = async (id, plantData) => {
  try {
    const response = await api.put(`/plants/${id}`, plantData);
    return response.data;
  } catch (error) {
    console.error('Error updating plant:', error);
    throw error;
  }
};

export const deletePlant = async (id) => {
  try {
    const response = await api.delete(`/plants/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting plant:', error);
    throw error;
  }
};

// ============================================
// IMAGE API CALLS (NEW!)
// ============================================

// Get all images for a specific plant
export const getPlantImages = async (plantId) => {
  try {
    const response = await api.get(`/plants/${plantId}/images`);
    return response.data;
  } catch (error) {
    console.error('Error fetching plant images:', error);
    throw error;
  }
};

// Upload an image for a plant
export const uploadPlantImage = async (plantId, imageFile, caption = '', isPrimary = false) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('caption', caption);
    formData.append('is_primary', isPrimary);

    const response = await axios.post(
      `${API_BASE_URL}/plants/${plantId}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Set an image as the primary image for a plant
export const setImageAsPrimary = async (imageId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL.replace('/api', '')}/api/images/${imageId}/set-primary`
    );
    return response.data;
  } catch (error) {
    console.error('Error setting primary image:', error);
    throw error;
  }
};

// Delete an image
export const deleteImage = async (imageId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL.replace('/api', '')}/api/images/${imageId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// ============================================
// STOCK MOVEMENTS API CALLS
// ============================================

export const getStockMovements = async (plantId) => {
  try {
    const response = await api.get(`/plants/${plantId}/movements`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stock movements:', error);
    throw error;
  }
};

export const createStockMovement = async (movementData) => {
  try {
    const response = await api.post('/stock-movements', movementData);
    return response.data;
  } catch (error) {
    console.error('Error creating stock movement:', error);
    throw error;
  }
};

// ============================================
// EXPORT ALL FUNCTIONS
// ============================================

export default {
  getPlantNames,
  createPlantName,
  getBreeders,
  createBreeder,
  getPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
  getPlantImages,
  uploadPlantImage,
  setImageAsPrimary,
  deleteImage,
  getStockMovements,
  createStockMovement,
};