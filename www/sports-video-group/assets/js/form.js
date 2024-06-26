
const firstFieldName = 'name';  // string - name of any field in the form to check whether form has loaded


document.addEventListener('DOMContentLoaded', function() {

    // start interval to check form is loaded
    checkInterval = window.setInterval(checkFormLoaded, 100);

});


function checkFormLoaded() {

    // if loaded, add event listeners and clear interval
    if(document.querySelector('#ppat-' + firstFieldName) != null) {
        formLoaded();
        clearInterval(checkInterval);
    } else {
        // console.log('not loaded');
    }
    
}


function formLoaded() {
    // form has loaded so use this as a doc ready

    addEventListeners();

    setSuccessStyle();

    replaceSelects();

}


function addEventListeners() {

    // front end validation
    // document.querySelectorAll('input, select, textarea').forEach(el=>el.addEventListener('change', validate));
    
}


function setSuccessStyle() {
    // set success message style to position in same place as submit button

    let submitY = document.querySelector('#ppat-submit').getBoundingClientRect().y;

    var style = document.createElement('style');
    style.innerHTML =
        '.ppat-field-feedback-msg-complete {' +
            'margin-top: '   + submitY + 'px;' +
        '}';

    var firstScriptTag = document.querySelector('script');
    firstScriptTag.parentNode.insertBefore(style, firstScriptTag);

}


function validate() {

    // console.log('validate');

}


function replaceSelects() {
    // form build from database but add multi-selects after load

    // Multi-selects
    const multiSelectFieldNames = ['other_products'];

    multiSelectFieldNames.forEach(function(name, i) {
        const el = $('#ppat-' + name);

        // - rename to handle multi selects without ugly name in system
        el.attr('name', name + '[]');                                     
        
        // - init & add validation on select
        el.addClass('multiselect').select2({        
            placeholder: 'Select',
            multiple: true,
            maximumSelectionLength: 3
        }).on('select2:select', function (e) {
            validate();
        });

        // - clear pre-selected first option - not sure why it does that
        el.val(null).trigger("change");  
        
    });


    // Single-selects (also select2 to match the multi)
    const sglSelectFieldNames = ['team_size'];

    sglSelectFieldNames.forEach(function(name) {

        const el = $('#ppat-' + name);

        // - init & add validation on select
        el.select2({        
            minimumResultsForSearch: Infinity,             // turn off the search bar for single-selects
        }).on('select2:select', function (e) {
            validate();
        });
    });    
}