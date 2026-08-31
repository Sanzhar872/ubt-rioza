from app import models
from app.database import Base, SessionLocal, engine

SUBJECTS = [
    {"slug": "kaz-tarih", "title": "Қазақстан тарихы"},
    {"slug": "oku-sauattylygy", "title": "Оқу сауаттылығы"},
]

KAZ_TARIH_TOPICS = [
    {"title": "ТАС ДӘУІРІ", "youtube_id": "wHOcT6is1us", "order_index": 1},
    {"title": "МЕЗОЛИТ", "youtube_id": "nWrNzAJ5vJ0", "order_index": 2},
    {"title": "АЛҒАШҚЫ СЕНІМДЕР", "youtube_id": "atbjANfqEWg", "order_index": 3},
    {"title": "ЕРТЕ ТЕМІР ДӘУІРІНДЕГІ ҚАЗАҚСТАН", "youtube_id": "hEu-g3PCe5s", "order_index": 4},
    {"title": "САҚТАР", "youtube_id": "VlgJ4ZOfqR4", "order_index": 5},
    {"title": "САРМАТТАР", "youtube_id": "5vL204A_tY0", "order_index": 6},
    {"title": "ҒҰНДАР", "youtube_id": "-K0F-1NHLck", "order_index": 7},
    {"title": "ҮЙСІНДЕР", "youtube_id": "TAJtrRsL8sA", "order_index": 8},
    {"title": "ҚАҢЛЫЛАР", "youtube_id": "Nxw5JwiOtcY", "order_index": 9},
    {"title": "ТҮРІК ҚАҒАНАТЫ", "youtube_id": "Uqw1Nb2ogj0", "order_index": 10},
    {"title": "БАТЫС ТҮРІК ҚАҒАНАТЫ", "youtube_id": "EkWljdINiLk", "order_index": 11},
    {"title": "ТҮРГЕШТЕР", "youtube_id": "CXZSwEWaTDI", "order_index": 12},
    {"title": "ҚАРЛҰҚТАР", "youtube_id": "xPZA7VSRXS4", "order_index": 13},
    {"title": "ОҒЫЗДАР", "youtube_id": "OTGDVa489VA", "order_index": 14},
    {"title": "ҚИМАҚТАР", "youtube_id": "-Wd_jT6JuBw", "order_index": 15},
    {"title": "ҚАРАХАН", "youtube_id": "unuDc5DtnTg", "order_index": 16},
    {"title": "ҚЫПШАҚ", "youtube_id": "yaM_BWwP7X0", "order_index": 17},
    {"title": "ҚАРА-ҚЫТАЙ", "youtube_id": "0efZRD-Gi8k", "order_index": 18},
    {"title": "НАЙМАНДАР", "youtube_id": "AZxmnVCmUZg", "order_index": 19},
    {"title": "КЕРЕЙТ ЖАЛАЙЫРЛАР", "youtube_id": "O532PfqZaoM", "order_index": 20},
    {"title": "МОҢҒОЛ ШАПҚЫНШЫЛЫҒЫ", "youtube_id": "CZiezvvjoVI", "order_index": 21},
    {"title": "АЛТЫН ОРДА", "youtube_id": "WrECpTXfLkk", "order_index": 22},
    {"title": "АҚ ОРДА", "youtube_id": "TKXNjIvyts4", "order_index": 23},
    {"title": "МОҒОЛСТАН", "youtube_id": "IgTzk0C9Rjk", "order_index": 24},
    {"title": "ӘМІР ТЕМІР", "youtube_id": "96vDqzngNig", "order_index": 25},
    {"title": "НОҒАЙ ОРДАСЫ", "youtube_id": "K8JMJ5vJT1g", "order_index": 26},
    {"title": "СІБІР ХАНДЫҒЫ", "youtube_id": "rGN3E-cPYP0", "order_index": 27},
    {"title": "ӘБІЛХАЙЫР ХАНДЫҒЫ", "youtube_id": "6ev3ApVqXhM", "order_index": 28},
    {"title": "ҚАЗАҚ ХАНДЫҒЫ", "youtube_id": "bjjjdyVbWf8", "order_index": 29},
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        subject_by_slug = {}
        for data in SUBJECTS:
            subject = db.query(models.Subject).filter(models.Subject.slug == data["slug"]).first()
            if not subject:
                subject = models.Subject(**data)
                db.add(subject)
                db.flush()
            subject_by_slug[data["slug"]] = subject

        kaz_tarih = subject_by_slug["kaz-tarih"]
        for data in KAZ_TARIH_TOPICS:
            exists = (
                db.query(models.Topic)
                .filter(models.Topic.subject_id == kaz_tarih.id, models.Topic.youtube_id == data["youtube_id"])
                .first()
            )
            if not exists:
                db.add(models.Topic(subject_id=kaz_tarih.id, **data))

        db.commit()
        print("Seed complete.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
