import { useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Mic, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';

export default function CustomerView() {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                await processAudio(blob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setTranscript(null);
            setResult(null);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsProcessing(true);
        }
    };

    const processAudio = async (blob: Blob) => {
        const formData = new FormData();
        formData.append('file', blob, 'recording.webm');

        try {
            const response = await axios.post('http://localhost:8000/process-audio', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResult(response.data);
            setTranscript(response.data.transcription);
        } catch (error) {
            console.error("Error processing audio:", error);
            alert("Error processing audio. Ensure backend is running.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <div className="p-6 text-center">
                    <div className="flex justify-start mb-4">
                        <Link to="/" className="text-slate-400 hover:text-slate-600">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Voice Support</h1>
                    <p className="text-slate-500 mb-8">Tap the mic and describe your issue.</p>

                    <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={cn(
                            "relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
                            isRecording
                                ? "bg-red-500 text-white animate-pulse ring-4 ring-red-200"
                                : "bg-primary text-white hover:bg-primary/90 hover:scale-105 ring-4 ring-blue-100"
                        )}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <Loader2 className="w-10 h-10 animate-spin" />
                        ) : (
                            <Mic className="w-10 h-10" />
                        )}
                    </button>

                    <p className="mt-6 text-sm font-medium text-slate-600">
                        {isRecording ? "Listening..." : isProcessing ? "Processing..." : "Tap to Speak"}
                    </p>
                </div>

                {/* Live Transcript & Result Box */}
                {(transcript || result) && (
                    <div className="bg-slate-50 p-6 border-t border-slate-100">
                        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Live Transcript</h2>
                        <div className="bg-white p-4 rounded-lg border border-slate-200 text-slate-700 italic mb-4">
                            "{transcript}"
                        </div>

                        {result && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex items-center justify-between mb-2">
                                    <div>
                                        <p className="text-xs text-green-600 font-bold uppercase">Ticket ID</p>
                                        <p className="text-xl font-mono font-bold text-green-800">#{result.id}</p>
                                    </div>
                                    <CheckCircle className="w-6 h-6 text-green-500" />
                                </div>

                                <div className="flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-lg">
                                    <span className="text-sm font-medium">Language</span>
                                    <span className="font-bold uppercase">{result.language}</span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-purple-50 text-purple-700 rounded-lg">
                                    <span className="text-sm font-medium">Routed To</span>
                                    <span className="font-bold capitalize">{result.category} Dept.</span>
                                </div>

                                <div className="flex items-center gap-2 mt-4 text-xs text-slate-400 justify-center">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>Ticket Created Automatically</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
