import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth } from '../modules/authentication/slice/userSlice';
import { getToken } from '../services/utils';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for existing token and user data on app startup
    const initializeAuthentication = () => {
      const token = getToken();
      
      if (token) {
        // If we have a token, we need to validate it and get user data
        // For now, we'll assume the token is valid if it exists
        // In a real app, you might want to make an API call to validate the token
        // and get fresh user data
        
        // Try to get user data from localStorage (if persisted)
        try {
          const persistedState = localStorage.getItem('persist:root');
          if (persistedState) {
            const parsedState = JSON.parse(persistedState);
            const userState = parsedState.user ? JSON.parse(parsedState.user) : null;
            
            if (userState && userState.user && userState.isAuthenticated) {
              // Initialize with persisted user data
              dispatch(initializeAuth({ 
                user: userState.user, 
                token 
              }));
              return;
            }
          }
        } catch (error) {
          console.warn('Failed to parse persisted state:', error);
        }
        
        // If we have a token but no valid persisted user data,
        // we should either fetch user data from API or clear the invalid token
        // For now, we'll clear the invalid session
        dispatch(initializeAuth({ user: null, token: null }));
      } else {
        // No token found, ensure auth state is cleared
        dispatch(initializeAuth({ user: null, token: null }));
      }
    };

    // Only run once on mount
    initializeAuthentication();
  }, []); // Remove dispatch from dependencies to prevent re-runs

  return <>{children}</>;
};

export default AuthInitializer;
