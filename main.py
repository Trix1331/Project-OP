import json
import folium

# Зчитування даних з файлу (заміни 'addresses.json' на свій файл)
with open("addresses.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Створюємо карту з початковим центром на Україні
map_center = [49.0, 31.0]
m = folium.Map(location=map_center, zoom_start=6)

# Додаємо маркери
for entry in data:
    address = entry["address"]
    lat = entry["point"]["latitude"]
    lon = entry["point"]["longitude"]
    folium.Marker(
        location=[lat, lon],
        popup=address,
        tooltip=address,
        icon=folium.Icon(color="blue", icon="info-sign")
    ).add_to(m)

# Збереження в HTML-файл
m.save("ukraine_addresses_map.html")
print("Карту збережено у файл ukraine_addresses_map.html")
