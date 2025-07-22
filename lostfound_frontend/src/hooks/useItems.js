import { useState } from 'react';
// We will now import the functions directly from the api service
import { reportItemApi } from '../services/api'; 

export const useItems = () => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);

  // A single, robust function to handle reporting either lost or found items.
  // The 'payload' is the FormData object from the component.
  const addLostItem = async (payload) => {
    try {
      // The API call now happens in api.js, which correctly handles auth headers
      const data = await reportItemApi(payload);
      setLostItems(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Failed to report lost item:', error.response?.data || error);
      throw new Error(error.response?.data?.error || 'Failed to report lost item');
    }
  };

  const addFoundItem = async (payload) => {
    try {
      const data = await reportItemApi(payload);
      setFoundItems(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Failed to report found item:', error.response?.data || error);
      throw new Error(error.response?.data?.error || 'Failed to report found item');
    }
  };

  return { lostItems, foundItems, addLostItem, addFoundItem };
};