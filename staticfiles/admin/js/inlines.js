/*global DateTimeShortcuts, SelectFilter*/
/**
 * Django admin inlines
 * Modernized for better maintainability
 */
'use strict';

{
    const $ = django.jQuery;
    
    // Formset initialization
    $.fn.formset = function (opts) {
        const options = { ...$.fn.formset.defaults, ...opts };
        const $this = $(this);
        const $parent = $this.parent();
        
        const updateElementIndex = (el, prefix, ndx) => {
            const idRegex = new RegExp(`(${prefix}-(\\d+|__prefix__))`);
            const replacement = `${prefix}-${ndx}`;
            
            if ($(el).prop("for")) {
                $(el).prop("for", $(el).prop("for").replace(idRegex, replacement));
            }
            if (el.id) el.id = el.id.replace(idRegex, replacement);
            if (el.name) el.name = el.name.replace(idRegex, replacement);
        };

        const totalForms = $(`#id_${options.prefix}-TOTAL_FORMS`).prop("autocomplete", "off");
        let nextIndex = parseInt(totalForms.val(), 10);
        const maxForms = $(`#id_${options.prefix}-MAX_NUM_FORMS`).prop("autocomplete", "off");
        const minForms = $(`#id_${options.prefix}-MIN_NUM_FORMS`).prop("autocomplete", "off");
        let addButton;

        // Add another button
        const addInlineAddButton = () => {
            if (!addButton) {
                const addButtonHTML = `<div class="${options.addCssClass}"><a role="button" class="addlink" href="#">${options.addText}</a></div>`;
                if ($this.prop("tagName") === "TR") {
                    const numCols = $this.eq(-1).children().length;
                    $parent.append(`<tr class="${options.addCssClass}"><td colspan="${numCols}">${addButtonHTML}</td></tr>`);
                } else {
                    $this.filter(":last").after(addButtonHTML);
                }
                addButton = $parent.find("a.addlink");
            }

            addButton.on('click', addInlineClickHandler);
        };

        const addInlineClickHandler = (e) => {
            e.preventDefault();
            const template = $(`#${options.prefix}-empty`);
            const row = template.clone(true).removeClass(options.emptyCssClass)
                .addClass(options.formCssClass)
                .attr("id", `${options.prefix}-${nextIndex}`);
            
            addInlineDeleteButton(row);
            row.find("*").each((_, el) => updateElementIndex(el, options.prefix, totalForms.val()));
            row.insertBefore(template);
            
            $(totalForms).val(parseInt(totalForms.val(), 10) + 1);
            nextIndex += 1;

            if (maxForms.val() && (maxForms.val() - totalForms.val()) <= 0) {
                addButton.parent().hide();
            }
            toggleDeleteButtonVisibility(row.closest('.inline-group'));

            if (options.added) options.added(row);

            row.get(0).dispatchEvent(new CustomEvent("formset:added", {
                bubbles: true,
                detail: { formsetName: options.prefix }
            }));
        };

        // Delete button handler
        const addInlineDeleteButton = (row) => {
            row.find(':last').append(`<div><a role="button" class="${options.deleteCssClass}" href="#">${options.deleteText}</a></div>`);
            row.find(`a.${options.deleteCssClass}`).on('click', inlineDeleteHandler);
        };

        const inlineDeleteHandler = (e1) => {
            e1.preventDefault();
            const deleteButton = $(e1.target);
            const row = deleteButton.closest(`.${options.formCssClass}`);
            const inlineGroup = row.closest('.inline-group');
            row.remove();
            
            nextIndex -= 1;

            if (options.removed) options.removed(row);

            document.dispatchEvent(new CustomEvent("formset:removed", {
                detail: { formsetName: options.prefix }
            }));

            const forms = $(`.${options.formCssClass}`);
            $("#id_" + options.prefix + "-TOTAL_FORMS").val(forms.length);

            if (maxForms.val() === '' || (maxForms.val() - forms.length) > 0) {
                addButton.parent().show();
            }

            toggleDeleteButtonVisibility(inlineGroup);
            
            forms.each((i, el) => {
                $(el).find("*").each((_, element) => updateElementIndex(element, options.prefix, i));
            });
        };

        const toggleDeleteButtonVisibility = (inlineGroup) => {
            if (minForms.val() !== '' && minForms.val() - totalForms.val() >= 0) {
                inlineGroup.find('.inline-deletelink').hide();
            } else {
                inlineGroup.find('.inline-deletelink').show();
            }
        };

        // Initialize the formset
        $this.each(function () {
            $(this).not(`.${options.emptyCssClass}`).addClass(options.formCssClass);
        });

        $this.filter(`.${options.formCssClass}:not(.has_original):not(.${options.emptyCssClass})`).each((_, row) => {
            addInlineDeleteButton($(row));
        });

        toggleDeleteButtonVisibility($this);
        addButton = options.addButton;
        addInlineAddButton();

        const showAddButton = maxForms.val() === '' || (maxForms.val() - totalForms.val()) > 0;
        if ($this.length && showAddButton) {
            addButton.parent().show();
        } else {
            addButton.parent().hide();
        }

        return this;
    };

    // Plugin defaults
    $.fn.formset.defaults = {
        prefix: "form",
        addText: "add another",
        deleteText: "remove",
        addCssClass: "add-row",
        deleteCssClass: "delete-row",
        emptyCssClass: "empty-row",
        formCssClass: "dynamic-form",
        added: null,
        removed: null,
        addButton: null
    };

    // Tabular inlines ---------------------------------------------------------
    $.fn.tabularFormset = function (selector, options) {
        const $rows = $(this);

        const reinitDateTimeShortCuts = () => {
            if (typeof DateTimeShortcuts !== "undefined") {
                $(".datetimeshortcuts").remove();
                DateTimeShortcuts.init();
            }
        };

        const updateSelectFilter = () => {
            if (typeof SelectFilter !== 'undefined') {
                $('.selectfilter').each((_, value) => {
                    SelectFilter.init(value.id, value.dataset.fieldName, false);
                });
                $('.selectfilterstacked').each((_, value) => {
                    SelectFilter.init(value.id, value.dataset.fieldName, true);
                });
            }
        };

        const initPrepopulatedFields = (row) => {
            row.find('.prepopulated_field').each((_, field) => {
                const input = $(field).find('input, select, textarea');
                const dependencyList = input.data('dependency_list') || [];
                const dependencies = dependencyList.map(fieldName => `#${row.find(`.field-${fieldName}`).find('input, select, textarea').attr('id')}`);
                if (dependencies.length) {
                    input.prepopulate(dependencies, input.attr('maxlength'));
                }
            });
        };

        $rows.formset({
            prefix: options.prefix,
            addText: options.addText,
            formCssClass: `dynamic-${options.prefix}`,
            deleteCssClass: "inline-deletelink",
            deleteText: options.deleteText,
            emptyCssClass: "empty-form",
            added: (row) => {
                initPrepopulatedFields(row);
                reinitDateTimeShortCuts();
                updateSelectFilter();
            },
            addButton: options.addButton
        });

        return $rows;
    };

    // Stacked inlines ---------------------------------------------------------
    $.fn.stackedFormset = function (selector, options) {
        const $rows = $(this);

        const updateInlineLabel = (row) => {
            $(selector).find(".inline_label").each((i, label) => {
                const count = i + 1;
                $(label).html($(label).html().replace(/(#\d+)/g, `#${count}`));
            });
        };

        const reinitDateTimeShortCuts = () => {
            if (typeof DateTimeShortcuts !== "undefined") {
                $(".datetimeshortcuts").remove();
                DateTimeShortcuts.init();
            }
        };

        const updateSelectFilter = () => {
            if (typeof SelectFilter !== "undefined") {
                $(".selectfilter").each((_, value) => {
                    SelectFilter.init(value.id, value.dataset.fieldName, false);
                });
                $(".selectfilterstacked").each((_, value) => {
                    SelectFilter.init(value.id, value.dataset.fieldName, true);
                });
            }
        };

        const initPrepopulatedFields = (row) => {
            row.find('.prepopulated_field').each((_, field) => {
                const input = $(field).find('input, select, textarea');
                const dependencyList = input.data('dependency_list') || [];
                const dependencies = dependencyList.map(fieldName => `#${row.find(`.form-row .field-${fieldName}`).find('input, select, textarea').attr('id')}`);
                if (dependencies.length) {
                    input.prepopulate(dependencies, input.attr('maxlength'));
                }
            });
        };

        $rows.formset({
            prefix: options.prefix,
            addText: options.addText,
            formCssClass: `dynamic-${options.prefix}`,
            deleteCssClass: "inline-deletelink",
            deleteText: options.deleteText,
            emptyCssClass: "empty-form",
            removed: updateInlineLabel,
            added: (row) => {
                initPrepopulatedFields(row);
                reinitDateTimeShortCuts();
                updateSelectFilter();
                updateInlineLabel(row);
            },
            addButton: options.addButton
        });

        return $rows;
    };

    $(document).ready(() => {
        $(".js-inline-admin-formset").each(function () {
            const data = $(this).data();
            const inlineOptions = data.inlineFormset;
            let selector;
            switch (data.inlineType) {
                case "stacked":
                    selector = `${inlineOptions.name}-group .inline-related`;
                    $(selector).stackedFormset(selector, inlineOptions.options);
                    break;
                case "tabular":
                    selector = `${inlineOptions.name}-group .tabular.inline-related tbody:first > tr.form-row`;
                    $(selector).tabularFormset(selector, inlineOptions.options);
                    break;
            }
        });
    });
}
