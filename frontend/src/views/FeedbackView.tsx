import { useState } from 'react';
import { ArrowLeft, Star, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function FeedbackView() {
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Thank You!</h2>
                    <p className="text-slate-500 mb-8">Your feedback helps us improve Swar Ankush.</p>
                    <Link to="/" className="inline-block px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <Link to="/" className="inline-flex items-center text-slate-400 hover:text-slate-600 text-sm mb-6">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
                </Link>

                <h2 className="text-2xl font-bold text-slate-800 mb-2">We value your opinion</h2>
                <p className="text-slate-500 mb-8">Rate your experience with Swar Ankush.</p>

                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center gap-2 mb-8">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none transition-transform hover:scale-110"
                            >
                                <Star
                                    className={cn(
                                        "w-10 h-10 transition-colors",
                                        star <= rating ? "fill-yellow-400 text-yellow-500" : "text-slate-300"
                                    )}
                                />
                            </button>
                        ))}
                    </div>

                    <textarea
                        className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px] mb-6"
                        placeholder="Tell us what you liked or how we can improve..."
                    ></textarea>

                    <button
                        type="submit"
                        disabled={rating === 0}
                        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Submit Feedback
                    </button>
                </form>
            </div>
        </div>
    );
}
