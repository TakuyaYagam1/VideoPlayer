from fastapi import FastAPI
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(title="IfBest Video Player API", lifespan=lifespan)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
