import { useState } from 'react';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { cn } from '../lib/utils';

export default function TrackView() {
    const [ticketId, setTicketId] = useState('');
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ticketId) return;

        setLoading(true);
        setError('');
        setStatus(null);

        try {
            const res = await axios.get(`http://localhost:8000/ticket/${ticketId}`);
            setStatus(res.data);
        } catch (err) {
            setError("Ticket not found. Please check ID.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <Link to="/" className="inline-flex items-center text-slate-400 hover:text-slate-600 text-sm mb-6">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
                </Link>

                <h2 className="text-2xl font-bold text-slate-800 mb-1">Track Complaint</h2>
                <p className="text-slate-500 mb-6">Enter your Ticket ID to check status.</p>

                <form onSubmit={handleSearch} className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                        <input
                            type="number"
                            placeholder="e.g. 1"
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={ticketId}
                            onChange={e => setTicketId(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Track Status"}
                    </button>
                </form>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                {status && (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-slate-500 font-medium">Ticket #{status.id}</span>
                            <span className={cn(
                                "text-xs font-bold px-2 py-0.5 rounded-full uppercase",
                                status.status === "Resolved" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                            )}>
                                {status.status}
                            </span>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between border-b border-slate-200 pb-2">
                                <span className="text-slate-500">Category</span>
                                <span className="font-semibold capitalize text-slate-700">{status.category}</span>
                            </div>
                            <div className="flex justify-between pt-2">
                                <span className="text-slate-500">Logged</span>
                                <span className="font-semibold text-slate-700">{status.timestamp}</span>
                            </div>
                        </div>

                        {status.status === "Resolved" && (
                            <div className="mt-4 p-3 bg-green-100 rounded text-center text-green-800 text-sm font-medium">
                                This issue has been resolved.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
