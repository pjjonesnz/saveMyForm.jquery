describe('saveMyForm', function() {
    var form_id = 'my_form';

    function getLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    beforeAll(function() {
        localStorage.clear();
    });

    afterAll(function() {
    });

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
        expect(getLocalStorage(form_id + '_text_input')).toEqual('happy');
    });

    it('automatically loads text_input when page is reloaded', function() {
        expect($('#text_input').val()).toEqual('happy');
    });

    it("doesn't update localStorage on programmatic field update if change() isn't triggered", function() {
        $('#text_input').val('');
        expect(getLocalStorage(form_id + '_text_input')).toEqual('happy');
    });

    it("it updates localStorage when keypress is triggered after debounce time", function(done) {
        var input = $('#text_input');
        input.val('joyful');
        var e = $.Event('keyup');
        e.which = 65;
        input.trigger(e);
        expect(getLocalStorage(form_id + '_text_input')).not.toEqual('joyful');
        setTimeout(function() {
            expect(getLocalStorage(form_id + '_text_input')).toEqual('joyful');
            done(); // call this to finish off the it block
        }, 501);
    });

    it("saves random characters correctly in localStorage", function() {
        var string = '~!@#$%^&*X#123456;&amp;"';
        $('#text_input').val(string).change();
        expect(getLocalStorage(form_id + '_text_input')).toEqual(string);
    });

    it('loads random characters correctly after page reload', function() {
        var string = '~!@#$%^&*X#123456;&amp;"';
        expect($('#text_input').val()).toEqual(string);
    });

    it("doesn't save linebreaks in text input fields", function() {
        var test = "Sad\nand\nLonely";
        var expect_save = 'SadandLonely';
        $('#text_input').val(test).change();
        expect(getLocalStorage(form_id + '_text_input')).toEqual(expect_save);
    })

    it('saves linebreaks correctly in textareas', function() {
        var test = "Sad\nand\nLonely";
        $('#textarea_field').val(test).change();
        expect(getLocalStorage(form_id + '_textarea_field')).toEqual(test);
    })

});
