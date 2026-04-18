from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from .downloader import download_youtube_video

app = FastAPI(title="Video Answer Engine Service")

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

    # Dummy transcription logic returning actual title
    return TranscribeResponse(
        status="success",
        title=video_title,
        transcription=f"Video successfully downloaded to '{file_path}'. \n\n[Dummy Transcription] \nThis is a placeholder for the actual `faster-whisper` output..."
    )

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
