// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
(function($, window, document, undefined) {
    'use strict';

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variables rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = 'PJsFormSaver',
        defaults = {
            sameNameSeparator: '___',
            exclude: ':password, :hidden, :file, .exclude_save',
            include: null,
        };

    function PJsFormSaver(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this._multipleList = {};
        this._elementList = [];
        /**
         * @todo Auto generate a name from the document path and form order on page if id or name not supplied
         */
        this._formName = $(element).attr('id');
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(PJsFormSaver.prototype, {
        init: function() {
            var $plugin = this;
            $(this.element)
                .find(':input')
                .each(function() {
                    $plugin.addElement(this);
                });
            this.storeElementList();
        },
        addElement: function(element) {
            if($(element).is(this.settings.exclude)) {
                return;
            }
            if(this.settings.include !== null && !$(element).is(this.settings.include)) {
                return;
            }
            var $plugin = this;
            var name = this.getName(element);
            if (name) {
                $(element).change(function(e) {
                    $plugin.storeElement(e);
                })
                .keyup(
                    debounce(function(e) {
                        $plugin.storeElement(e);
                    }, 500)
                );
                if (this._elementList.indexOf(name) === -1) {
                    this._elementList.push(name);
                } else {
                    // If another element is found with the same name that isn't a radio group, add multiple data to differentiate
                    if (!$(element).is(':radio')) {
                        if (!this._multipleList[name]) {
                            this._multipleList[name] = 1;
                        }

                        $.data(element, 'multiple', this._multipleList[name]);
                        this._elementList.push(
                            name +
                                this.settings.sameNameSeparator +
                                this._multipleList[name]
                        );

                        this._multipleList[name]++;
                    }
                }
                this.loadElement(element);
            }
        },
        loadElement: function(element) {
            var name = this.getName(element);
            var value = JSON.parse(localStorage.getItem(name));
            if (value) {
                if ($(element).is(':checkbox')) {
                    $(element).prop('checked', value);
                } 
                else if($(element).is(':radio')) {
                    if(value == $(element).val()) {
                        $(element).prop('checked',true);
                    }
                }
                else {
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
            return JSON.parse( localStorage.getItem('elementList_' + this._formName) ) || [];
        },
        storeElementList: function() {
            localStorage.setItem('elementList_' + this._formName, JSON.stringify(this._elementList));
        },
        clearElementList: function() {
            localStorage.removeItem('elementList_' + this._formName);
        },
        clearStorage: function() {
            var elements = this.getElementList();
            $.each(elements, function(key, value) {
                localStorage.removeItem(value);
            });
        },
        getName: function(element) {
            if ($(element).attr('name') == undefined) {
                return undefined;
            }
            return this._formName + '_' + $(element).attr('name') + ($.data(element, 'multiple') !== undefined ? this.settings.sameNameSeparator + $.data(element, 'multiple') : '');
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
                    new PJsFormSaver(this, pluginOptions)
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
})(jQuery, window, document);

/** 
 * EXAMPLES:
 *      $(element).PJsFormSaver({option: value}) // instantiate
 *      $(element).PJsFormSaver('callMeWithShortcut', {name: value, name2: value2}) 
 *      $(element).PJsFormSaver('callMeWithShortcut', [arg1, arg2, arg3]) 
 *      $(element).PJsFormSaver('callMeWithShortcut', singleArgument) 
 * 
 * Access plugin data:
 *      $("#element").data('plugin_PJsFormSaver').settings.propertyName
 * 
 * Call a public method directly:
 *      $('#element').data('plugin_PJsFormSaver').foo_public_method();
*/

// Underscore debounce function
function debounce(func, wait, immediate){
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
  };

  var debounced = function(){
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
};