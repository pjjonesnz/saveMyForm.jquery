# Save My Form 2020 - a jQuery Plugin

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/pjjonesnz/saveMyForm.jquery)](https://github.com/pjjonesnz/saveMyForm.jquery/releases)
[![Build Status](https://travis-ci.org/pjjonesnz/saveMyForm.jquery.svg?branch=master)](https://travis-ci.org/pjjonesnz/saveMyForm.jquery)
[![Coverage Status](https://coveralls.io/repos/github/pjjonesnz/saveMyForm.jquery/badge.svg?branch=master)](https://coveralls.io/github/pjjonesnz/saveMyForm.jquery?branch=master)
[![devDependencies Status](https://david-dm.org/pjjonesnz/saveMyForm.jquery/dev-status.svg)](https://david-dm.org/pjjonesnz/saveMyForm.jquery?type=dev)
[![GitHub license](https://img.shields.io/github/license/pjjonesnz/saveMyForm.jquery)](https://github.com/pjjonesnz/saveMyForm.jquery/blob/master/LICENSE.md)
[![npm](https://img.shields.io/npm/v/savemyform.jquery)](https://www.npmjs.com/package/savemyform.jquery)

**Save form state in the browser's localStorage.**

Fix the frustration of your site visitors filling in a long feedback, enquiry or booking form only to have their information lost before submission if their browser crashes or they get disconnected while on the go. Save My Form saves the form state in their local browser as they type, meaning that if they close down their browser their form will still have their information ready to complete when they return.

## Features

* Form data is saved in localStorage as it is typed, or as fields are selected or checked, allowing the user to come back at a later date to complete their form, or easily recover from a crash.
* Easily exclude fields that have sensitive information (eg. passwords) that you don't want saved on their browser.
* Use multiple forms on a single page
* Compatible with jQuery UI Widgets
* Add custom callbacks to save data from your custom UI input controls
* Saves unique field values even when the name is the same across multiple fields (eg. form input arrays, PHP form data arrays - multiple fields having `name="field_name[]"` )
* Keyboard input is debounced to save excessive writes
* Handles HTML5 Input Types including date, time, URL, search, range, color and more...
* Custom plugin options to enable integration with server-side validation

## Demo

[View the html form demo](https://www.pauljones.co.nz/github/saveMyForm.jquery/demo/index.html)

[View the jQuery UI Widget demo](https://www.pauljones.co.nz/github/saveMyForm.jquery/demo/jquery_ui_demo.html)

[Codesandbox: CKEditor 5 + saveMyForm.jquery ](https://codesandbox.io/s/ckeditor-5-savemyform-example-wuoho)

## Usage

Include jQuery:

``` html
<script src="//code.jquery.com/jquery-1.12.4.min.js"></script>
```

**Optional:** Add ie8 support if required (note: add type="text/javascript" to other includes)

``` html
<script type="text/javascript" src="ie8.support.js"></script>
```

Include the plugin javascript:

``` html
<script src="saveMyForm.jquery.js"></script>
```

**Optional:** Do you need jQuery UI Widget compatibility? Most widgets are already supported, but extra code is needed if you use the jQuery UI Selectmenu Widget. Certain elements also need to be bound to an input. See the jQuery UI demo for examples.

``` html
<script src="custom_callbacks/jqueryui.saveMyForm.js"></script>
```

Call the plugin when jQuery is ready:

``` javascript
$(function () {
	$("#form_id").saveMyForm();
});

// Or you can specify the jquery selector as required - eg. call it for all forms on the current page:
$(function () {
	$("form").saveMyForm();
});
```

## Note

For this scipt to work correctly the form input to be saved needs to have its name and/or id set. Inputs without either of these set will be skipped.

## API

### Options

You can pass options into Save My Form when you initialize the plugin. The default settings if you call `$("#form_id").saveMyForm()` are the same as calling the following:

``` javascript
$("#form_id").saveMyForm({
	exclude: ':password, input[type="hidden"], :file, .disable_save',
	include: null,
	formName: undefined,
	addPathToName: false,
	addPathLength: -255,
	loadInputs: true,
	resetOnSubmit: true,
	sameNameSeparator: '___',
});
```

The defaults are publically accessable, so if you prefer you can also preset the defaults for all following calls to saveMyForm(). You obviously wouldn't want to set the formName using this method. eg:

``` javascript
$.saveMyForm.defaults.resetOnSubmit = false;
$("#form1").saveMyForm();
$("#form2").saveMyForm();
```

The available options are:
* `exclude` – jQuery selectors to define form input fields that you don't want to save data for. See: https://api.jquery.com/category/selectors/ for more about jQuery selectors.
* `include` - jQuery selectors to define form fields that you DO want to save data for. Leave this to null to automatically include all input field types that aren't excluded with the previous option.
* `formName` - the name to use when saving the form. Leave as undefined to automatically generate the storage name.
* `addPathToName` - add the page path to the name of the form - to individually handle forms on different pages that have the same form name (whether the name is automatically or manually specified).
* `addPathLength`- the length of the path to add to the form name. se a negative number like the default to select from the end of the path.
* `loadInputs` - reload input data from localStorage when the page is re-loaded.
* `resetOnSubmit` - delete input data from localStorage when the form is submitted.
* `sameNameSeparator` - the separator to be used between the field name and an index number in the localStorage key when multiple form fields have the same name. (eg. radio groups)

### Notes about the script options

#### `exclude: ':password, input[type="hidden"], :file, .disable_save'`

The default settings in the 'exclude' option means that password, hidden and file-upload type fields aren't saved to the browser (of course all this information will be submitted to your website - it just isn't stored in the localStorage of the user's browser if they shut it down). 

The default class selector `disable_save` causes form fields that have that class not to be saved to localStorage. To achieve this just add `disable_save` to the field class like the following example:

``` html
<input type="text" name="my_field" class="disable_save" />
```

#### `include: null`

Leave this equal to `null` to include everything that is not excluded by the exclude option.

#### `formName: undefined`

If undefined it is automatically set to the form id, form name or the page's pathname with an index of the forms location on the page (to handle multiple forms on one page), in that order. Set to a string to give the form a specific name.

#### `addPathToName: false`

If set to true this adds the current page's pathname to the name of the form to distinguish it from other forms with the same id or name on your website. Note: If you handle the validation server-side and you are submitting to a different url then set this to false and use the form's id, name or formName option to differentiate it.

#### `addPathLength: -255`

The length of the pathname to add to the formName when distinguishing it from forms on other pages of your website. Setting to a negative value is preferred so that it uses the last part of the pathname rather than the first.

#### `loadInputs: true`

True by default to allow the form to automatically reload form data if it is present in localStorage. Set this to false if the form data is being re-populated by a server-side script after the form has been submitted. (Used in combination with the 'resetOnSubmit' option.) If set to false it will save any further updates to the data in a field but won't initially load the data from localStorage.

#### `resetOnSubmit: true`

Automatically resets the localStorage for that form when the form is submit. If form submission is cancelled by a subsequent script (eg. a form validation script), or if a server-side script is used to validate the form and the page is reloaded as it is invalid, then this may cause the data in localStorage to be cleared even though the form isn't accepted for submission. Please note that having this setting set to true may also reset the stored data if the form was submitted after the user moved out of range of an Internet connection. If any of these issues are valid for your site, then you may prefer to set this option to false and add a custom script to reset the form's localStorage when the server redirects to your 'Submission successful' page. You can do this using the 'clearStorage' method outlined below. If submitting the form via ajax it would be better to manually call the 'clearStorage' method on the ajax success response.

### Public Plugin Methods

* `clearStorage` - Clears all the stored input values for a particular form. If you are distinguishing the form using a pathname as well (see addPathName option above), you will need to add the pathname before the form name.

``` javascript
// Example to clear storage for a particular form
$.saveMyForm.clearStorage('storedFormName');

// Or if pathname is being used to distinguish the form from the rest of your site use the following
$.saveMyForm.clearStorage(the_pathname + '_' + 'storedFormName');
```

* `addCallback` - Adds a Custom Callback to match custom elements which need a little extra help in setting their data. For more details see 'Custom callbacks' below.

### Methods to call on plugin instance

When Save My Form is initialized, you can use API methods to perform certain functions. Call the method with `$(selector).saveMyForm('methodToCall')` where `methodToCall` is:

* `clearStorage` - clear the localStorage of the form (eg. call on successful ajax submission to reset all data)

## Handling dynamically set field values

If you set a field value using code the field won't save unless you tell it that it has changed. The easiest way to do this using jQuery is to add `.change()` after setting the value.

``` javascript
$("#form_field_id").val('New Value').change();
```

## Custom callbacks

The UI of custom javascript input controls (eg. the jQuery UI Selectmenu Widget) don't always have the standard jQuery change event triggered when their data changes. This can cause the element to not update localStorage. When the form is initialized the UI of your custom control may also need to be refreshed to reflect the newly loaded data.

You can add custom callbacks to an element to handle this yourself.

Custom callbacks have two available methods:

* `match` - used to tell the plugin that the element should be handled by your callback. The input element gets passed in to the function. Return true to handle it, false to ignore.
* `loadElement` - is run when the element is initially loaded. You can add code in here to refresh the UI control as well as adding or removing code that runs when the input element changes.

``` javascript
$.saveMyForm.addCallback({ 
		match:function(element){}, 
		loadElement: function(element, plugin){} 
	});
```

In the `/custom_callbacks/` folder you'll find a callback all ready for the jQuery UI Selectmenu widget. To enable this just include the code after the main plugin code like this:

``` html
<script src="custom_callbacks/jqueryui.saveMyForm.js"></script>
```

Have a read of the comments in the `jqueryui.saveMyForm.js` code if you want to learn how to create your own custom callback.

## Compatibility

### Browsers

Browsers that handle localStorage [See CanIUse](https://caniuse.com/#search=localStorage)

#### Tested on the following browsers using jQuery 1.12.3:

* IE 8+
* Firefox 3.6+
* Chrome 15+
* Opera 15+
* Safari 4+
* Edge 15+

Thanks to https://browserstack.com for their fantastic testing tools!

### jQuery

Runs on all 3 jQuery major versions

#### Tested on:

* jQuery Core 1.12.4, 1.12.3
* jQuery Core 2.2.4, 2.2.3
* jQuery Core 3.4.1, 3.4.0

Note: different jQuery versions have different browser compatibility. For widest compatibility use jQuery 1.x

## License

Distributed under [MIT license](https://github.com/pjjonesnz/saveMyForm.jquery/blob/master/LICENSE.md)

## Contributing

Feel free to contribute to this plugin by creating a pull request of your changes.

I would LOVE to hear how this plugin is being used. 

Enjoy!