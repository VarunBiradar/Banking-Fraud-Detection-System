import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // In a real app, you'd fetch the user profile here
            setUser({ email: 'user@example.com' }); // Placeholder
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/authenticate', { email, password });
        const { token } = response.data;
        localStorage.setItem('token', token);
        setUser({ email });
        return response.data;
    };

    const register = async (userData) => {
        const response = await api.post('/auth/register', userData);
        const { token } = response.data;
        localStorage.setItem('token', token);
        setUser({ email: userData.email });
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
