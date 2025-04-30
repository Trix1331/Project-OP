'use strict';
{
    const $ = django.jQuery;

    // Safely retrieve the 'prepopulatedFields' data, ensuring it exists
    const fieldsDataElement = document.getElementById('django-admin-prepopulated-fields-constants');
    if (fieldsDataElement && fieldsDataElement.dataset.prepopulatedFields) {
        try {
            const fields = JSON.parse(fieldsDataElement.dataset.prepopulatedFields);

            // Iterate over each prepopulated field and apply the necessary changes
            fields.forEach(field => {
                // Add the 'prepopulated_field' class to matching field elements
                $(
                    `.empty-form .form-row .field-${field.name}, 
                    .empty-form.form-row .field-${field.name}, 
                    .empty-form .form-row.field-${field.name}`
                ).addClass('prepopulated_field');

                // Safely add data attributes and apply prepopulate function
                const fieldElement = $(field.id);
                if (fieldElement.length) {
                    fieldElement.data('dependency_list', field.dependency_list);
                    fieldElement.prepopulate(field.dependency_ids, field.maxLength, field.allowUnicode);
                }
            });
        } catch (error) {
            console.error('Error parsing prepopulated fields data:', error);
        }
    } else {
        console.warn('Prepopulated fields data is missing or invalid.');
    }
}
