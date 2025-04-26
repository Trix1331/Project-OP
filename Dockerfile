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

COPY . .

ENV PYTHONUNBUFFERED=1
ENV PORT=8000

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD gunicorn project_recruitment.wsgi:application --bind 0.0.0.0:$PORT