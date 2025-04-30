'use strict';
{
    // Список елементів, з якими можна працювати
    const inputTags = ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];

    // Отримуємо modelName з dataset
    const modelName = document.getElementById('django-admin-form-add-constants')?.dataset.modelName;

    // Перевірка на наявність modelName
    if (modelName) {
        const form = document.getElementById(modelName + '_form');

        // Якщо форма існує
        if (form) {
            // Перебираємо елементи форми
            for (const element of form.elements) {
                // Перевірка, чи є елемент в списку inputTags, чи не є він disabled та чи відображається елемент
                if (inputTags.includes(element.tagName) && !element.disabled && element.offsetParent) {
                    element.focus(); // Фокусуємо перший доступний елемент
                    break;
                }
            }
        }
    }
}
