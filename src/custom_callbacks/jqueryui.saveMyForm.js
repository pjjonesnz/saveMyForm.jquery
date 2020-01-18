// Load when jQuery ready
$(function() {

    /**
     * Custom Callback for jQuery UI Selectmenu Widgets
     */
    var jQueryui_selectmenu_saveMyForm = {

        /**
         * Test to see if the input should be handled by this callback
         *
         * @param {Object} element - input element
         * @returns {boolean} - true if you to handle the element with this callback
         */
        match: function(element) {
            return $(element).data('uiSelectmenu') !== undefined;
        },

        /**
         * Called to load the element value from localStorage
         * 
         * You can run plugin.loadElement(element) if you want the input value 
         * to be populatd by the saveMyForm plugin. 
         * 
         * Run any extra code that you need to refresh the UI.
         * 
         * Attach event handlers to update the underlying input control when needed.
         *
         * @param {Object} element - input element
         * @param {Object} plugin - saveMyForm plugin
         * @returns {void}
         */
        loadElement: function(element, plugin) {
            // populate the input element using the default plugin loadElement method
            plugin.loadElement(element);
            // Refresh the jQuery UI Widget to reflect the current input value
            $(element)
                .data('uiSelectmenu')
                .refresh();
            // When a new option is selected in a jQuery UI Selectmenu
            // the 'selectmenuchange' event is fired. Run the plugin's 
            // storeElement method on this event to save the data in localStorage
            $(element).on('selectmenuchange', function(event, ui) {
                plugin.storeElement(event);
            });
        }
    };

    // Add the callback to saveMyForm
    $.saveMyForm.addCallback(jQueryui_selectmenu_saveMyForm);

});
