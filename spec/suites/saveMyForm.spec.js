function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

describe('saveMyForm', function() {
    var form_id = 'my_form';

    function locSt(field) {
        return getLocalStorage(form_id + '_' + field);
    }

    beforeAll(function() {
        localStorage.clear();
    });

    afterAll(function() {});

    beforeEach(function() {
        jasmine.getFixtures().fixturesPath = 'base/spec/fixtures';
        loadFixtures('form.html');
        $('#' + form_id).saveMyForm();
    });

    afterEach(function() {
        $('#' + form_id).remove();
    });

    it('has text input value equal to sad on first load', function() {
        expect($('#text_input').val()).toEqual('sad');
    });

    it('changes localStorage for text_input to happy', function() {
        $('#text_input')
            .val('happy')
            .change();
        expect(locSt('text_input')).toEqual('happy');
    });

    it('automatically loads text_input when page is reloaded', function() {
        expect($('#text_input').val()).toEqual('happy');
    });

    it("doesn't update localStorage on programmatic field update if change() isn't triggered", function() {
        $('#text_input').val('');
        expect(locSt('text_input')).toEqual('happy');
    });

    it('it updates localStorage when keypress is triggered after debounce time', function(done) {
        var input = $('#text_input');
        input.val('joyful');
        var e = $.Event('keyup');
        e.which = 65;
        input.trigger(e);
        input.trigger(e);
        input.trigger(e);
        expect(locSt('text_input')).not.toEqual('joyful');
        setTimeout(function() {
            expect(locSt('text_input')).toEqual('joyful');
            done(); // call this to finish off the it block
        }, 501);
    });

    it('saves random characters correctly in localStorage', function() {
        var string = '~!@#$%^&*X#123456;&amp;"';
        $('#text_input')
            .val(string)
            .change();
        expect(locSt('text_input')).toEqual(string);
    });

    it('loads random characters correctly after page reload', function() {
        var string = '~!@#$%^&*X#123456;&amp;"';
        expect($('#text_input').val()).toEqual(string);
    });

    it("doesn't save linebreaks in text input fields", function() {
        var test = 'Sad\nand\nLonely';
        var expect_save = 'SadandLonely';
        $('#text_input')
            .val(test)
            .change();
        expect(locSt('text_input')).toEqual(expect_save);
    });

    it('saves linebreaks correctly in textareas', function() {
        var test = 'Sad\nand\nLonely';
        $('#textarea_field')
            .val(test)
            .change();
        expect(locSt('textarea_field')).toEqual(test);
    });

    it('uses the name to define the key in localStorage', function() {
        expect(locSt('my_checkbox')).toEqual(null);
        $('#checkbox_1').click();
        expect(locSt('my_checkbox')).toEqual(false);
        expect(locSt('checkbox_1')).toEqual(null);
    });

    it('uses the id to define the key in localStorage if no name exists', function() {
        expect(locSt('checkbox_2')).toEqual(null);
        $('#checkbox_2').click();
        expect(locSt('checkbox_2')).toEqual(true);
    });

    it('saves data from inputs with the same name with an index', function() {
        $('#same_name_1')
            .val('Here')
            .change();
        expect(locSt('same_name_text')).toEqual('Here');
        $('#same_name_2')
            .val('There')
            .change();
        expect(locSt('same_name_text')).toEqual('Here');
        expect(locSt('same_name_text___1')).toEqual('There');
    });

    it('reloads the data for inputs with the same name correcly', function() {
        expect($('#same_name_1').val()).toEqual('Here');
        expect($('#same_name_2').val()).toEqual('There');
    });

    it("doesn't save password input types by default", function() {
        $('#my_password')
            .val('secret')
            .change();
        expect($('#my_password').val()).toEqual('secret');
        expect(locSt('my_password')).toEqual(null);
    });

    it("doesn't save hidden input types by default", function() {
        $('#my_hidden')
            .val('secret')
            .change();
        expect($('#my_hidden').val()).toEqual('secret');
        expect(locSt('my_hidden')).toEqual(null);
    });

    it('resets localStorage when by $.saveMyForm.clearStorage() is called', function() {
        expect(locSt('same_name_text')).toEqual('Here');
        expect(locSt('same_name_text___1')).toEqual('There');
        $.saveMyForm.clearStorage(form_id);
        expect(locSt('same_name_text')).toEqual(null);
        expect(locSt('same_name_text___1')).toEqual(null);
    });

    it("obviously doesn't reload input values once localStorage has been cleared", function() {
        expect($('#same_name_1').val()).toEqual('');
        expect($('#same_name_2').val()).toEqual('');
    });

    it('does save input types that are not visible', function() {
        $('#my_not_displayed_text')
            .val('not seen')
            .change();
        expect($('#my_not_displayed_text').val()).toEqual('not seen');
        expect(locSt('my_not_displayed_text')).toEqual('not seen');
    });

    it('resets localStorage when clearStorage is called on plugin instance', function() {
        expect(locSt('my_not_displayed_text')).toEqual('not seen');
        $('#' + form_id).saveMyForm('clearStorage');
        expect(locSt('my_not_displayed_text')).toEqual(null);
    });

    it('resets localStorage when form is submitted', function() {
        $('#text_input')
            .val('very happy')
            .change();
        expect(locSt('text_input')).toEqual('very happy');
        // Cause form to not actually submit - note this still means the localStorage
        // is reset as submit is prevented after resetting
        $('#' + form_id).on('submit', function(e) {
            e.preventDefault();
        });
        $('#' + form_id).submit();
        expect(locSt('text_input')).toEqual(null);
    });

    it('can call privatish methods in plugin', function() {
        expect(getLocalStorage('elementList_' + form_id)).not.toEqual(null);
        $('#' + form_id).saveMyForm('clearElementList');
        expect(getLocalStorage('elementList_' + form_id)).toEqual(null);
    });

    it('unnamed elements can have their value changed but...', function() {
        var input = $('input[value="Unnamed"]');
        input.val('New Value');
        expect(input.val()).toEqual('New Value');
    });

    it("... unnamed elements aren't saved", function() {
        var input = $('input[value="Unnamed"]');
        expect(input.val()).toEqual('Unnamed');
    });
});

describe('saveMyForm with elements not automatically loaded', function() {
    var form_id = 'my_form';

    var save_formname = 'my_formname';

    function locSt(field) {
        return getLocalStorage(form_id + '_' + field);
    }

    beforeAll(function() {
        localStorage.clear();
    });

    afterAll(function() {});

    beforeEach(function() {
        jasmine.getFixtures().fixturesPath = 'base/spec/fixtures';
        loadFixtures('form.html');
        $('#' + form_id).saveMyForm({
            loadInputs: false
        });
    });

    afterEach(function() {
        $('#' + form_id).remove();
    });

    it("stores's values", function() {
        $('#text_input')
            .val('Apple')
            .change();
        expect(locSt('text_input')).toEqual('Apple');
    });

    it("doesn't automatically load stored values", function() {
        expect($('#text_input').val()).toEqual('sad');
    });

    it('allows you to call a privatish method to load an element manually', function() {
        $('#' + form_id).saveMyForm('loadElement','#text_input');
        expect($('#text_input').val()).toEqual('Apple');
    });

    it("will ignore a call if you call a function that doesn't exist", function() {
        expect(function() { $('#' + form_id).saveMyForm('not_a_function')}).not.toThrow();
    });
});

describe('saveMyForm - forms with no form element', function() {
    beforeAll(function() {
        localStorage.clear();
    });

    afterAll(function() {});

    beforeEach(function() {
        jasmine.getFixtures().fixturesPath = 'base/spec/fixtures';
        loadFixtures('non_standard_forms.html');
        $('div').saveMyForm();
    });

    afterEach(function() {
        $('div').remove();
    });

    it("won't load input elements if it isn't a html form element and doesn't have a name", function() {
        expect(
            $('div')
                .eq(2)
                .data('plugin_saveMyForm')._formName
        ).toEqual(undefined);
        expect(
            $('div')
                .eq(2)
                .data('plugin_saveMyForm')._elementList.length
        ).toEqual(0);
    });

    it("won't load input elements that don't have an id or name", function() {
        expect(
            $('[name="input_blank_form"]').data('plugin_saveMyForm')
                ._elementList.length
        ).toEqual(0);
    });

    it("will load input elements even in a form that isn't a html form element", function() {
        expect(
            $('#a_form').data('plugin_saveMyForm')._elementList.length
        ).toEqual(1);
    });

    it("will store the value of input elements in a form that isn't a html form", function() {
        $('#an_input')
            .val('Some text')
            .change();
        expect(getLocalStorage('a_form_an_input')).toEqual('Some text');
    });

    it("will reload the value of input elements in a form that isn't a html form", function() {
        expect($('#an_input').val()).toEqual('Some text');
    });

    it('works with forms that have a name instead of an id', function() {
        expect(
            $('[name="form_with_name_not_id"]').data('plugin_saveMyForm')
                ._elementList.length
        ).toEqual(1);
    });

    it("doesn't throw an error if you clearStorage on a form that has no elements", function() {
        expect(function() {
            $.saveMyForm.clearStorage('input_blank_form');
        }).not.toThrow();
    });
});

describe('saveMyForm WITH custom options', function() {
    var form_id = 'my_form';

    var save_formname = 'my_formname';
    var addPathToName = true;
    var addPathLength = -10;

    function locSt(field) {
        var pathName = window.location.pathname;
        pathName = pathName.slice(addPathLength);
        return getLocalStorage(
            save_formname +
                (addPathToName ? '___' + pathName : '') +
                '_' +
                field
        );
    }

    beforeAll(function() {
        localStorage.clear();
    });

    afterAll(function() {});

    beforeEach(function() {
        jasmine.getFixtures().fixturesPath = 'base/spec/fixtures';
        loadFixtures('form.html');
        $('#' + form_id).saveMyForm({
            include: ':input:not(#checkbox_2)',
            resetOnSubmit: false,
            formName: save_formname,
            addPathToName: addPathToName,
            addPathLength: addPathLength
        });
    });

    afterEach(function() {
        $('#' + form_id).remove();
    });

    it('adds a pathname to the field and form name to distinguish it', function() {
        $('#text_input')
            .val('very happy')
            .change();
        expect(locSt('text_input')).toEqual('very happy');
    });

    it("doesn't reset localStorage when resetOnSubmit is false", function() {
        $('#text_input')
            .val('very happy')
            .change();
        expect(locSt('text_input')).toEqual('very happy');
        // Cause form to not actually submit - note this still means the localStorage
        // is reset as submit is prevented after resetting
        $('#' + form_id).on('submit', function(e) {
            e.preventDefault();
        });
        $('#' + form_id).submit();
        expect(locSt('text_input')).toEqual('very happy');
    });
});

describe('page with multiple forms', function() {
    var form_id = 'my_form';
    var form1name = window.location.pathname + '_formindex_' + '0';
    var form2name = window.location.pathname + '_formindex_' + '1';

    function locSt(field) {
        return getLocalStorage(form_id + '_' + field);
    }

    beforeAll(function() {
        localStorage.clear();
    });

    afterAll(function() {});

    beforeEach(function() {
        jasmine.getFixtures().fixturesPath = 'base/spec/fixtures';
        loadFixtures('many_forms.html');
        $('form').saveMyForm();
    });

    afterEach(function() {
        $('form').remove();
    });

    it('can save forms with no id or name', function() {
        $('#text_input1')
            .val('very grateful')
            .change();
        $('#text_input2')
            .val('SO happy')
            .change();
        expect(getLocalStorage(form1name + '_input_same_name')).toEqual(
            'very grateful'
        );
        expect(getLocalStorage(form2name + '_input_same_name')).toEqual(
            'SO happy'
        );
    });
});

describe('saveMyForm jquery-ui comaptibility - WITHOUT custom_callback', function() {
    var form_id = 'jquery_ui_test';

    function val(field) {
        return $('#' + field).val();
    }

    function locSt(field) {
        return getLocalStorage(form_id + '_' + field);
    }

    beforeAll(function() {
        localStorage.clear();
    });

    afterAll(function() {});

    beforeEach(function(done) {
        jasmine.getFixtures().fixturesPath = 'base/spec/fixtures';
        loadFixtures('jquery_ui_form.html');
        $(function() {
            $('#speed_select').selectmenu();
            $('#jquery_ui_test input:radio').checkboxradio();
            $('#jquery_ui_test input:checkbox').checkboxradio();
            $('#submit_button').button();
            $('#' + form_id).saveMyForm();
            done();
        });
    });

    afterEach(function() {
        $('#' + form_id).remove();
    });

    it('has London checked when initially loaded', function() {
        expect($('#radio-1').is(':checked')).toEqual(false);
        expect($('#radio-2').is(':checked')).toEqual(false);
        expect($('#radio-3').is(':checked')).toEqual(true);
    });

    it('updates localStorage when radio option is changed', function() {
        expect(locSt('radio-input')).toEqual(null);
        $('#radio-2').click();
        expect(locSt('radio-input')).toEqual('Paris');
    });

    it('recalls the value from localStorage when page is reloaded', function() {
        expect($('#radio-1').is(':checked')).toEqual(false);
        expect($('#radio-2').is(':checked')).toEqual(true);
        expect($('#radio-3').is(':checked')).toEqual(false);
    });

    it('uses the name of an input as the input key', function() {
        expect(locSt('radio-input')).toEqual('Paris');
        expect(locSt('radio-2')).toEqual(null);
    });

    it('updates localStorage when a checkbox is clicked', function() {
        expect(locSt('checkbox-2')).toEqual(null);
        expect($('#checkbox-2').prop('checked')).toEqual(false);
        $('#checkbox-2')
            .data('uiCheckboxradio')
            .classesElementLookup['ui-button'].click();
        expect($('#checkbox-2').prop('checked')).toEqual(true);
        expect(locSt('checkbox-2')).toEqual(true);
    });

    it('updates localStorage when a select option is selected', function() {
        expect(locSt('speed_select')).toEqual(null);
        $('#speed_select')
            .val('Slower')
            .change();
        expect(locSt('speed_select')).toEqual('Slower');
    });

    it("doesn't update Selectmenu UI to reflect loacalStorage state when page is loaded", function() {
        var select_menu = $('#speed_select').data('uiSelectmenu');
        var displayedText = select_menu.classesElementLookup[
            'ui-selectmenu-text'
        ].text();
        expect(locSt('speed_select')).toEqual('Slower');
        expect(val('speed_select')).toEqual('Slower');
        expect(displayedText).toEqual('Medium');
    });

    it("doesn't update localStorage when the overlying UI option is clicked", function(done) {
        var select_menu = $('#speed_select').data('uiSelectmenu');
        $('#speed_select').change(function(e) {
            console.log(e);
        });
        select_menu.open();
        // needs to be hit to activate then wait 400ms
        var menuItem = select_menu.menu[0].children[3];
        menuItem.click();

        setTimeout(function() {
            menuItem.focus();
            menuItem.click();
            expect(val('speed_select')).toEqual('Fast');
            expect(locSt('speed_select')).toEqual('Slower');
            done();
        }, 400);
    });
});

describe('saveMyForm jquery-ui comaptibility - WITH custom_callback', function() {
    var form_id = 'jquery_ui_test';

    function val(field) {
        return $('#' + field).val();
    }

    function locSt(field) {
        return getLocalStorage(form_id + '_' + field);
    }

    beforeAll(function() {
        localStorage.clear();
    });

    afterAll(function() {});

    beforeEach(function(done) {
        jasmine.getFixtures().fixturesPath = 'base/spec/fixtures';
        loadFixtures('jquery_ui_form_with_custom_callbacks.html');
        $(function() {
            $('#speed_select').selectmenu();
            $('#' + form_id).saveMyForm();
            done();
        });
    });

    afterEach(function() {
        $('#' + form_id).remove();
    });

    it('updates localStorage when a select option is selected', function() {
        $('#speed_select')
            .val('Slower')
            .change();
        expect(locSt('speed_select')).toEqual('Slower');
    });

    it('DOES update Selectmenu UI to reflect loacalStorage state when page is loaded', function() {
        var select_menu = $('#speed_select').data('uiSelectmenu');
        var displayedText = select_menu.classesElementLookup[
            'ui-selectmenu-text'
        ].text();
        expect(locSt('speed_select')).toEqual('Slower');
        expect(val('speed_select')).toEqual('Slower');
        expect(displayedText).toEqual('Slower');
    });

    it('DOES update localStorage when the overlying UI option is clicked', function(done) {
        var select_menu = $('#speed_select').data('uiSelectmenu');
        $('#speed_select').change(function(e) {
            console.log(e);
        });
        select_menu.open();
        // needs to be hit to activate then wait 400ms
        var menuItem = select_menu.menu[0].children[3];
        menuItem.click();

        setTimeout(function() {
            menuItem.focus();
            menuItem.click();
            expect(val('speed_select')).toEqual('Fast');
            expect(locSt('speed_select')).toEqual('Fast');
            done();
        }, 400);
    });
});
