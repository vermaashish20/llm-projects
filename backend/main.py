from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import our individual service apps
from services.blazing_fast_title_gen.main import app as title_app
from services.blazing_fast_stt.main import app as stt_app
from services.video_answer_engine.main import app as video_app

app = FastAPI(title="LLM API Gateway (Mounted)")

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