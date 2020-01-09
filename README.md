# Save My Form 2020 - a jQuery Plugin

**Save form data automatically in your website user's browser so that they can return and complete it at a later time.**

Imagine your subscribers filling in a long feedback form or writing lots of important information on your website only to have their child shut down the web browser while they stopped to grab a cup of coffee. Not good!

Save My Form 2020 saves data typed into your form in their browser localStorage. When they re-open your site all of their precious data will be completely safe!

## Features

* Form data is saved in localStorage as it is typed, or as fields are selected or checked, allowing the user to come back at a later date to complete their form, or easily recover from a crash.
* Easily exclude fields that have sensitive information (eg. passwords) that you don't want saved on their browser.
* Saves unique field values even when the name is the same accross multiple fields (eg. form input arrays, PHP form data arrays - multiple fields having `name="field_name[]"` )
* Handles HTML5 Input Types including date, time, URL, search, range, color and more...

## Usage

1. Include jQuery:

	```html
	<script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
	```

2. Include plugin's code:

	```html
	<script src="src/save.my.form.jquery.js"></script>
	```

3. Call the plugin when jQuery is ready:

	```javascript
	$(function () {
		$("#form_id").saveMyForm();
	});
	```

or for all forms on the current page:

    ```javascript
	$(function () {
		$("form").saveMyForm();
	});
	```

## API

### Options

You can pass options into Save My Form when you initialize the plugin. The default settings (if you just call `$("form").saveMyForm();`) are the same as calling the following:

    ```javascript
	$("#form_id").saveMyForm({
		exclude: ':password, :hidden, :file, .disable_save',
		include: null,
		sameNameSeparator: '___',
	});
	```
The available options are:
* `exclude` – jQuery selectors to define form fields that you don't want to save data for. See: https://api.jquery.com/category/selectors/ for more about jQuery selectors
* `include` - jQuery selectors to define form fields that you DO want to save data for. **NOTE:** Leave this equal to `null` to include everything not excluded
* `sameNameSeparator` - separator to be used between the field name and an index number - when multiple form fields have the same name

### Defaults and what they achieve

The default settings above means that password, hidden and file-upload type fields aren't saved to the browser (of course all this information will be submitted to your website - it just isn't stored on the local user's browser if they shut it down). 

The default selector class `disable_save` also causes form fields with that class not to be saved to the browser. To achieve this just add `disable_save` to the field like the following example:

	```html
	<input type="text" name="my_field" class="disable_save" />
	```

### Methods

When Save My Form is initialized, you can use API methods to perform certain functions. Call the method with `$(selector).saveMyForm('methodToCall')` where `methodToCall` is:

* `clearStorage` - clear the localStorage of the form (eg. call on successful ajax submission to reset all data)

### Handling dynamically set field values

If you set a field value using code, the field won't save unless you tell it that it has changed. The easiest way to do this using jQuery is to add `.change()` after setting the value.

    ```javascript
	$("#form_field_id").val('New Value').change();
	```

## Compatibility

### Browsers

Coming soon...

## License

Distributed under [MIT license](https://github.com/kugaevsky/jquery-phoenix/blob/master/LICENSE)

## Contributing

Feel free to contribute to this plugin by creating a pull request of your changes. I would LOVE to hear how it is being used.

Enjoy!