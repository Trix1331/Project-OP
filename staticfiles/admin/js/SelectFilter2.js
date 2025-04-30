/*global SelectBox, gettext, ngettext, interpolate, quickElement, SelectFilter*/
/*
SelectFilter2 - Turns a multiple-select box into a filter interface.

Requires core.js and SelectBox.js.
*/
'use strict';

{
    window.SelectFilter = {
        init: function(field_id, field_name, is_stacked) {
            if (field_id.match(/__prefix__/)) {
                // Don't initialize on empty forms.
                return;
            }
            const from_box = document.getElementById(field_id);
            from_box.id += '_from'; // change its ID
            from_box.className = 'filtered';
            from_box.setAttribute('aria-labelledby', field_id + '_from_title');

            // Remove <p class="info">, because it just gets in the way.
            Array.from(from_box.parentNode.getElementsByTagName('p')).forEach(p => {
                if (p.classList.contains("info")) {
                    from_box.parentNode.removeChild(p);
                } else if (p.classList.contains("help")) {
                    // Move help text up to the top so it isn't below the select
                    from_box.parentNode.insertBefore(p, from_box.parentNode.firstChild);
                }
            });

            // Create selector container
            const selector_div = quickElement('div', from_box.parentNode);
            selector_div.className = is_stacked ? 'selector stacked' : 'selector';
            from_box.parentNode.prepend(selector_div);

            // Create selector available container
            const selector_available = quickElement('div', selector_div);
            selector_available.className = 'selector-available';
            const selector_available_title = quickElement('div', selector_available);
            selector_available_title.id = field_id + '_from_title';
            selector_available_title.className = 'selector-available-title';
            quickElement('label', selector_available_title, interpolate(gettext('Available %s') + ' ', [field_name]), 'for', field_id + '_from');
            quickElement(
                'p',
                selector_available_title,
                interpolate(gettext('Choose %s by selecting them and then select the "Choose" arrow button.'), [field_name]),
                'class', 'helptext'
            );

            const filter_p = quickElement('p', selector_available, '', 'id', field_id + '_filter');
            filter_p.className = 'selector-filter';

            const search_filter_label = quickElement('label', filter_p, '', 'for', field_id + '_input');

            quickElement(
                'span', search_filter_label, '',
                'class', 'help-tooltip search-label-icon',
                'aria-label', interpolate(gettext("Type into this box to filter down the list of available %s."), [field_name])
            );

            filter_p.appendChild(document.createTextNode(' '));

            const filter_input = quickElement('input', filter_p, '', 'type', 'text', 'placeholder', gettext("Filter"));
            filter_input.id = field_id + '_input';

            selector_available.appendChild(from_box);
            const choose_all = quickElement(
                'button',
                selector_available,
                interpolate(gettext('Choose all %s'), [field_name]),
                'id', field_id + '_add_all',
                'class', 'selector-chooseall'
            );

            // Create selector chooser container
            const selector_chooser = quickElement('ul', selector_div);
            selector_chooser.className = 'selector-chooser';
            const add_button = quickElement(
                'button',
                quickElement('li', selector_chooser),
                interpolate(gettext('Choose selected %s'), [field_name]),
                'id', field_id + '_add',
                'class', 'selector-add'
            );
            const remove_button = quickElement(
                'button',
                quickElement('li', selector_chooser),
                interpolate(gettext('Remove selected %s'), [field_name]),
                'id', field_id + '_remove',
                'class', 'selector-remove'
            );

            // Create selector chosen container
            const selector_chosen = quickElement('div', selector_div, '', 'id', field_id + '_selector_chosen');
            selector_chosen.className = 'selector-chosen';
            const selector_chosen_title = quickElement('div', selector_chosen);
            selector_chosen_title.className = 'selector-chosen-title';
            selector_chosen_title.id = field_id + '_to_title';
            quickElement('label', selector_chosen_title, interpolate(gettext('Chosen %s') + ' ', [field_name]), 'for', field_id + '_to');
            quickElement(
                'p',
                selector_chosen_title,
                interpolate(gettext('Remove %s by selecting them and then select the "Remove" arrow button.'), [field_name]),
                'class', 'helptext'
            );

            const filter_selected_p = quickElement('p', selector_chosen, '', 'id', field_id + '_filter_selected');
            filter_selected_p.className = 'selector-filter';

            const search_filter_selected_label = quickElement('label', filter_selected_p, '', 'for', field_id + '_selected_input');

            quickElement(
                'span', search_filter_selected_label, '',
                'class', 'help-tooltip search-label-icon',
                'aria-label', interpolate(gettext("Type into this box to filter down the list of selected %s."), [field_name])
            );

            filter_selected_p.appendChild(document.createTextNode(' '));

            const filter_selected_input = quickElement('input', filter_selected_p, '', 'type', 'text', 'placeholder', gettext("Filter"));
            filter_selected_input.id = field_id + '_selected_input';

            quickElement(
                'select',
                selector_chosen,
                '',
                'id', field_id + '_to',
                'multiple', '',
                'size', from_box.size,
                'name', from_box.name,
                'aria-labelledby', field_id + '_to_title',
                'class', 'filtered'
            );
            const warning_footer = quickElement('div', selector_chosen, '', 'class', 'list-footer-display');
            quickElement('span', warning_footer, '', 'id', field_id + '_list-footer-display-text');
            quickElement('span', warning_footer, ' ' + gettext('(click to clear)'), 'class', 'list-footer-display__clear');
            const clear_all = quickElement(
                'button',
                selector_chosen,
                interpolate(gettext('Remove all %s'), [field_name]),
                'id', field_id + '_remove_all',
                'class', 'selector-clearall'
            );

            // Set up field name change
            from_box.name = from_box.name + '_old';

            // Set up event handlers
            const move_selection = function(e, elem, move_func, from, to) {
                if (!elem.hasAttribute('disabled')) {
                    move_func(from, to);
                    SelectFilter.refresh_icons(field_id);
                    SelectFilter.refresh_filtered_selects(field_id);
                    SelectFilter.refresh_filtered_warning(field_id);
                }
                e.preventDefault();
            };

            choose_all.addEventListener('click', function(e) {
                move_selection(e, this, SelectBox.move_all, field_id + '_from', field_id + '_to');
            });
            add_button.addEventListener('click', function(e) {
                move_selection(e, this, SelectBox.move, field_id + '_from', field_id + '_to');
            });
            remove_button.addEventListener('click', function(e) {
                move_selection(e, this, SelectBox.move, field_id + '_to', field_id + '_from');
            });
            clear_all.addEventListener('click', function(e) {
                move_selection(e, this, SelectBox.move_all, field_id + '_to', field_id + '_from');
            });
            warning_footer.addEventListener('click', function(e) {
                filter_selected_input.value = '';
                SelectBox.filter(field_id + '_to', '');
                SelectFilter.refresh_filtered_warning(field_id);
                SelectFilter.refresh_icons(field_id);
            });

            filter_input.addEventListener('keypress', function(e) {
                SelectFilter.filter_key_press(e, field_id, '_from', '_to');
            });
            filter_input.addEventListener('keyup', function(e) {
                SelectFilter.filter_key_up(e, field_id, '_from');
            });
            filter_input.addEventListener('keydown', function(e) {
                SelectFilter.filter_key_down(e, field_id, '_from', '_to');
            });

            filter_selected_input.addEventListener('keypress', function(e) {
                SelectFilter.filter_key_press(e, field_id, '_to', '_from');
            });
            filter_selected_input.addEventListener('keyup', function(e) {
                SelectFilter.filter_key_up(e, field_id, '_to', '_selected_input');
            });
            filter_selected_input.addEventListener('keydown', function(e) {
                SelectFilter.filter_key_down(e, field_id, '_to', '_from');
            });

            selector_div.addEventListener('change', function(e) {
                if (e.target.tagName === 'SELECT') {
                    SelectFilter.refresh_icons(field_id);
                }
            });

            selector_div.addEventListener('dblclick', function(e) {
                if (e.target.tagName === 'OPTION') {
                    if (e.target.closest('select').id === field_id + '_to') {
                        SelectBox.move(field_id + '_to', field_id + '_from');
                    } else {
                        SelectBox.move(field_id + '_from', field_id + '_to');
                    }
                    SelectFilter.refresh_icons(field_id);
                }
            });

            from_box.closest('form').addEventListener('submit', function() {
                SelectBox.filter(field_id + '_to', '');
                SelectBox.select_all(field_id + '_to');
            });

            // Initialize select boxes
            SelectBox.init(field_id + '_from');
            SelectBox.init(field_id + '_to');
            SelectBox.move(field_id + '_from', field_id + '_to');

            // Initial icon refresh
            SelectFilter.refresh_icons(field_id);
        },

        // Additional methods for selection validation, refreshing UI components, etc. remain the same

    };

    // Initialization code when the page loads
    window.addEventListener('load', function(e) {
        document.querySelectorAll('select.selectfilter, select.selectfilterstacked').forEach(function(el) {
            const data = el.dataset;
            SelectFilter.init(el.id, data.fieldName, parseInt(data.isStacked, 10));
        });
    });
}
