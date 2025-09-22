from contextlib import suppress

from fastapi import Depends, FastAPI, HTTPException, Response
from starlette.requests import Request
from starlette.responses import JSONResponse

import bcrypt
from fastapi_another_jwt_auth import AuthJWT
from fastapi_another_jwt_auth.exceptions import AuthJWTException
from pydantic import BaseModel

from auth.settings import settings

app = FastAPI()


class User(BaseModel):  # todo: test. make as full model
    login: str
    password: str


@AuthJWT.load_config
def get_config():
    return settings


@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})


@app.post("/login")
def login(user: User, Authorize: AuthJWT = Depends()):
    admin_pass_bytes = settings.admin_password.encode("utf-8")
    user_pass_bytes = user.password.encode("utf-8")
    admin_password_hash = bcrypt.hashpw(admin_pass_bytes, bcrypt.gensalt())

    is_valid_login = user.login == settings.admin_login
    is_valid_password = bcrypt.checkpw(user_pass_bytes, admin_password_hash)

    if not is_valid_login or not is_valid_password:
        raise HTTPException(
            status_code=401,
            detail="Incorrect login or password"
        )

    access_token = Authorize.create_access_token(subject=user.login)
    refresh_token = Authorize.create_refresh_token(subject=user.login)

    Authorize.set_access_cookies(access_token)
    Authorize.set_refresh_cookies(refresh_token)

    return {"status": "OK"}


@app.post("/token/refresh")
def refresh(Authorize: AuthJWT = Depends()):
    Authorize.jwt_refresh_token_required()
    current_user = Authorize.get_jwt_subject()
    new_access_token = Authorize.create_access_token(subject=current_user)
    Authorize.set_access_cookies(new_access_token)
    return {"status": "OK"}


@app.delete("/logout")
def logout(Authorize: AuthJWT = Depends(), response: Response = None):
    with suppress(Exception):
        Authorize.jwt_required()
    Authorize.unset_jwt_cookies(response=response)
    return {"status": "OK"}


@app.get("/hello")
def hello(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    current_user = Authorize.get_jwt_subject()
    return {"message": f"Hi, {current_user}"}
