FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=project_recruitment.settings
ENV PORT=8000

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD gunicorn project_recruitment.wsgi:application --bind 0.0.0.0:$PORT