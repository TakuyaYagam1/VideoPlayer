from pydantic import BaseModel


class VideoOut(BaseModel):
    id: int
    title: str
    m3u8_url: str
    views: int

    model_config = {"from_attributes": True}


class ViewOut(BaseModel):
    views: int
