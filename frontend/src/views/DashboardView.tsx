import { useEffect, useState } from 'react';
import axios from 'axios';
import LiveCard from '../components/LiveCard';
import { LayoutDashboard } from 'lucide-react';

export default function DashboardView() {
    const [history, setHistory] = useState<any[]>([]);

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
