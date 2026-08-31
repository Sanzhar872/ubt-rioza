import os

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app import models
from app.database import Base, engine, get_db
from app.schemas import QuestionOut, SubjectOut, TopicOut

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ENT Prep API")

frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/subjects", response_model=list[SubjectOut])
def list_subjects(db: Session = Depends(get_db)):
    return db.query(models.Subject).all()


@app.get("/api/subjects/{slug}/topics", response_model=list[TopicOut])
def list_topics(slug: str, db: Session = Depends(get_db)):
    subject = db.query(models.Subject).filter(models.Subject.slug == slug).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject.topics


@app.get("/api/topics/{topic_id}", response_model=TopicOut)
def get_topic(topic_id: int, db: Session = Depends(get_db)):
    topic = db.query(models.Topic).filter(models.Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic


@app.get("/api/topics/{topic_id}/questions", response_model=list[QuestionOut])
def list_questions(topic_id: int, db: Session = Depends(get_db)):
    topic = db.query(models.Topic).filter(models.Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic.questions
