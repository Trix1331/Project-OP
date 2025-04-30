'use strict';
{
    // Call function fn when the DOM is loaded and ready. If it is already
    // loaded, call the function now.
    // http://youmightnotneedjquery.com/#ready
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(function() {
        function handleClick(event) {
            event.preventDefault();
            const params = new URLSearchParams(window.location.search);

            // Check if _popup exists in the query parameters
            if (params.has('_popup')) {
                window.close(); // Close the popup.
            } else {
                window.history.back(); // Otherwise, go back to the previous page.
            }
        }

        // Add event listener to all elements with the class 'cancel-link'
        document.querySelectorAll('.cancel-link').forEach(function(el) {
            el.addEventListener('click', handleClick);
        });
    });
    
    // Optional: Improve mobile experience with touch events (if needed)
    document.querySelectorAll('.cancel-link').forEach(function(el) {
        el.addEventListener('touchstart', function(event) {
            handleClick(event); // Trigger the same functionality on touchstart
        });
    });
}
