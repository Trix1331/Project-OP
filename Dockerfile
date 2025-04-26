# Використовуємо базовий образ Python
FROM python:3.9

# Створюємо робочу директорію
WORKDIR /app

# Копіюємо файл вимог для встановлення залежностей
COPY requirements.txt .

# Встановлюємо всі залежності
RUN pip install --no-cache-dir -r requirements.txt

# Копіюємо весь код проєкту в контейнер
COPY . .

# Виставляємо порт 8000 (де зазвичай працює Django)
EXPOSE 8000

# Запускаємо сервер
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
