from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models import Video

SEED_VIDEOS = [
    {
        "title": "Apple BipBop (мультибитрейт)",
        "m3u8_url": "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8",
    },
    {
        "title": "Mux Test Stream (мультибитрейт)",
        "m3u8_url": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    },
    {
        "title": "Apple Advanced HLS",
        "m3u8_url": "https://devstreaming-cdn.apple.com/videos/streaming/examples/adv_dv_atmos/main.m3u8",
    },
]


async def seed_videos(session: AsyncSession) -> None:
    result = await session.execute(select(Video))
    if result.scalars().first() is not None:
        return
    for data in SEED_VIDEOS:
        session.add(Video(**data, views=0))
    await session.commit()
