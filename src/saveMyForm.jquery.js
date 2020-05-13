/*!
 * Save My Form 2020 - a jQuery Plugin
 * version: 1.5.6
 * Copyright: 2020 Paul Jones
 * MIT license
 */

(function($, window, document, undefined) {
    'use strict';

    $.extend($.fn, {
        saveMyForm: function(methodOrOptions, args) {
            return this.each(function() {
                var $plugin = $.data(this, 'plugin_saveMyForm');

                if (!$plugin) {
                    var pluginOptions =
                        typeof methodOrOptions === 'object'
                            ? methodOrOptions
                            : {};
                    $plugin = $.data(
                        this,
                        'plugin_saveMyForm',
                        new $.saveMyForm(this, pluginOptions)
                    );
                }

                if (typeof methodOrOptions === 'string') {
                    if (methodOrOptions === 'clearStorage') {
                        $.saveMyForm.clearStorage($plugin._formName);
                    } else {
                        if (!$.isArray(args)) {
                            args = [args];
                        }
                        if (typeof $plugin[methodOrOptions] === 'function') {
                            $plugin[methodOrOptions].apply($plugin, args);
                        }
                    }
                }
            });
        }
    });

    $.saveMyForm = function(element, options) {
        this._form = element;
        this.settings = $.extend({}, $.saveMyForm.defaults, options);
        this.init();
    };

    $.extend($.saveMyForm, {
        defaults: {
            exclude: ':password, input[type="hidden"], :file, .disable_save',
            include: null,
            formName: undefined,
            addPathToName: false,
            addPathLength: -255,
            loadInputs: true,
            sameNameSeparator: '___',
            resetOnSubmit: true
        },
        prototype: {
            _form: null,
            init: function() {
                this._elementList = [];
                this._loadingList = {};
                this._formName = '';
                if (!this.setFormName()) {
                    return;
                }
                var $plugin = this;
                this._elementList = $.saveMyForm.getElementList(this._formName);
                $(this._form)
                    .find(':input')
                    .each(function() {
                        $plugin.addElement(this);
                    });
                this.storeElementList();
                if (this.settings.resetOnSubmit === true) {
                    $(this._form).submit(function() {
                        $.saveMyForm.clearStorage($plugin._formName);
                    });
                }
            },
            setFormName: function() {
                var $form = $(this._form);
                this._formName =
                    this.settings.formName !== undefined
                        ? this.settings.formName
                        : $form.attr('id') !== undefined
                        ? $form.attr('id')
                        : $form.attr('name') !== undefined
                        ? $form.attr('name')
                        : undefined;
                if (this._formName == undefined) {
                    var formIndex = $('form').index($form);
                    if (formIndex !== -1) {
                        this._formName =
                            window.location.pathname +
                            '_formindex_' +
                            formIndex;
                    } else {
                        return false;
                    }
                }
                if (this.settings.addPathToName === true) {
                    this._formName =
                        this._formName +
                        '___' +
                        window.location.pathname.slice(
                            this.settings.addPathLength
                        );
                }
                return true;
            },
            addElement: function(element) {
                var $element = $(element);
                if ($element.is(this.settings.exclude)) {
                    return;
                }
                if (
                    this.settings.include !== null &&
                    !$element.is(this.settings.include)
                ) {
                    return;
                }
                var $plugin = this,
                    name = this.getName(element),
                    callbackMatch = undefined;
                if($.saveMyForm.callbacks.length > 0) {
                    $.each($.saveMyForm.callbacks, function(index, callback) {
                        if(callback.match(element)) {
                            callbackMatch = callback;
                            return false;
                        }
                    });
                }
                if (name) {
                    $element
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
                    } else {
                        // If another element is found with the same name that isn't a radio group,
                        // add multiple data to differentiate the field
                        if (!$element.is(':radio')) {
                            this._loadingList[name]++;

                            $.data(
                                element,
                                'multiple',
                                this._loadingList[name]
                            );
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
                        if (callbackMatch && callbackMatch.loadElement) {
                            callbackMatch.loadElement(element, this);
                        } else {
                            this.loadElement(element);
                        }
                    }
                }
            },
            loadElement: function(element) {
                var $element = $(element),
                    name = this.getName(element),
                    value = localStorage.getItem(name);
                if (value !== null) {
                    value = JSON.parse(value);
                    if ($element.is(':checkbox')) {
                        $element.prop('checked', value).change();
                    } else if ($element.is(':radio')) {
                        if (value == $element.val()) {
                            $element.prop('checked', true).change();
                        }
                    } else {
                        $element.val(value).change();
                    }
                }
            },
            storeElement: function(event) {
                var name = this.getName(event.target),
                    $element = $(event.target),
                    value;
                if ($(event.target).is(':checkbox')) {
                    value = $element.prop('checked');
                } else {
                    value = $element.val();
                }
                localStorage.setItem(name, JSON.stringify(value));
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
        },
        callbacks: [],
        addCallback: function(callback) {
            $.saveMyForm.callbacks.push(callback);
        },
        getElementList: function(savedFormName) {
            return (
                JSON.parse(
                    localStorage.getItem('elementList_' + savedFormName)
                ) || []
            );
        },
        clearStorage: function(savedFormName) {
            var elements = $.saveMyForm.getElementList(savedFormName);
            if (elements.length > 0) {
                $.each(elements, function(key, value) {
                    localStorage.removeItem(value);
                });
                return true;
            }
        }
    });

    // functions to maintain compatibility with scripts set up using versions < 1.4.6
    $.fn['saveMyForm'].defaults = $.saveMyForm.defaults;
    $.fn['saveMyForm'].getElementListByFormName = $.saveMyForm.getElementList;
    $.fn['saveMyForm'].clearStorageByFormName = $.saveMyForm.clearStorage;

    // Underscore debounce function
    // Copyright (c) 2009-2018 Jeremy Ashkenas, DocumentCloud and Investigative
    // Reporters & Editors
    /* istanbul ignore next */
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
})(jQuery, window, document);
