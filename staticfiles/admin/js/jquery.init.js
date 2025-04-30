/*global jQuery:false*/
'use strict';

/* Puts the included jQuery into our own namespace using noConflict and passing
 * it 'true'. This ensures that the included jQuery doesn't pollute the global
 * namespace (i.e. this preserves pre-existing values for both window.$ and
 * window.jQuery).
 */
window.django = {
    jQuery: jQuery.noConflict(true)
};

// Now you can use django.jQuery in place of global `$` and `jQuery`
