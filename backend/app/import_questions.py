import glob
import json
import sys
from pathlib import Path

from app import models
from app.database import Base, SessionLocal, engine

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


def import_file(path: Path) -> None:
    data = json.loads(path.read_text(encoding="utf-8"))
    topic_ref = data.get("topic_id", data.get("topic"))

    db = SessionLocal()
    try:
        query = db.query(models.Topic)
        if isinstance(topic_ref, int):
            topic = query.filter(models.Topic.id == topic_ref).first()
        else:
            topic = query.filter(models.Topic.title.ilike(str(topic_ref).strip())).first()

        if not topic:
            raise SystemExit(f"{path.name}: topic not found for reference {topic_ref!r}")

        db.query(models.Question).filter(models.Question.topic_id == topic.id).delete()

        questions = data["questions"]
        for i, q in enumerate(questions):
            db.add(
                models.Question(
                    topic_id=topic.id,
                    order_index=i,
                    question=q["question"],
                    options=q["options"],
                    correct_index=q["correct_index"],
                    explanation=q.get("explanation"),
                )
            )
        db.commit()
        print(f"{path.name}: imported {len(questions)} questions into topic #{topic.id} ({topic.title}).")
    finally:
        db.close()


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    if len(sys.argv) < 2:
        raise SystemExit("Usage: python -m app.import_questions <file1.json> [file2.json ...]")
    for arg in sys.argv[1:]:
        matches = glob.glob(arg)
        if not matches:
            print(f"No files matched: {arg}")
            continue
        for match in matches:
            import_file(Path(match))
