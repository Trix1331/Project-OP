'use strict';
{
    const SelectBox = {
        cache: {},
        
        // Initialize SelectBox with the given ID
        init: function(id) {
            const box = document.getElementById(id);
            SelectBox.cache[id] = Array.from(box.options).map(option => ({
                value: option.value,
                text: option.text,
                displayed: 1
            }));
        },

        // Repopulate HTML select box from cache
        redisplay: function(id) {
            const box = document.getElementById(id);
            const scroll_value_from_top = box.scrollTop;
            box.innerHTML = ''; // Clear the options
            SelectBox.cache[id].forEach(node => {
                if (node.displayed) {
                    const new_option = new Option(node.text, node.value, false, false);
                    new_option.title = node.text; // Tooltip with the option text
                    box.appendChild(new_option);
                }
            });
            box.scrollTop = scroll_value_from_top;
        },

        // Filter options based on the input text (AND search)
        filter: function(id, text) {
            const tokens = text.toLowerCase().split(/\s+/);
            SelectBox.cache[id].forEach(node => {
                node.displayed = tokens.every(token => node.text.toLowerCase().includes(token)) ? 1 : 0;
            });
            SelectBox.redisplay(id);
        },

        // Get the count of hidden nodes
        get_hidden_node_count: function(id) {
            return (SelectBox.cache[id] || []).filter(node => node.displayed === 0).length;
        },

        // Delete an option from the cache by its value
        delete_from_cache: function(id, value) {
            const cache = SelectBox.cache[id];
            const index = cache.findIndex(node => node.value === value);
            if (index !== -1) {
                cache.splice(index, 1);
            }
        },

        // Add an option to the cache
        add_to_cache: function(id, option) {
            SelectBox.cache[id].push({ value: option.value, text: option.text, displayed: 1 });
        },

        // Check if an item is contained in the cache
        cache_contains: function(id, value) {
            return SelectBox.cache[id].some(node => node.value === value);
        },

        // Move selected options from one select box to another
        move: function(from, to) {
            const from_box = document.getElementById(from);
            Array.from(from_box.options).forEach(option => {
                const option_value = option.value;
                if (option.selected && SelectBox.cache_contains(from, option_value)) {
                    SelectBox.add_to_cache(to, { value: option_value, text: option.text, displayed: 1 });
                    SelectBox.delete_from_cache(from, option_value);
                }
            });
            SelectBox.redisplay(from);
            SelectBox.redisplay(to);
        },

        // Move all options from one select box to another
        move_all: function(from, to) {
            const from_box = document.getElementById(from);
            Array.from(from_box.options).forEach(option => {
                const option_value = option.value;
                if (SelectBox.cache_contains(from, option_value)) {
                    SelectBox.add_to_cache(to, { value: option_value, text: option.text, displayed: 1 });
                    SelectBox.delete_from_cache(from, option_value);
                }
            });
            SelectBox.redisplay(from);
            SelectBox.redisplay(to);
        },

        // Sort options in the select box alphabetically
        sort: function(id) {
            SelectBox.cache[id].sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));
        },

        // Select all options in the select box
        select_all: function(id) {
            const box = document.getElementById(id);
            Array.from(box.options).forEach(option => {
                option.selected = true;
            });
        }
    };

    window.SelectBox = SelectBox;
}
