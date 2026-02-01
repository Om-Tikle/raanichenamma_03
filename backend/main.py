import shutil
import os
import tempfile
from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from services import Transcriber, Classifier
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global service instances
transcriber = None
classifier = None

CANDIDATE_LABELS = [
    "billing",
    "technical issue",
    "password reset",
    "account access",
    "service request"
]

# In-memory storage
# { id: 1, text: "...", language: "en", status: "Open", ... }
processed_calls = []

@app.on_event("startup")
def load_models():
    global transcriber, classifier
    transcriber = Transcriber()
    classifier = Classifier()

# Helper for analysis
def analyze_content(text: str):
    intent = {"label": "unknown", "score": 0.0}
    sentiment = {"label": "NEUTRAL", "score": 0.0}

    if text.strip() and classifier:
        intent = classifier.classify_intent(text, CANDIDATE_LABELS)
        sentiment = classifier.analyze_sentiment(text)
    
    return intent, sentiment

def create_ticket(text: str, language: str):
    intent, sentiment = analyze_content(text)
    
    ticket = {
        "id": len(processed_calls) + 1,
        "transcription": text,
        "language": language,
        "category": intent["label"],
        "category_confidence": intent["score"],
        "sentiment": sentiment["label"],
        "sentiment_score": sentiment["score"],
        "status": "Open", # Open, Resolved
        "timestamp": "Just Now"
    }
    processed_calls.insert(0, ticket)
    return ticket

@app.post("/process-audio")
async def process_audio(file: UploadFile = File(...)):
    if not transcriber or not classifier:
        raise HTTPException(status_code=503, detail="Models not loaded")

    filename = file.filename or "audio.webm"
    _, ext = os.path.splitext(filename)
    if not ext: ext = ".webm"

    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as temp_audio:
        shutil.copyfileobj(file.file, temp_audio)
        temp_path = temp_audio.name

    try:
        transcription_result = transcriber.transcribe(temp_path)
        text = transcription_result["text"]
        language = transcription_result["language"]
        
        return create_ticket(text, language)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

class TextRequest(BaseModel):
    text: str

@app.post("/process-text")
async def process_text(req: TextRequest):
    if not classifier:
        raise HTTPException(status_code=503, detail="Models not loaded")
    return create_ticket(req.text, "en") # Assume English for text input or add detection later

class StatusUpdate(BaseModel):
    status: str

@app.patch("/ticket/{ticket_id}/status")
async def update_status(ticket_id: int, update: StatusUpdate):
    for ticket in processed_calls:
        if ticket["id"] == ticket_id:
            ticket["status"] = update.status
            return ticket
    raise HTTPException(status_code=404, detail="Ticket not found")

@app.get("/ticket/{ticket_id}")
async def get_ticket(ticket_id: int):
    for ticket in processed_calls:
        if ticket["id"] == ticket_id:
            return ticket
    raise HTTPException(status_code=404, detail="Ticket not found")

@app.get("/history")
def get_history():
    return processed_calls

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Smart IVR Backend is running"}
