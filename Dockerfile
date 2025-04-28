FROM python:3.10-slim

WORKDIR /app

# Встановлюємо залежності PostgreSQL
RUN apt-get update && apt-get install -y \
    postgresql-client \
    libpq-dev \
    gcc \
    python3-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копіюємо всі файли проекту в контейнер
COPY . .

ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Збираємо статичні файли
RUN python manage.py collectstatic --noinput

EXPOSE $PORT

CMD gunicorn project_recruitment.wsgi:application --bind 0.0.0.0:$PORT