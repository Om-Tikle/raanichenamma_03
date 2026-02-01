import os
from faster_whisper import WhisperModel
from transformers import pipeline

class Transcriber:
    def __init__(self, model_size="small", device="cpu", compute_type="int8"):
        print(f"Loading Whisper model: {model_size} on {device}...")
        self.model = WhisperModel(model_size, device=device, compute_type=compute_type)
        print("Whisper model loaded.")

    def transcribe(self, audio_path: str):
        # Enabled VAD filter and increased beam size slightly for better accuracy
        segments, info = self.model.transcribe(audio_path, beam_size=5, vad_filter=True)
        text = " ".join([segment.text for segment in segments])
        return {
            "text": text,
            "language": info.language,
            "probability": info.language_probability
        }

class Classifier:
    def __init__(self):
        print("Loading Zero-Shot Classifier...")
        # using a smaller, faster model for zero-shot
        self.classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
        print("Loading Sentiment Analyzer...")
        self.sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
        print("Models loaded.")

    def classify_intent(self, text: str, labels: list):
        result = self.classifier(text, candidate_labels=labels)
        return {
            "label": result["labels"][0],
            "score": result["scores"][0]
        }

    def analyze_sentiment(self, text: str):
        result = self.sentiment_analyzer(text)[0]
        return {
            "label": result["label"], # POSITIVE / NEGATIVE
            "score": result["score"]
        }
