from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.title import router as title_router

app = FastAPI(title="LLM Showcase API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(title_router, prefix="/api/title", tags=["Title Generation"])

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to LLM Showcase API"}
