import { useState } from 'react';

export const useAuthState = () => {
  const [user, setUser] = useState(null);

  const login = (credentials) => {
    // Add login logic here
    setUser({ email: credentials.email });
  };

  const logout = () => {
    setUser(null);
  };

  return { user, login, logout };
};