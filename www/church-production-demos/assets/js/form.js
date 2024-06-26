
document.addEventListener('DOMContentLoaded', function() {

    // start interval to check form is loaded
    checkInterval = window.setInterval(checkFormLoaded, 100);

});


function checkFormLoaded() {

    // if loaded, add event listeners and clear interval
    if(document.querySelector('#ppat-country') != null) {
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

    // country change shows correct state dropdown
    // document.querySelector('#ppat-country').addEventListener('change', showCorrectStateSelect);  // if normal select
    $('#ppat-country').on('select2:select', showCorrectStateSelect);                                // if Select2

    // 'other' selection shows text field    
    // document.querySelectorAll('.ppat-select-country').forEach(el=>el.addEventListener('change', showOtherField));
    $('#ppat-country').on('select2:select', showOtherField);

    // front end validation
    document.querySelectorAll('input, select').forEach(el=>el.addEventListener('change', validate));
    
}


function showCorrectStateSelect() {
    // if USA selected, show that select element, etc    

    let country = document.querySelector('#ppat-country').value;    
    const allCountrySelects = document.querySelectorAll('.ppat-form-row-state_can, .ppat-form-row-state_mex, .ppat-form-row-state_usa');
    const canSelect = document.querySelector('.ppat-form-row-state_can');
    const mexSelect = document.querySelector('.ppat-form-row-state_mex');
    const usaSelect = document.querySelector('.ppat-form-row-state_usa');
    
    allCountrySelects.forEach(el=>el.classList.remove('show'));

    if(country == 'Canada') {
        canSelect.classList.add('show');

    } else if(country == 'Mexico') {
        document.querySelector('.ppat-form-row-state_mex').classList.add('show');

    } else if(country == 'USA') {
        document.querySelector('.ppat-form-row-state_usa').classList.add('show');

    }   
}


function showOtherField(event) {

    let elem = event.target;  
    let otherField = elem.closest('.ppat-form-row').nextElementSibling;

    if(elem.value == 'Other') {
        otherField.classList.add('show');
    } else {
        otherField.classList.remove('show');        
    }

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

    let valid = true;
    let otherFields = document.querySelectorAll('.ppat-text[id$="_other"]');

    otherFields.forEach(function(otherField) {
        if(otherField.closest('.ppat-form-row').classList.contains('show') && otherField.value == '') {
            otherField.classList.add('error');
            valid = false;
        } else {
            otherField.classList.remove('error');
        }
    });

    document.querySelector('.ppat-submit').disabled = !valid;

}


function replaceSelects() {
    // form build from database but add multi-selects after load

    // Lenses - Needs to be a multi-select
    $('#ppat-lenses').attr('name', 'lenses[]');                                     // rename so it can handle multi selects without having ugly name in system
    $('#ppat-lenses').addClass('multiselect').select2({        
        placeholder: 'Select',
        multiple: true        
    });
    $('#ppat-lenses').val(null).trigger("change");                                  // clear pre-selected first option - not sure why it does that


    // Country and States - Single-select to match the multi
    $('#ppat-country, #ppat-state_can, #ppat-state_mex, #ppat-state_usa').select2({        
        minimumResultsForSearch: Infinity                                           // turn off the search bar for single-selects
    });    
    
}