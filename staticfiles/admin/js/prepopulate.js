'use strict';
{
    const $ = django.jQuery;

    // Extend the jQuery prototype with prepopulate method
    $.fn.prepopulate = function(dependencies, maxLength, allowUnicode) {
        /*
            Depends on urlify.js
            Populates a selected field with the values of the dependent fields,
            URLifies and shortens the string.
            dependencies - array of dependent fields ids
            maxLength - maximum length of the URLified string
            allowUnicode - Unicode support of the URLified string
        */
        return this.each(function() {
            const prepopulatedField = $(this);

            const populate = function() {
                // Bail out if the field's value has been modified by the user
                if (prepopulatedField.data('_changed')) {
                    return;
                }

                const values = [];
                dependencies.forEach(function(field) {
                    const fieldElement = $(field);
                    if (fieldElement.val().length > 0) {
                        values.push(fieldElement.val());
                    }
                });

                // Perform URLify and set the value of the prepopulated field
                prepopulatedField.val(URLify(values.join(' '), maxLength, allowUnicode));
            };

            // Mark the field as not changed initially
            prepopulatedField.data('_changed', false);

            // Track changes in the field
            prepopulatedField.on('change', function() {
                prepopulatedField.data('_changed', true);
            });

            // Only bind the event handlers if the prepopulated field is empty
            if (!prepopulatedField.val()) {
                $(dependencies.join(',')).on('keyup change focus', populate);
            }
        });
    };
}
