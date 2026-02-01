import { Link } from 'react-router-dom';
import { Mic, Search, MessageSquare, ArrowRight } from 'lucide-react';

export default function CustomerLanding() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-4xl text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600 mb-4">
                    Swar Ankush
                </h1>
                <p className="text-slate-500 text-lg mb-12">AI-Powered Voice Governance & Support System</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Voice Support */}
                    <Link to="/voice" className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col items-center hover:-translate-y-1">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Mic className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Voice Assistant</h3>
                        <p className="text-slate-500 text-sm mb-4">Report issues or request service using your voice.</p>
                        <div className="mt-auto flex items-center text-blue-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                            Start Speaking <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </Link>

                    {/* Card 2: Track Progress */}
                    <Link to="/track" className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col items-center hover:-translate-y-1">
                        <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            <Search className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Track Progress</h3>
                        <p className="text-slate-500 text-sm mb-4">Check the status of your existing complaints.</p>
                        <div className="mt-auto flex items-center text-orange-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                            View Status <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </Link>

                    {/* Card 3: Feedback */}
                    <Link to="/feedback" className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col items-center hover:-translate-y-1">
                        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <MessageSquare className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Feedback</h3>
                        <p className="text-slate-500 text-sm mb-4">Share your experience to help us improve.</p>
                        <div className="mt-auto flex items-center text-green-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                            Give Feedback <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
