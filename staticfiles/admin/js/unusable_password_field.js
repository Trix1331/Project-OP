"use strict";
// Fallback JS for browsers which do not support :has selector used in
// admin/css/unusable_password_fields.css
// Remove file once all supported browsers support :has selector
try {
    // If browser does not support :has selector this will raise an error
    document.querySelector("form:has(input)");
} catch (error) {
    console.log("Defaulting to javascript for usable password form management: " + error);
    // JS replacement for unsupported :has selector
    document.querySelectorAll('input[name="usable_password"]').forEach(option => {
        option.addEventListener('change', function() {
            const usablePassword = (this.value === "true" ? this.checked : !this.checked);
            const submit1 = document.querySelector('input[type="submit"].set-password');
            const submit2 = document.querySelector('input[type="submit"].unset-password');
            const messages = document.querySelector('#id_unusable_warning');
            const passwordRow1 = document.getElementById('id_password1').closest('.form-row');
            const passwordRow2 = document.getElementById('id_password2').closest('.form-row');

            // Задаємо видимість для полів паролю
            passwordRow1.hidden = !usablePassword;
            passwordRow2.hidden = !usablePassword;

            // Якщо є повідомлення про неприпустимий пароль, його теж потрібно ховати
            if (messages) {
                messages.hidden = usablePassword;
            }

            // Відображаємо/ховаємо кнопки в залежності від наявності пароля
            if (submit1 && submit2) {
                submit1.hidden = !usablePassword;
                submit2.hidden = usablePassword;
            }

            // Додаткові стилі для мобільних пристроїв
            if (usablePassword) {
                passwordRow1.style.padding = '10px';
                passwordRow2.style.padding = '10px';
            } else {
                passwordRow1.style.padding = '0';
                passwordRow2.style.padding = '0';
            }
        });

        // Ініціалізація початкового стану
        option.dispatchEvent(new Event('change'));
    });
}
