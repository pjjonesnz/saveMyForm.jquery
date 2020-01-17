# Save My Form 2020 - a jQuery Plugin

**Save form state in the browser's localStorage.**

Fix the frustration of your site visitors filling in a long feedback, enquiry or booking form only to have their information lost before submission if their browser crashes or they get disconnected while on the go. Save My Form saves the form state in their local browser as they type, meaning that if they close down their browser their form will still have their information ready to complete when they return.

## Features

* Form data is saved in localStorage as it is typed, or as fields are selected or checked, allowing the user to come back at a later date to complete their form, or easily recover from a crash.
* Easily exclude fields that have sensitive information (eg. passwords) that you don't want saved on their browser.
* Use multiple forms on a single page
* Saves unique field values even when the name is the same accross multiple fields (eg. form input arrays, PHP form data arrays - multiple fields having `name="field_name[]"` )
* Input is debounced to save excessive writes
* Handles HTML5 Input Types including date, time, URL, search, range, color and more...
* Custom plugin options to enable integration with server-side validation

## Demo

[View the form demo](https://www.pauljones.co.nz/github/saveMyForm.jquery/demo/index.html)

## Usage

Include jQuery:

``` html
<script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
```

Include the plugin javascript:

``` html
<script src="src/saveMyForm.jquery.js"></script>
```

Add ie8 support if required (note: add type="text/javascript" to other includes)

``` html
<script type="text/javascript" src="src/ie8.support.js"></script>
```

Call the plugin when jQuery is ready:

``` javascript
$(function () {
	$("#form_id").saveMyForm();
});
```

Or you can specify the jquery selector as required - eg. call it for all forms on the current page:

``` javascript
$(function () {
	$("form").saveMyForm();
});
```

## Note

For this scipt to work correctly the form input to be saved needs to have its id and/or name set. Inputs without this will be skipped.

## API

### Options

You can pass options into Save My Form when you initialize the plugin. The default settings (if you just call `$("form").saveMyForm();`) are the same as calling the following:

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

The defaults are publically accessable, so if you prefer you can also preset the defaults for all following calls to saveMyForm(). You obviously wouldn't want to set the formName using this method.

``` javascript
$.fn['saveMyForm'].defaults.resetOnSubmit = false;
$("#form1").saveMyForm();
$("#form2").saveMyForm();
```

The available options are:
* `exclude` – jQuery selectors to define form fields that you don't want to save data for. See: https://api.jquery.com/category/selectors/ for more about jQuery selectors
* `include` - jQuery selectors to define form fields that you DO want to save data for. 
* `formName` - the name to use when saving the form. Leave as undefined to automatically generate name.
* `addPathToName` - add the page path to the name of the form - to individually handle forms on different pages that have the same form name (whether the name is automatically or manually specified).
* `addPathLength`- the length of the path to add to the form name,
* `loadInputs` - reload input data from localStorage when page is re-loaded. 
* `resetOnSubmit` - delete form data from localStorage when the form is submit 
* `sameNameSeparator` - the separator to be used between the field name and an index number in the localStorage key when multiple form fields have the same name.

### Notes about the script options

#### `exclude: ':password, input[type="hidden"], :file, .disable_save'`

The default settings in the 'exclude' option means that password, hidden and file-upload type fields aren't saved to the browser (of course all this information will be submitted to your website - it just isn't stored in the localStorage of the user's browser if they shut it down). 

The default selector class `disable_save` also causes form fields with that class not to be saved to the browser. To achieve this just add `disable_save` to the field like the following example:

``` html
<input type="text" name="my_field" class="disable_save" />
```

#### `include: null`

Leave this equal to `null` to include everything that is not excluded by the exclude option.

#### `formName: undefined`

If undefined it is automatically set to the form id, form name or the page's pathname with an index of the forms location on the page (to handle multiple forms on one page), in that order. Set to a string to give the form a specific name.

#### `addPathToName: false`

If set to true this adds the website page's pathname to the name of the form to distinguish it from other forms with the same id or name on your website. Note: If you handle the validation server-side and you are sibmitting to a different url then set this to false and use the forms id, name or formName option to differentiate it.

#### `addPathLength: -255`

The length of the pathname to add to the formName when distinguishing it from froms on other pages of your website. Setting to a negative value is preferred so that it uses the last part of the pathname rather than the first.

#### `loadInputs: true`

True by default to allow the form to automatically reload form data if it is present in localStorage. Set this to false if the form data is being re-populated by a server-side script after the form has been submitted. (Used in combination with the 'resetOnSubmit' option.) If set to false it will update any futher changes to the data in a field but won't initially load the data from localStorage.

#### `resetOnSubmit: true`

Resets the localStorage for that form when the form is submit. If form submission is cancelled by a subsequent script (eg. a form validation script), or if a server-side script is used to validate the form and the page is reloaded as it is invalid, then this may cause the data in localStorage to be cleared even though the form isn't accepted for submission. Please note that having this setting set to true may also reset their saved information if they successfully submitted the form but they moved out of range of an Internet connection. If any of these issues are valid for your site, then you may prefer to set this option to false and add a custom script to reset the form's localStorage when the server redirects to your 'Submission successful' page. You can do this using the 'clearStorage' or 'clearStorageByFormName' methods outlined below.

### Public Plugin Methods

* `clearStorageByFormName` - Clears all the stored input values for a particular form. If you are distinguishing the form using a pathname as well (see addPathName option above), you will need to add the pathname before the form name.

``` javascript
// Example to clear storage for a particular form
$.fn['saveMyForm'].clearStorageByFormName('storedFormName');

// Or if pathname is being used to distinguish the form from the rest of your site use the following
$.fn['saveMyForm'].clearStorageByFormName(the_pathname + '_' + 'storedFormName');
```

### Methods to call on plugin instance

When Save My Form is initialized, you can use API methods to perform certain functions. Call the method with `$(selector).saveMyForm('methodToCall')` where `methodToCall` is:

* `clearStorage` - clear the localStorage of the form (eg. call on successful ajax submission to reset all data)

### Handling dynamically set field values

If you set a field value using code, the field won't save unless you tell it that it has changed. The easiest way to do this using jQuery is to add `.change()` after setting the value.

``` javascript
$("#form_field_id").val('New Value').change();
```

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

Feel free to contribute to this plugin by creating a pull request of your changes. I would LOVE to hear how it is being used.

Enjoy!