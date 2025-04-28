# Використовуємо офіційний Python образ
FROM python:3.10-slim

# Встановлюємо робочу директорію
WORKDIR /app

# Встановлюємо залежності PostgreSQL та інші необхідні пакети
RUN apt-get update && apt-get install -y \
    postgresql-client \
    libpq-dev \
    gcc \
    python3-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Копіюємо файл requirements.txt
COPY requirements.txt .

# Встановлюємо залежності
RUN pip install --no-cache-dir -r requirements.txt

# Копіюємо решту файлів проекту
COPY . .

# Задаємо змінну середовища для Python
ENV PYTHONUNBUFFERED=1

# Збираємо статичні файли
RUN python project_recruitment/manage.py collectstatic --noinput

# Відкриваємо порт для серверу
EXPOSE 8000

# Запускаємо gunicorn для запуску Django
CMD ["gunicorn", "project_recruitment.wsgi:application", "--bind", "0.0.0.0:$PORT", "--timeout", "120"]
