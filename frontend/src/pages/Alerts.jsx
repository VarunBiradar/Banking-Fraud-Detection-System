import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    AlertTriangle, ShieldAlert, CheckCircle2, 
    ArrowRight, MapPin, DollarSign, Calendar
} from 'lucide-react';
import api from '../api/axios';

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            const response = await api.get('/transactions/alerts');
            setAlerts(response.data);
        } catch (error) {
            console.error('Error fetching alerts:', error);
        } finally {
            setLoading(false);
        }
    };

    const getReasonText = (reason) => {
        return reason.split(';').filter(r => r.trim()).map(r => r.trim().replace('_', ' ')).join(', ');
    };

    return (
        <div className="p-12 ml-72 min-h-screen">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2 outfit">Security Alerts</h2>
                <p className="text-slate-400">Review and resolve flagged activities on your account.</p>
            </header>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="glass-card p-6 h-48 animate-pulse bg-white/2"></div>
                    ))}
                </div>
            ) : alerts.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 outfit">No Security Issues</h3>
                    <p className="text-slate-400">Your account is safe and no suspicious activity has been detected.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {alerts.map((alert) => (
                        <motion.div 
                            key={alert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`glass-card p-6 border-l-4 ${alert.isResolved ? 'border-emerald-500' : 'border-red-500'} hover:scale-[1.02] transition-transform`}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3 rounded-xl ${alert.isResolved ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                    <ShieldAlert size={24} />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${alert.isResolved ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {alert.isResolved ? 'RESOLVED' : 'UNRESOLVED'}
                                </span>
                            </div>

                            <h4 className="text-lg font-bold text-white mb-2 outfit">Suspicious Activity</h4>
                            <p className="text-sm text-slate-400 mb-6">
                                Flagged due to: <span className="text-red-400 font-medium uppercase">{getReasonText(alert.reason)}</span>
                            </p>

                            <div className="space-y-3 mb-6 bg-white/2 rounded-xl p-4 border border-white/5">
                                <div className="flex items-center gap-3 text-sm">
                                    <DollarSign size={16} className="text-slate-500" />
                                    <span className="text-white font-semibold">${alert.transaction.amount.toLocaleString()}</span>
                                    <span className="text-slate-500">at {alert.transaction.merchant}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <MapPin size={16} className="text-slate-500" />
                                    <span className="text-slate-300">{alert.transaction.location}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar size={16} className="text-slate-500" />
                                    <span className="text-slate-500">
                                        {new Date(alert.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <button className="w-full group flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all">
                                View Details
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Alerts;
