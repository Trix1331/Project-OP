'use strict';
{
    const $ = django.jQuery;

    $.fn.djangoAdminSelect2 = function() {
        $.each(this, function(i, element) {
            $(element).select2({
                ajax: {
                    data: (params) => {
                        return {
                            term: params.term,
                            page: params.page,
                            app_label: element.dataset.appLabel,
                            model_name: element.dataset.modelName,
                            field_name: element.dataset.fieldName
                        };
                    }
                },
                // Покращення роботи Select2 на мобільних пристроях
                dropdownAutoWidth: true,
                width: '100%',
                minimumResultsForSearch: 10 // Ліміт для пошуку
            });
        });
        return this;
    };

    $(function() {
        // Ініціалізуємо всі autocomplete віджети, окрім того, який використовується для нових форм
        // в шаблоні, коли додається новий formset.
        $('.admin-autocomplete').not('[name*=__prefix__]').djangoAdminSelect2();
    });

    document.addEventListener('formset:added', (event) => {
        // Ініціалізація autocomplete для нових елементів форми
        $(event.target).find('.admin-autocomplete').djangoAdminSelect2();
    });

    // Додатково, додаємо обробку подій touch для мобільних пристроїв
    if ('ontouchstart' in window) {
        // Підтримка мобільних пристроїв: додатково можна настроїти вибір через touch
        $(document).on('touchstart', '.select2-container', function() {
            $(this).find('.select2-selection').trigger('click');
        });
    }
}
