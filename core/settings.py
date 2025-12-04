# ----------------------------------------------#
#  Module: Global Settings                      #
# ----------------------------------------------#
import os
from pathlib import Path

from dotenv import load_dotenv

################  [Another constants and variables] ##############
BASE_DIR = Path(__file__).resolve().parent.parent  # {project_dir}/ai_chat

ENV_PATH = BASE_DIR / ".env"
load_dotenv(dotenv_path=ENV_PATH, override=True)

LOG_DIR = BASE_DIR / "logs"

DB_DIR = BASE_DIR / "db"
DB_DIR.mkdir(exist_ok=True)
DB_PATH = DB_DIR / "ai_chat.db"

DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "yes")
#########################################################################

##########################  [AI settings] ##########################
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
####################################################################

#######################  [FAST API settings] ####################
ALLOWED_ORIGINS = os.getenv(  # CORS: allowed domains from which the front can access the back
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000"
).split(",")

ALLOWED_ORIGINS = [o.strip().rstrip("/") for o in ALLOWED_ORIGINS if o.strip()]
#################################################################
