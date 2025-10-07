from fastapi import Depends, FastAPI, HTTPException
from starlette.requests import Request
from starlette.responses import JSONResponse
import bcrypt
from fastapi_another_jwt_auth import AuthJWT
from fastapi_another_jwt_auth.exceptions import AuthJWTException
from .settings import settings
from shared.models.user import UserLoginRequest


app = FastAPI()


@AuthJWT.load_config
def get_config():
    return settings


@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})


@app.post("/login")
def login(user: UserLoginRequest, Authorize: AuthJWT = Depends()):
    """
    Login using username and password.
    Setting up JWT cookie if login was successful.
    """

    admin_pass_bytes = settings.admin_password.encode("utf-8")
    pass_salt = bcrypt.gensalt()
    admin_password_hash = bcrypt.hashpw(admin_pass_bytes, pass_salt)

    user_pass_bytes = user.password.encode("utf-8")
    user_password_hash = bcrypt.hashpw(user_pass_bytes, pass_salt)

    if user.login != settings.admin_login or user_password_hash != admin_password_hash:
        raise HTTPException(status_code=401, detail="Incorrect login or password")

    access_token = Authorize.create_access_token(subject=user.login)
    refresh_token = Authorize.create_refresh_token(subject=user.login)

    # Set the JWT and CSRF double submit cookies in the response
    Authorize.set_access_cookies(access_token)
    Authorize.set_refresh_cookies(refresh_token)
    return {"status": "OK"}


@app.post("/token/refresh")
def refresh(Authorize: AuthJWT = Depends()):
    """Token refreshing."""

    Authorize.jwt_refresh_token_required()
    current_user = Authorize.get_jwt_subject()
    new_access_token = Authorize.create_access_token(subject=current_user)

    # Set the JWT and CSRF double submit cookies in the response
    Authorize.set_access_cookies(new_access_token)
    return {"status": "OK"}


@app.delete("/logout")
def logout(Authorize: AuthJWT = Depends()):
    """
    Because the JWT are stored in a httponly cookie now, we cannot
    log the user out by simply deleting the cookie in the frontend.
    We need the backend to send us a response to delete the cookies.
    """

    Authorize.jwt_required()
    Authorize.unset_jwt_cookies()
    return {"status": "OK"}


@app.get("/me")
def hello(Authorize: AuthJWT = Depends()):
    """Get user info."""

    Authorize.jwt_required()
    current_user = Authorize.get_jwt_subject()

    return {"username": current_user}
