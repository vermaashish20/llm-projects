import os
# Suppress Hugging Face symlinks warning on Windows
# os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from .downloader import download_youtube_video
from faster_whisper import WhisperModel
import logging

# Configure logging for faster-whisper
logging.basicConfig()
logging.getLogger("faster_whisper").setLevel(logging.DEBUG)

app = FastAPI(title="Video Answer Engine Service")

# Initialize Whisper model lazily
model = None

def load_video_model():
    global model
    if model is not None:
        return
    model_size = "distil-large-v3"
    try:
        # Run on GPU with FP16
        model = WhisperModel(model_size)
        print(f"Successfully loaded {model_size} on CUDA.")
    except Exception as e:
        print(f"Failed to load on CUDA, falling back to CPU. Error: {e}")
        # run on CPU with INT8 fallback
        model = WhisperModel(model_size, device="cpu", compute_type="int8")

# Pydantic models
class TranscribeRequest(BaseModel):
    url: str

class TranscribeResponse(BaseModel):
    status: str
    title: str
    transcription: str

class ChatRequest(BaseModel):
    query: str
    video_id: str

class ChatResponse(BaseModel):
    reply: str

class VideoItem(BaseModel):
    id: str
    title: str

# Endpoints
@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to Video Answer Engine Service"}

@app.post("/transcribe", response_model=TranscribeResponse)
async def transcribe_video(req: TranscribeRequest):
    # Download the video using our yt-dlp script
    download_result = download_youtube_video(req.url)
    
    if not download_result.get("success"):
        raise HTTPException(status_code=400, detail=f"Failed to download video: {download_result.get('error')}")
        
    video_title = download_result["title"]
    file_path = download_result["filepath"]

    try:
        global model
        if model is None:
            print("DEBUG: model is not yet loaded, calling load_video_model()...")
            load_video_model()
            
        print(f"DEBUG: Starting transcription!")
        print(f"DEBUG: File path target is: {file_path}")
        print(f"DEBUG: Does the file actually exist at path? {os.path.exists(file_path)}")
        
        # Utilize faster-whisper for transcription with VAD filter enabled
        segments, info = model.transcribe(file_path, beam_size=5, vad_filter=True)
        print(f"DEBUG: Got info: Language={info.language}, Duration={info.duration}")
        
        transcription_lines = []
        for segment in segments:
            # Format output as requested: [start -> end] text
            transcription_lines.append("[%.2fs -> %.2fs] %s" % (segment.start, segment.end, segment.text))
            
        final_transcription = "\n".join(transcription_lines)
        print("DEBUG: Transcription fully completed successfully!")

        return TranscribeResponse(
            status="success",
            title=video_title,
            transcription=final_transcription if final_transcription else "No speech detected in this video."
        )
    except Exception as e:
        import traceback
        print("DEBUG: Exception encountered!!! printing traceback:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Transcription inference failed: {str(e)}")

@app.post("/chat", response_model=ChatResponse)
async def chat_with_video(req: ChatRequest):
    # Dummy chat logic
    return ChatResponse(
        reply=f"Here is a dummy answer for '{req.query}' regarding video '{req.video_id}'."
    )

@app.get("/list_transcribed", response_model=List[VideoItem])
async def list_transcribed_videos():
    # Dummy list
    return [
        VideoItem(id="v1", title="Lecture 1: Quantum Mechanics"),
        VideoItem(id="v2", title="Podcast: Future of AI"),
        VideoItem(id="v3", title="React Server Components Deep Dive"),
        VideoItem(id="v4", title="Y Combinator Startup Advice"),
    ]

@app.get("/get_current_transcription/{video_id}")
async def get_current_transcription(video_id: str):
    # Dummy logic to fetch transcription by ID
    return {
        "video_id": video_id,
        "title": f"Video Title {video_id}",
        "transcription": f"This is the cached transcription for video {video_id}. It contains lots of useful details."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("services.video_answer_engine.main:app", host="127.0.0.1", port=8002, reload=True)
