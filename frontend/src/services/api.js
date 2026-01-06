import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const createProperty = async (propertyData) => {
  // On utilise FormData car il y a des fichiers (images)
  const formData = new FormData();
  
  // Ajout des champs simples
  Object.keys(propertyData).forEach(key => {
    if (key !== 'files') {
      formData.append(key, propertyData[key]);
    }
  });

  // Ajout des fichiers images
  if (propertyData.files) {
    propertyData.files.forEach(file => {
      formData.append('files', file);
    });
  }

  const response = await axios.post(`${API_URL}/properties/add`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};