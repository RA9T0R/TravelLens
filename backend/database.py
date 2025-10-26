import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# --- HYBRID ENVIRONMENT LOADING ---

# 1. Check if DATABASE_URL is already set (e.g., by Render)
URL_DATABASE = os.getenv("DATABASE_URL")

# 2. If it's NOT set, assume we are in a local environment and try to load .env
if not URL_DATABASE:
    try:
        from dotenv import load_dotenv
        load_dotenv()
        URL_DATABASE = os.getenv("DATABASE_URL")
        print("INFO: Loaded environment variables from .env file (Local Mode).")
    except ImportError:
        # If dotenv isn't installed (or not available), we just fail gracefully
        pass

# 3. Final check and connection setup
if not URL_DATABASE:
    raise ValueError(
        "DATABASE_URL environment variable is not set. "
        "Check Render settings OR ensure .env file is present locally."
    )

engine = create_engine(URL_DATABASE)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()