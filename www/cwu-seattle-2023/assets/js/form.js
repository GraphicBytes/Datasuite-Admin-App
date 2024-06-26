
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

    wrapErrors();

    addRadios();

    // tweak form at startup
    document.querySelector('.ppat-form-row-state_usa').classList.add('disable');

}


function wrapErrors() {
    // attempt to wrap error messages in another div for styling and hope it doesn't break functionality

    $('.ppat-field-feedback-msg').wrap(`<div class="feedback-msg-container"></div>`);
}


function addRadios() {
    // replace text field with radios

    let $elementToRemove = $('#ppat-creator_type');
    let name = $elementToRemove.attr('name');
    let classes = $elementToRemove.attr('class');
    let id = $elementToRemove.attr('id');

    // TO DO use classes and id or remove vars 
    
    $('#ppat-creator_type').replaceWith(`
        <div class="radio-option-container">
            <input type="radio" id="photographer" name="`+name+`" value="Photographer" class="ppat-radio">
            <label for="photographer" class="radio-label">Photographer</label>
        </div>
        <div class="radio-option-container">
            <input type="radio" id="videographer" name="`+name+`" value="Videographer" class="ppat-radio">
            <label for="videographer" class="radio-label">Videographer</label>
        </div>
        <div class="radio-option-container">
            <input type="radio" id="hybrid-creator" name="`+name+`" value="Hybrid Creator" class="ppat-radio">
            <label for="hybrid-creator" class="radio-label">Hybrid Creator</label>
        </div>
    `);


}


function addEventListeners() {

    // show correct select options
    // document.querySelector('#ppat-photo_or_video').addEventListener('change', showCorrectSelect);      // if normal select
    $('#ppat-country').on('select2:select', showCorrectSelect);                                      // if Select2

    // 'other' selection shows text field    
    $('#ppat-country, #ppat-camera_brands, #ppat-awareness_medium').on('select2:select select2:unselect', showOtherField);

    // front end validation
    document.querySelectorAll('input, select').forEach(el=>el.addEventListener('change', validate));
    
}


function showCorrectSelect() {
    // if USA selected, show that select element, etc    

    let country = document.querySelector('#ppat-country').value;    
    const allCountrySelects = document.querySelectorAll('.ppat-form-row-state_can, .ppat-form-row-state_mex, .ppat-form-row-state_usa');
    
    allCountrySelects.forEach(el=>el.classList.remove('show','disable'));

    if(country == 'Canada') {
        document.querySelector('.ppat-form-row-state_can').classList.add('show');

    } else if(country == 'Mexico') {
        document.querySelector('.ppat-form-row-state_mex').classList.add('show');

    } else if(country == 'USA') {
        document.querySelector('.ppat-form-row-state_usa').classList.add('show');

    } else if(country == 'Other') {
        document.querySelector('.ppat-form-row-state_usa').classList.add('show','disable');

    }
}


function showOtherField(event) {

    let elem = event.target;  
    let otherField = elem.closest('.ppat-form-row').nextElementSibling;
    let isMulti = elem.name.includes('[');

    if(isMulti) {
        // multi Select2s - loop and look at text property

        if( $(elem).select2('data').length > 0 ) {   

            for(const value of $(elem).select2('data')) {  

                if(value.text.toLowerCase() == 'other') {                
                    otherField.classList.add('show');
                    break;
                }
                     
                otherField.classList.remove('show');               
            };

        } else {
            otherField.classList.remove('show');
        }        

    } else {
        // single Select2s
        
        if(elem.value.toLowerCase() == 'other') {
            otherField.classList.add('show');
        } else {
            otherField.classList.remove('show');        
        }

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
    // - if any other field is shown, it's required

    let valid = true;
    let otherFieldRows = document.querySelectorAll('.ppat-text[id$="_other"]');

    console.log('otherFieldRows', otherFieldRows);

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

    // Multi-selects    
    $('#ppat-camera_brands').attr('name', 'camera_brands[]');        // add [] to name
    $('#ppat-camera_brands').addClass('multiselect').select2({      // init    
        placeholder: 'Select',
        multiple: true,
        dropdownCssClass: 'multi'
    });    
    $('#ppat-camera_brands').val(null).trigger("change");            // clear placeholder selection (glitch fix)
    $('#ppat-camera_brands').on('select2:change', validate);
    
    // Single selects
    $('#ppat-country, #ppat-state_usa, #ppat-state_can, #ppat-state_mex, #ppat-awareness_medium').select2({        
        minimumResultsForSearch: Infinity                           // turn off the search bar for single-selects
    });
    $('#ppat-country, #ppat-state_usa, #ppat-state_can, #ppat-state_mex, #ppat-awareness_medium').on('select2:change', validate);
    
}