import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('civicsync_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.get('/auth/me')
        .then(res => { setUser(res.data); setLoading(false); })
        .catch(() => { logout(); setLoading(false); });
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (tokenValue, userData) => {
    localStorage.setItem('civicsync_token', tokenValue);
    localStorage.setItem('civicsync_user', JSON.stringify(userData));
    setToken(tokenValue);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('civicsync_token');
    localStorage.removeItem('civicsync_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (data) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}
