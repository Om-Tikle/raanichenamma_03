import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Loader2, CheckCircle, Copy } from 'lucide-react';

export default function TextSupportView() {
    const [text, setText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        setIsProcessing(true);
        try {
            const response = await axios.post('http://localhost:8000/process-text', { text });
            setResult(response.data);
        } catch (error) {
            console.error("Error processing text:", error);
            alert("Error processing request.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <div className="p-6">
                    <Link to="/" className="inline-flex items-center text-slate-400 hover:text-slate-600 text-sm mb-6">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
                    </Link>

                    {!result ? (
                        <>
                            <h1 className="text-2xl font-bold text-slate-800 mb-2">Describe your Issue</h1>
                            <p className="text-slate-500 mb-6">Type detailed description of your problem.</p>

                            <form onSubmit={handleSubmit}>
                                <textarea
                                    className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[150px] mb-4 text-slate-700 placeholder:text-slate-300"
                                    placeholder="e.g. My internet has been slow for 2 days..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    disabled={isProcessing}
                                />

                                <button
                                    type="submit"
                                    disabled={!text.trim() || isProcessing}
                                    className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" /> Submit Ticket
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="animate-in fade-in zoom-in duration-300">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800">Ticket Created!</h2>
                                <p className="text-slate-500">Your issue has been registered.</p>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
                                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Ticket ID</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-mono font-bold text-slate-900">#{result.id}</span>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(result.id.toString())}
                                        className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-colors"
                                    >
                                        <Copy className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-purple-50 text-purple-700 rounded-lg">
                                    <span className="text-sm font-medium">Category</span>
                                    <span className="font-bold capitalize">{result.category}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => { setResult(null); setText(''); }}
                                className="w-full mt-6 py-3 text-slate-500 font-medium hover:text-slate-800 transition-colors"
                            >
                                Submit New Ticket
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
