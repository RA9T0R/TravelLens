import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# --- HYBRID ENVIRONMENT LOADING ---
URL_DATABASE = os.getenv("DATABASE_URL")

if not URL_DATABASE:
    try:
        from dotenv import load_dotenv
        load_dotenv()
        URL_DATABASE = os.getenv("DATABASE_URL")
        print("INFO: Loaded environment variables from .env file (Local Mode).")
    except ImportError:
        pass

if not URL_DATABASE:
    raise ValueError(
        "DATABASE_URL environment variable is not set. "
        "Check Render settings OR ensure .env file is present locally."
    )

engine = create_engine(URL_DATABASE)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()