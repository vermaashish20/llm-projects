from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel

app = FastAPI(title="Speech-to-Text Service")

class STTResponse(BaseModel):
    text: str

@app.post("/transcribe", response_model=STTResponse)
async def transcribe_audio(file: UploadFile = File(...)):
    # Dummy implementation for now, should integrate STT logic here (like Whisper)
    return STTResponse(text=f"Transcribed text for {file.filename}")


@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to Speech-to-Text Service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("services.blazing_fast_stt.main:app", host="127.0.0.1", port=8002, reload=True)
