from fastapi import Depends, FastAPI, HTTPException
from fastapi_another_jwt_auth import AuthJWT
from fastapi_another_jwt_auth.exceptions import AuthJWTException
from passlib.context import CryptContext
from sqlmodel import or_, select
from sqlmodel.ext.asyncio.session import AsyncSession
from starlette.requests import Request
from starlette.responses import JSONResponse

from shared.database import get_session
from shared.models.request.user import UserLoginRequest
from shared.models.user import UserModel

from .settings import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
app = FastAPI()


@AuthJWT.load_config
def get_config():
    return settings


@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException):
    return JSONResponse(status_code=exc.status_code,
                        content={"detail": exc.message})


@app.post("/login")
async def login(user: UserLoginRequest, Authorize: AuthJWT = Depends(), session: AsyncSession = Depends(get_session)):
    """
    Login using username and hash_password.
    Setting up JWT cookie if login was successful.
    """
    result = await session.execute(
        select(
            UserModel,
        ).where(or_(
            UserModel.email == user.enter_data,
            UserModel.name == user.enter_data,
        ))
    )
    db_user = result.scalar_one_or_none()

    if not db_user or not db_user.verify_password(user.password):
        raise HTTPException(status_code=401, detail="Incorrect email|login or password")

    access_token = Authorize.create_access_token(subject=db_user.name)
    refresh_token = Authorize.create_refresh_token(subject=db_user.name)

    # Set the JWT and CSRF double submit cookies in the response
    Authorize.set_access_cookies(access_token)
    Authorize.set_refresh_cookies(refresh_token)
    return {"status": 200}


@app.post("/token/refresh")
def refresh(Authorize: AuthJWT = Depends()):
    """Token refreshing."""

    Authorize.jwt_refresh_token_required()
    current_user = Authorize.get_jwt_subject()
    new_access_token = Authorize.create_access_token(subject=current_user)

    # Set the JWT and CSRF double submit cookies in the response
    Authorize.set_access_cookies(new_access_token)
    return {"status": 200}


@app.delete("/logout")
def logout(Authorize: AuthJWT = Depends()):
    """
    Because the JWT are stored in a httponly cookie now, we cannot
    log the user out by simply deleting the cookie in the frontend.
    We need the backend to send us a response to delete the cookies.
    """

    Authorize.jwt_required()
    Authorize.unset_jwt_cookies()
    return {"status": 200}


@app.get("/me")
def hello(Authorize: AuthJWT = Depends()):
    """Get user info."""

    Authorize.jwt_required()
    current_user = Authorize.get_jwt_subject()

    return {"user_data": current_user}
