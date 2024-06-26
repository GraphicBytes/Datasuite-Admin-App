
const check_field = 'name';     // name of any field to check for to see when form is loaded

document.addEventListener('DOMContentLoaded', function() {

    // start interval to check form is loaded
    checkInterval = window.setInterval(checkFormLoaded, 100);

});


function checkFormLoaded() {

    // if loaded, add event listeners and clear interval
    if(document.querySelector('#ppat-' + check_field) != null) {
        // console.log('loaded');
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

    // show correct select options
    // document.querySelector('#ppat-photo_or_video').addEventListener('change', showCorrectSelect);        // if normal select
    $('#ppat-photo_or_video').on('select2:select', showCorrectSelect);                                      // if Select2

    // 'other' selection shows text field    
    $('#ppat-genre_video, #ppat-genre_still, #ppat-genre_both, #ppat-camera_brand').on('select2:select', showOtherField);

    // front end validation
    document.querySelectorAll('input, select').forEach(el=>el.addEventListener('change', validate));
    
}


function showCorrectSelect() {
    // show appropriate select element

    let selection = document.querySelector('#ppat-photo_or_video').value;    
    const allRows = document.querySelectorAll('.ppat-form-row-genre_video, .ppat-form-row-genre_still, .ppat-form-row-genre_both');
    const vidRow = document.querySelector('.ppat-form-row-genre_video');
    const stillRow = document.querySelector('.ppat-form-row-genre_still');
    const bothRow = document.querySelector('.ppat-form-row-genre_both');
    
    allRows.forEach(el=>el.classList.remove('show'));

    if(selection == 'Video') {
        vidRow.classList.add('show');

    } else if(selection == 'Photography') { // value matches existing Adestra data not label
        stillRow.classList.add('show');

    } else if(selection == 'Both') {
        bothRow.classList.add('show');
    }
}


function showOtherField(event) {

    let elem = event.target;  

    // if other is always the next field:
    /*
     *   let otherFieldRow = elem.closest('.ppat-form-row').nextElementSibling;
     */

    // for this form we have 2 other fields to show for 4 selects:
    let otherFieldRow;
    if(elem.id.indexOf('genre') != -1) {
        otherFieldRow = document.querySelector('.ppat-form-row-genre_other');
    } else {
        otherFieldRow = elem.closest('.ppat-form-row').nextElementSibling;
    }

    if(elem.value == 'Other') {
        otherFieldRow.classList.add('show');
    } else {
        otherFieldRow.classList.remove('show');        
    }

}


function setSuccessStyle() {
    // set success message style to position in same place as submit button

    let submitY = document.querySelector('#ppat-submit').getBoundingClientRect().y - 200;

    var style = document.createElement('style');
    style.innerHTML =
        '.ppat-field-feedback-msg-complete {' +
            'margin-top: '   + submitY + 'px;' +
        '}';

    var firstScriptTag = document.querySelector('script');
    firstScriptTag.parentNode.insertBefore(style, firstScriptTag);

}


function validate() {

    let valid = true;
    let otherFieldRows = document.querySelectorAll('.ppat-text[id$="_other"]');

    otherFieldRows.forEach(function(otherFieldRow) {
        if(otherFieldRow.closest('.ppat-form-row').classList.contains('show') && otherFieldRow.value == '') {
            otherFieldRow.classList.add('error');
            valid = false;
        } else {
            otherFieldRow.classList.remove('error');
        }
    });

    document.querySelector('.ppat-submit').disabled = !valid;

}


function replaceSelects() {
    // form build from database but add Select2s after load

    // Multi-selects (if required)
    /*
     * $('#ppat-lenses').attr('name', 'lenses[]');              // add [] to name
     *
     * $('#ppat-lenses').addClass('multiselect').select2({      // init    
     *   placeholder: 'Select',
     *   multiple: true        
     * });
     * 
     * $('#ppat-lenses').val(null).trigger("change");           // clear placeholder selection (glitch fix)
     */


    // Single selects
    $('#ppat-state, #ppat-photo_or_video, #ppat-genre_video, #ppat-genre_still, #ppat-genre_both, #ppat-camera_brand').select2({        
        minimumResultsForSearch: Infinity                       // turn off the search bar for single-selects
    });    
    
}