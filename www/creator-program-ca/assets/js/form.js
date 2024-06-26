
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

    styleLabels();

}


function addEventListeners() {

    // 'other' selection shows text field    
    $('#ppat-genre_video, #ppat-genre_still, #ppat-genre_both, #ppat-camera_brand').on('select2:select', showOtherField);

    // front end validation
    document.querySelectorAll('input').forEach(el=>el.addEventListener('change', validate));
    
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

    let submitY = document.querySelector('#ppat-submit').getBoundingClientRect().y - 1000;

    var style = document.createElement('style');
    style.innerHTML =
        '.ppat-field-feedback-msg-complete {' +
            'margin-top: '   + submitY + 'px;' +
        '}';

    var firstScriptTag = document.querySelector('script');
    firstScriptTag.parentNode.insertBefore(style, firstScriptTag);
}


function validate() {
    /* custom frontend validation requirements:
     *  - at least one phone field filled
     *  - ...but landline is split into two, so either (both of those) or (mobile)
     */
    
    let valid = false;
    let landline_filled = (($('#ppat-phone_area').val() != '') && ($('#ppat-phone_number').val() != ''));
    let mobile_filled = $('#ppat-mobile').val() != '';
    let all_phone_fields = $('#ppat-phone_area, #ppat-phone_number, #ppat-mobile');

    // calculate validity
    if(landline_filled || mobile_filled) {
        valid = true;
    }

    // update UI of fields and submit button
    if(valid) {
        all_phone_fields.removeClass('field-error');
    } else {
        all_phone_fields.addClass('field-error');
    }

    document.querySelector('.ppat-submit').disabled = !valid;

}


function replaceSelects() {
    // form build from database but add Select2s after load

    // Multi-selects (if required)    
    $('#ppat-gear').attr('name', 'gear[]');              // add [] to name
    $('#ppat-gear').addClass('multiselect').select2({    // init    
        placeholder: 'Select',
        multiple: true        
    });
    
    $('#ppat-gear').val(null).trigger("change");           // clear placeholder selection (glitch fix)
     


    // Single selects (if required)
    /*
    $('#ppat-state, #ppat-photo_or_video, #ppat-genre_video, #ppat-genre_still, #ppat-genre_both, #ppat-camera_brand').select2({        
        minimumResultsForSearch: Infinity                       // turn off the search bar for single-selects
    });    
    */
    
}


function styleLabels() {
    // wrap a span around labels' * to allow them to be a different colour
    $('label').each(function() {
        if(this.innerHTML.includes('*') && !this.classList.contains('ppat-form-label-terms')) {            
            this.innerHTML = this.innerHTML.replace('*', '<span class="asterisk">*</span');
        }
    });
}