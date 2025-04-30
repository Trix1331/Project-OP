'use strict';

{
    // Ініціалізація фільтрів
    let filters = JSON.parse(sessionStorage.getItem('django.admin.filtersState')) || {};

    // Встановлюємо стан фільтрів на основі збережених даних
    Object.entries(filters).forEach(([key, value]) => {
        const detailElement = document.querySelector(`[data-filter-title='${CSS.escape(key)}']`);

        // Перевірка, чи існує елемент, і встановлення атрибута відкриття або закриття
        if (detailElement) {
            if (value) {
                detailElement.setAttribute('open', '');
            } else {
                detailElement.removeAttribute('open');
            }
        }
    });

    // Збереження стану фільтра при зміні
    document.querySelectorAll('details').forEach(detail => {
        detail.addEventListener('toggle', event => {
            const filterTitle = event.target.dataset.filterTitle;
            filters[filterTitle] = detail.open;
            sessionStorage.setItem('django.admin.filtersState', JSON.stringify(filters));
        });
    });
}
