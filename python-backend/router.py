from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from database import get_session
from models import Video
from schemas import VideoOut, ViewOut

router = APIRouter(prefix="/api")


@router.get("/videos", response_model=list[VideoOut])
async def list_videos(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Video))
    return result.scalars().all()


@router.post("/videos/{video_id}/view", response_model=ViewOut)
async def record_view(video_id: int, session: AsyncSession = Depends(get_session)):
    exists = await session.execute(select(Video.id).where(Video.id == video_id))
    if exists.scalar_one_or_none() is None:
        raise HTTPException(status_code=404, detail="Video not found")
    await session.execute(
        update(Video).where(Video.id == video_id).values(views=Video.views + 1)
    )
    await session.commit()
    result = await session.execute(select(Video.views).where(Video.id == video_id))
    new_views = result.scalar_one()
    return ViewOut(views=new_views)
