from contextlib import asynccontextmanager
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up LLM API Gateway...")
    print("Downloading / loading HuggingFace models in the background...")
    # Trigger model downloads asynchronously so the main loop isn't heavily blocked
    from services.video_answer_engine.main import load_video_model
    await asyncio.to_thread(load_video_model)
    print("HuggingFace models loaded successfully!")
    yield
    print("Shutting down LLM API Gateway...")

# Import our individual service apps
from services.blazing_fast_title_gen.main import app as title_app
from services.blazing_fast_stt.main import app as stt_app
from services.video_answer_engine.main import app as video_app

app = FastAPI(title="LLM API Gateway (Mounted)", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to LLM Service Gateway"}

# Mount the microservices
app.mount("/api/title", title_app)
app.mount("/api/stt", stt_app)
app.mount("/api/video", video_app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)