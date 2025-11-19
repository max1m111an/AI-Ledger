from importlib.util import find_spec

from fastapi import FastAPI

from backend.autodiscover import api_discover
from shared.database import init_db

if find_spec("dotenv") is not None:
    from dotenv import load_dotenv

    load_dotenv()

app = FastAPI()


@app.on_event("startup")
async def init_database():
    await init_db()


@app.post("/hello")
def get_name(name: str):
    return {
        "status": 200,
        "name": name,
    }


routers = api_discover()
for router in routers:
    app.include_router(router)
