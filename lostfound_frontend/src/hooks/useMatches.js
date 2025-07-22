import { useState } from 'react';

export const useMatches = () => {
  const [matches] = useState([
    {
      id: 1,
      lostItemId: 1,
      foundItemId: 2,
      confidence: 0.85,
      status: 'pending'
    }
  ]);

  return { matches };
};