import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // This effect runs only once on initial app load
    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                api.setAuthToken(token);
                try {
                    // On load, always verify the token by fetching the profile
                    const userProfile = await api.getProfile();
                    setCurrentUser(userProfile);
                } catch (error) {
                    // If fetching profile fails, the token is invalid/expired
                    console.error("Invalid token on startup, logging out.");
                    logout(); // Call logout to clear bad data
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);

    const login = async (credentials) => {
        // 1. Get tokens from the API
        const tokenData = await api.login(credentials);
        api.setAuthToken(tokenData.access);

        // 2. Fetch the full, trusted user profile from the backend
        const userProfile = await api.getProfile();

        // 3. Store everything and update state
        localStorage.setItem('user', JSON.stringify(userProfile));
        localStorage.setItem('token', tokenData.access);
        localStorage.setItem('refresh', tokenData.refresh);
        setCurrentUser(userProfile);
        
        return userProfile;
    };

    const signup = async (userData) => {
        await api.register(userData);
        // After successful registration, perform a clean login to get tokens and set state.
        // This avoids any potential race conditions.
        await login({ email: userData.email, password: userData.password });
    };

    const logout = () => {
        api.setAuthToken(null);
        setCurrentUser(null);
        // Clear everything to ensure a clean state on next visit
        localStorage.clear();
    };

    const value = {
        currentUser,
        loading,
        login,
        signup,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};