# ----------------------------------------------#
#  module: FastAPI                              #
# ----------------------------------------------#

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Body, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from ai_chat.core import settings as cfg
from ai_chat.core.logging_cfg import setup_logging
from ai_chat.db.db_helper import Base, engine, get_user_requests, add_request_data
from ai_chat.services.gemini.gemini_client import get_answer

setup_logging()  # Setting the logging configuration


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(engine)
    logging.info("✅ Database tables created successfully")
    yield


app = FastAPI(title="AI Chat API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cfg.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok"}


@app.get("/get_user_requests")
def get_requests(
        request: Request
):
    user_ip_address = request.client.host
    user_requests = get_user_requests(ip_address=user_ip_address)
    return user_requests


@app.get("/health_gemini")
def health_gemini():
    """
    Поверяет, что есть связь с Gemini.
    """
    try:
        _ = get_answer("ping")
        return {"status": "ok"}
    except Exception as e:
        logging.exception(f"❌ Gemini healthcheck failed: {e}")
        raise HTTPException(status_code=503, detail=str(e))


@app.post("/get_answer")
def generate_answer(
        request: Request,
        prompt: str = Body(embed=True)
):
    try:
        user_ip_address = request.client.host
        answer = get_answer(prompt)
        add_request_data(ip_address=user_ip_address, prompt=prompt, response=answer)
        return {"answer": answer}
    except Exception as e:
        logging.exception(f"❌ Error in /get_answer endpoint:\n{e}")
        raise HTTPException(status_code=500, detail=str(e))
