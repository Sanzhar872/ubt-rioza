# ҰБТ дайындық сайты (ubt-rioza)

Сайт подготовки к ЕНТ по двум предметам: Қазақстан тарихы и Оқу сауаттылығы.

## Стек

- **Frontend:** React + TypeScript (Vite)
- **Backend:** FastAPI (Python)
- **БД:** PostgreSQL (SQLAlchemy ORM)

## Возможности (Қазақстан тарихы)

- Список тем ЕНТ, сгруппированных по историческим эпохам
- Страница темы: видео с YouTube + тест на закрепление (10 вопросов)
- Таймлайн (в разработке)
- Интерактивная карта Казахстана с слайдером по историческим периодам

## Запуск локально

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Скопируйте `.env.example` в `.env` и укажите строку подключения к вашей PostgreSQL:

```
DATABASE_URL=postgresql+psycopg2://postgres:PASSWORD@localhost:5433/qaz_tarih
FRONTEND_ORIGIN=http://localhost:5173
```

Засейте базу начальными темами:

```bash
.venv\Scripts\python.exe -m app.seed
.venv\Scripts\python.exe -m app.import_questions app/data/questions/*.json
```

Запустите сервер:

```bash
.venv\Scripts\python.exe -m uvicorn app.main:app --port 8000 --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Откройте [http://localhost:5173](http://localhost:5173).

## Структура

```
backend/
  app/
    main.py            # FastAPI-приложение и эндпоинты
    models.py           # SQLAlchemy-модели (Subject, Topic, Question)
    seed.py              # Начальные темы и видео
    import_questions.py  # Импорт вопросов теста из JSON
    data/questions/      # JSON-файлы с вопросами по темам
frontend/
  src/
    pages/               # Страницы (список тем, видео+тест, карта, таймлайн)
    data/mapPeriods.ts    # Данные для интерактивной карты по периодам
    api.ts               # Клиент для backend API
```
