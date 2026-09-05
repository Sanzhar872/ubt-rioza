"""One-off helper: insert a topic at a given position, shifting later topics down.

Usage:
    python -m app.insert_topic <subject_slug> <after_order_index> <title> <youtube_id>

Example:
    python -m app.insert_topic kaz-tarih 22 "АЛТЫН ОРДА, АҚ ОРДА ТАРИХЫ" LdrDiWivRmA
"""

import sys

from app import models
from app.database import SessionLocal


def insert_topic(subject_slug: str, after_order_index: int, title: str, youtube_id: str) -> None:
    db = SessionLocal()
    try:
        subject = db.query(models.Subject).filter(models.Subject.slug == subject_slug).first()
        if not subject:
            raise SystemExit(f"Subject not found: {subject_slug!r}")

        new_order_index = after_order_index + 1

        existing = (
            db.query(models.Topic)
            .filter(models.Topic.subject_id == subject.id, models.Topic.youtube_id == youtube_id)
            .first()
        )
        if existing:
            raise SystemExit(f"Topic with youtube_id {youtube_id!r} already exists (id={existing.id}).")

        topics = (
            db.query(models.Topic)
            .filter(models.Topic.subject_id == subject.id, models.Topic.order_index >= new_order_index)
            .order_by(models.Topic.order_index.desc())
            .all()
        )
        for t in topics:
            t.order_index += 1
        db.flush()

        new_topic = models.Topic(
            subject_id=subject.id, title=title, youtube_id=youtube_id, order_index=new_order_index
        )
        db.add(new_topic)
        db.commit()
        print(f"Inserted topic #{new_topic.id} ({title}) at order_index {new_order_index}.")
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) != 5:
        raise SystemExit(
            "Usage: python -m app.insert_topic <subject_slug> <after_order_index> <title> <youtube_id>"
        )
    insert_topic(sys.argv[1], int(sys.argv[2]), sys.argv[3], sys.argv[4])
