from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Title Generation Service")

class TitleRequest(BaseModel):
    text: str

class TitleResponse(BaseModel):
    title: str

@app.post("/generate", response_model=TitleResponse)
async def generate_title(req: TitleRequest):
    # Dummy implementation for now
    words = req.text.split()
    if not words:
        return TitleResponse(title="Empty Content")
    title = f"Here is a generated title for: {' '.join(words[:5])}..."
    return TitleResponse(title=title)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to Title Generation Service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("services.blazing_fast_title_gen.main:app", host="127.0.0.1", port=8001, reload=True)
