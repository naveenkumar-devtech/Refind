import { useState } from 'react';

export const useNotifications = () => {
  const [notifications] = useState([
    {
      id: 1,
      message: 'Potential match found for your lost iPhone.',
      read: false,
      timestamp: new Date().toISOString(), // Use ISO string for consistency
    },
    {
      id: 2,
      message: 'Someone uploaded a photo similar to your lost bag.',
      read: false,
      timestamp: new Date(Date.now() - 3600 * 1000).toISOString(), // 1 hour ago
    },
    {
      id: 3,
      message: 'An admin verified your lost item submission.',
      read: true,
      timestamp: new Date(Date.now() - 86400 * 1000).toISOString(), // 1 day ago
    },
  ]);

  return { notifications };
};
