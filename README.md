# Save My Form 2020 - a jQuery Plugin

**Save form state in the browser's localStorage.**

Imagine your subscribers filling in a long feedback form or writing lots of important information on your website only to have their child shut down the web browser while they stopped to grab a cup of coffee. Not good! When they re-open your site all of their precious data will be completely safe!

Use this script to save form input state automatically in your website user's browser so that they can return and complete it at a later time.

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

1. Include jQuery:

``` html
<script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
```

2. Include plugin's code:

``` html
<script src="src/saveMyForm.jquery.js"></script>
```

3. Call the plugin when jQuery is ready:

``` javascript
$(function () {
	$("#form_id").saveMyForm();
});
```

4. or for all forms on the current page:

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
	exclude: ':password, :hidden, :file, .disable_save',
	include: null,
	formName: undefined,
	loadInputs: true,
	resetOnSubmit: true,
	sameNameSeparator: '___',
});
```

The available options are:
* `exclude` – jQuery selectors to define form fields that you don't want to save data for. See: https://api.jquery.com/category/selectors/ for more about jQuery selectors
* `include` - jQuery selectors to define form fields that you DO want to save data for. 
* `formName` - the name to use when saving the form. Leave as undefined to automatically generate name.
* `loadInputs` - reload input data from localStorage when page is re-loaded. 
* `resetOnSubmit` - delete form data from localStorage when the form is submit 
* `sameNameSeparator` - the separator to be used between the field name and an index number in the localStorage key when multiple form fields have the same name.

### Notes about the script options

#### `exclude: ':password, :hidden, :file, .disable_save'`

The default settings in the 'exclude' option means that password, hidden and file-upload type fields aren't saved to the browser (of course all this information will be submitted to your website - it just isn't stored in the localStorage of the user's browser if they shut it down). 

The default selector class `disable_save` also causes form fields with that class not to be saved to the browser. To achieve this just add `disable_save` to the field like the following example:

``` html
<input type="text" name="my_field" class="disable_save" />
```

#### `include: null`

Leave this equal to `null` to include everything that is not excluded by the exclude option.

#### `formName: undefined`

If undefined it is automatically set to the form id, form name or the page's pathname with an index of the forms location on the page (to handle multiple forms on one page), in that order.

#### `loadInputs: true`

True by default to allow the form to automatically reload form data if it is present in localStorage. Set this to false if the form data is being re-populated by a server-side script after the form has been submitted. (Used in combination with the 'resetOnSubmit' option.) If set to false it will update any futher changes to the data in a field but won't initially load the data from localStorage.

#### `resetOnSubmit: true`

Resets the localStorage for that form when the form is submit. If form submission is cancelled by a subsequent script (eg. a form validation script), or if a server-side script is used to validate the form and the page is reloaded as it is invalid, then this may cause the data in localStorage to be cleared even though the form isn't accepted for submission. If this is the case then you may prefer to set this option to false and add a custom script to reset localStorage when the server redirects to your 'Submission successful' page.

### Methods

When Save My Form is initialized, you can use API methods to perform certain functions. Call the method with `$(selector).saveMyForm('methodToCall')` where `methodToCall` is:

* `clearStorage` - clear the localStorage of the form (eg. call on successful ajax submission to reset all data)

### Handling dynamically set field values

If you set a field value using code, the field won't save unless you tell it that it has changed. The easiest way to do this using jQuery is to add `.change()` after setting the value.

``` javascript
$("#form_field_id").val('New Value').change();
```

## Compatibility

### Browsers

Coming soon...

## License

Distributed under [MIT license](https://github.com/pjjonesnz/saveMyForm.jquery/blob/master/LICENSE.md)

## Contributing

Feel free to contribute to this plugin by creating a pull request of your changes. I would LOVE to hear how it is being used.

Enjoy!