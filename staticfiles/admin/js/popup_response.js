'use strict';
{
    // Retrieve data from the element and parse it safely
    const popupResponseElement = document.getElementById('django-admin-popup-response-constants');
    if (popupResponseElement && popupResponseElement.dataset.popupResponse) {
        try {
            const initData = JSON.parse(popupResponseElement.dataset.popupResponse);

            // Check for the action and call the appropriate opener method
            switch (initData.action) {
                case 'change':
                    if (typeof opener.dismissChangeRelatedObjectPopup === 'function') {
                        opener.dismissChangeRelatedObjectPopup(window, initData.value, initData.obj, initData.new_value);
                    }
                    break;

                case 'delete':
                    if (typeof opener.dismissDeleteRelatedObjectPopup === 'function') {
                        opener.dismissDeleteRelatedObjectPopup(window, initData.value);
                    }
                    break;

                default:
                    if (typeof opener.dismissAddRelatedObjectPopup === 'function') {
                        opener.dismissAddRelatedObjectPopup(window, initData.value, initData.obj);
                    }
                    break;
            }
        } catch (error) {
            console.error('Error parsing the popup response data:', error);
        }
    } else {
        console.warn('Popup response data is missing or invalid.');
    }
}
