// auth.js

import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const storedUserEmail = localStorage.getItem('userEmail');
    if (storedUserEmail) {
      setUserEmail(storedUserEmail);
    }
  }, []);

  const getUserEmail = () => {
    return userEmail;
  };

  return {
    getUserEmail,
  };
};
