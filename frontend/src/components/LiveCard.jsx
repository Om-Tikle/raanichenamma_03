import { useState } from 'react';
import axios from 'axios';
import { cn } from '../lib/utils';
import { Check, Loader2 } from 'lucide-react';

export default function LiveCard({ data }) {
    const [status, setStatus] = useState(data.status);
    const [updating, setUpdating] = useState(false);

    const isNegative = data.sentiment === "NEGATIVE";
    const isResolved = status === "Resolved";

    const markResolved = async () => {
        setUpdating(true);
        try {
            await axios.patch(`http://localhost:8000/ticket/${data.id}/status`, { status: "Resolved" });
            setStatus("Resolved");
        } catch (err) {
            console.error("Failed to update status", err);
            alert("Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className={cn(
            "bg-white p-4 rounded-xl shadow-sm border transition-all hover:shadow-md",
            isResolved ? "border-green-200 bg-green-50/30" : "border-slate-100"
        )}>
            <div className="flex items-start justify-between mb-2">
                <div className="flex gap-2">
                    <span className={cn(
                        "px-2 py-1 rounded text-xs font-bold uppercase tracking-wider",
                        isNegative ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                    )}>
                        {data.sentiment}
                    </span>
                    <span className={cn(
                        "px-2 py-1 rounded text-xs font-bold uppercase tracking-wider",
                        isResolved ? "bg-green-600 text-white" : "bg-blue-100 text-blue-700"
                    )}>
                        {status}
                    </span>
                </div>
                <span className="text-xs text-slate-400">{data.timestamp}</span>
            </div>

            <h3 className="text-lg font-bold text-slate-800 capitalize mb-1">{data.category}</h3>
            <p className="text-sm text-slate-600 line-clamp-2 mb-3">"{data.transcription}"</p>

            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 font-mono uppercase">
                        {data.language}
                    </span>
                    <span>• ID #{data.id}</span>
                </div>

                {!isResolved && (
                    <button
                        onClick={markResolved}
                        disabled={updating}
                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-700 disabled:opacity-50"
                    >
                        {updating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                        Resolve
                    </button>
                )}
            </div>
        </div>
    );
}
