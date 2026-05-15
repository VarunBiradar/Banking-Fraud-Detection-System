import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Alerts from './pages/Alerts';
import Sidebar from './components/Sidebar';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) return (
        <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
    
    if (!user) return <Navigate to="/login" />;
    
    return (
        <div className="flex relative">
            <div className="bg-glow glow-1"></div>
            <div className="bg-glow glow-2"></div>
            <Sidebar />
            <main className="flex-1 bg-transparent relative z-10">
                {children}
            </main>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route 
                        path="/*" 
                        element={
                            <ProtectedRoute>
                                <Routes>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/transactions" element={<Transactions />} />
                                    <Route path="/alerts" element={<Alerts />} />
                                </Routes>
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
