from fastapi import FastAPI

app = FastAPI()


@app.post("/hello")
def getUser(name: str):
    return {
        "status": "200",
        "name": name,
    }
