/*!
 * Save My Form 2020 - a jQuery Plugin
 * version: 1.4.5
 * Copyright: 2020 Paul Jones
 * MIT license
 */

(function($, window, document, undefined) {
    'use strict';

    var pluginName = 'saveMyForm';

    function saveMyForm(element, options) {
        this.element = element;
        this.settings = $.extend({}, $.fn[pluginName].defaults, options);
        this._name = pluginName;
        this._loadingList = {};
        this._elementList = [];
        var $element = $(element);

        this._formName =
            this.settings.formName !== undefined
                ? this.settings.formName
                : $element.attr('id') !== undefined
                ? $element.attr('id')
                : $element.attr('name') !== undefined
                ? $element.attr('name')
                : undefined;
        if (this._formName == undefined) {
            var formIndex = $('form').index($element);
            if (formIndex !== -1) {
                this._formName =
                    window.location.pathname + '_formindex_' + formIndex;
            } else {
                console.log(
                    'Unable to save form data - no id, name or index found'
                );
                return;
            }
        }
        if (this.settings.addPathToName === true) {
            this._formName =
                this._formName +
                '___' +
                window.location.pathname.slice(this.settings.addPathLength);
        }
        this.init();
    }

    $.extend(saveMyForm.prototype, {
        init: function() {
            var $plugin = this;
            this._elementList = this.getElementList();
            $(this.element)
                .find(':input')
                .each(function() {
                    $plugin.addElement(this);
                });
            this.storeElementList();
            if (this.settings.resetOnSubmit === true) {
                $(this.element).submit(function() {
                    $plugin.clearStorage();
                });
            }
        },
        addElement: function(element) {
            if ($(element).is(this.settings.exclude)) {
                return;
            }
            if (
                this.settings.include !== null &&
                !$(element).is(this.settings.include)
            ) {
                return;
            }
            var $plugin = this;
            var name = this.getName(element);
            if (name) {
                $(element)
                    .change(function(e) {
                        $plugin.storeElement(e);
                    })
                    .keyup(
                        debounce(function(e) {
                            $plugin.storeElement(e);
                        }, 500)
                    );
                
                
                if (this._loadingList[name] === undefined) {
                    this._loadingList[name] = 0;
                }
                else {
                    // If another element is found with the same name that isn't a radio group,
                    // add multiple data to differentiate the field
                    
                    if (!$(element).is(':radio')) {
                        this._loadingList[name]++;

                        $.data(element, 'multiple', this._loadingList[name]);
                        name =
                            name +
                            this.settings.sameNameSeparator +
                            this._loadingList[name];
                    }
                }
                if (this._elementList.indexOf(name) === -1) {
                    this._elementList.push(name);
                } 

                if (this.settings.loadInputs === true) {
                    this.loadElement(element);
                }
            }
        },
        loadElement: function(element) {
            var name = this.getName(element);
            var value = localStorage.getItem(name);
            if (value !== null) {
                value = JSON.parse(value);
                if ($(element).is(':checkbox')) {
                    $(element).prop('checked', value);
                } else if ($(element).is(':radio')) {
                    if (value == $(element).val()) {
                        $(element).prop('checked', true);
                    }
                } else {
                    $(element).val(value);
                }
            }
        },
        storeElement: function(event) {
            var name = this.getName(event.target),
                element = $(event.target),
                value;
            if (!name) return;
            if ($(event.target).is(':checkbox')) {
                value = element.prop('checked');
            } else {
                value = element.val();
            }
            localStorage.setItem(name, JSON.stringify(value));
        },
        getElementList: function() {
            return $.fn[pluginName].getElementListByFormName(this._formName);
        },
        storeElementList: function() {
            localStorage.setItem(
                'elementList_' + this._formName,
                JSON.stringify(this._elementList)
            );
        },
        clearElementList: function() {
            localStorage.removeItem('elementList_' + this._formName);
        },
        clearStorage: function() {
            $.fn[pluginName].clearStorageByFormName(this._formName);
        },
        
        getName: function(element) {
            var $element = $(element);
            // Set by name first to allow radio groups to function, then id
            var elName = 
                 $element.attr('name') !== undefined
                    ? $element.attr('name')
                    : $element.attr('id') !== undefined
                    ? $element.attr('id')
                    : undefined;
            if (elName === undefined) {
                return undefined;
            }
            return (
                this._formName +
                '_' +
                elName +
                ($.data(element, 'multiple') !== undefined
                    ? this.settings.sameNameSeparator +
                      $.data(element, 'multiple')
                    : '')
            );
        }
    });

    
    $.fn[pluginName] = function(methodOrOptions, args) {
        return this.each(function() {
            var $plugin = $.data(this, 'plugin_' + pluginName);

            if (!$plugin) {
                var pluginOptions =
                    typeof methodOrOptions === 'object' ? methodOrOptions : {};
                $plugin = $.data(
                    this,
                    'plugin_' + pluginName,
                    new saveMyForm(this, pluginOptions)
                );
            }

            if (typeof methodOrOptions === 'string') {
                if (typeof $plugin[methodOrOptions] === 'function') {
                    if (typeof args !== 'array') args = [args];
                    $plugin[methodOrOptions].apply($plugin, args);
                }
            }
        });
    };

    // Plugin defaults
    $.fn[pluginName].defaults = {
        exclude: ':password, :hidden, :file, .disable_save',
        include: null,
        formName: undefined,
        addPathToName: false,
        addPathLength: -255,
        loadInputs: true,
        sameNameSeparator: '___',
        resetOnSubmit: true
    };

    $.fn[pluginName].getElementListByFormName = function( savedFormName ) {
        return (
            JSON.parse(
                localStorage.getItem('elementList_' + savedFormName)
            ) || []
        );
    };

    $.fn[pluginName].clearStorageByFormName = function( savedFormName ) {
        try {
            var elements = $.fn[pluginName].getElementListByFormName( savedFormName );
            if (elements.length > 0) {
                $.each(elements, function(key, value) {
                    localStorage.removeItem(value);
                });
                return true;
            }
        } catch (err) {
            console.log(err);
        }
        return false;
    };

})(jQuery, window, document);

// Underscore debounce function
function debounce(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    if (null == wait) wait = 100;

    function later() {
        var last = Date.now() - timestamp;

        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
                context = args = null;
            }
        }
    }

    var debounced = function() {
        context = this;
        args = arguments;
        timestamp = Date.now();
        var callNow = immediate && !timeout;
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }

        return result;
    };

    debounced.clear = function() {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };

    debounced.flush = function() {
        if (timeout) {
            result = func.apply(context, args);
            context = args = null;

            clearTimeout(timeout);
            timeout = null;
        }
    };

    return debounced;
}
