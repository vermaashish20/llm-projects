from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class TitleRequest(BaseModel):
    text: str

class TitleResponse(BaseModel):
    title: str

@router.post("/generate", response_model=TitleResponse)
async def generate_title(req: TitleRequest):
    # Dummy implementation for now, should integrate real LLM logic here
    words = req.text.split()
    if not words:
        return TitleResponse(title="Empty Content")
    title = f"Here is a generated title for: {' '.join(words[:5])}..."
    return TitleResponse(title=title)
