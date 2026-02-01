import { useEffect, useState } from 'react';
import axios from 'axios';
import LiveCard from '../components/LiveCard';
import { LayoutDashboard, Activity, CheckCircle, Clock } from 'lucide-react';

export default function DashboardView() {
    const [history, setHistory] = useState([]);

    // Simple polling/refresh logic
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('http://localhost:8000/history');
                // Simple comparison to avoid re-renders if no change (not optimized but fine for demo)
                setHistory(res.data);
            } catch (err) {
                console.error("Failed to fetch history", err);
            }
        };

        fetchHistory();
        const interval = setInterval(fetchHistory, 2000); // Poll every 2s
        return () => clearInterval(interval);
    }, []);

    const totalTickets = history.length;
    const resolvedTickets = history.filter(h => h.status === 'Resolved').length;
    const pendingTickets = totalTickets - resolvedTickets;

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <header className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                    <LayoutDashboard className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Live Agent Dashboard</h1>
                    <p className="text-slate-500 text-sm">Real-time incoming voice requests</p>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg shadow-blue-200">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-blue-100 font-medium">Total Complaints</span>
                        <Activity className="w-6 h-6 text-blue-100" />
                    </div>
                    <div className="text-4xl font-bold mb-1">{totalTickets}</div>
                    <div className="text-sm text-blue-100 opacity-80">All time received</div>
                </div>

                <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl p-6 text-white shadow-lg shadow-orange-200">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-orange-100 font-medium">Pending</span>
                        <Clock className="w-6 h-6 text-orange-100" />
                    </div>
                    <div className="text-4xl font-bold mb-1">{pendingTickets}</div>
                    <div className="text-sm text-orange-100 opacity-80">Requires attention</div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg shadow-green-200">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-green-100 font-medium">Resolved</span>
                        <CheckCircle className="w-6 h-6 text-green-100" />
                    </div>
                    <div className="text-4xl font-bold mb-1">{resolvedTickets}</div>
                    <div className="text-sm text-green-100 opacity-80">Successfully closed</div>
                </div>
            </div>

            <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-slate-400">
                        Waiting for calls...
                    </div>
                ) : (
                    history.map((item) => (
                        <LiveCard key={item.id} data={item} />
                    ))
                )}
            </div>
        </div>
    );
}
