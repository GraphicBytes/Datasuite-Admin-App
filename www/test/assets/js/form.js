
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
    
    // addEventListeners();

    // setSuccessStyle();

    // replaceSelects();

}


function addEventListeners() {

    // country change shows correct state dropdown
    // document.querySelector('#ppat-country').addEventListener('change', showCorrectStateSelect);  // if normal select
    $('#ppat-country').on('select2:select', showCorrectStateSelect);                                // if Select2

    // 'other' selection shows text field    
    // document.querySelectorAll('.ppat-select-country').forEach(el=>el.addEventListener('change', showOtherField));    // if select
    $('#ppat-country, #ppat-brands').on('select2:select select2:unselect', showOtherField);      // if Select2

    // front end validation
    document.querySelectorAll('input, select').forEach(el=>el.addEventListener('change', validate));
    
}


function showCorrectStateSelect() {
    // form and DB have different dropdowns for each country's set of states, so show the right one

    let country = document.querySelector('#ppat-country').value;    
    const allCountrySelects = document.querySelectorAll('.ppat-form-row-state_can, .ppat-form-row-state_mex, .ppat-form-row-state_usa');
    
    allCountrySelects.forEach(el=>el.classList.remove('show'));

    if(country == 'Canada') {
        document.querySelector('.ppat-form-row-state_can').classList.add('show');

    } else if(country == 'Mexico') {
        document.querySelector('.ppat-form-row-state_mex').classList.add('show');

    } else if(country == 'USA') {
        document.querySelector('.ppat-form-row-state_usa').classList.add('show');

    }   
}


function showOtherField(event) {

    let elem = event.target;  
    let otherField = elem.closest('.ppat-form-row').nextElementSibling;
    let isMulti = elem.name.includes('[');

    if(isMulti) {
        // multi Select2s - loop and look at text property

        for(const value of $(elem).select2('data')) {
            
            if(value.text.toLowerCase() == 'other') {                
                otherField.classList.add('show');
                break;
            }
                        
            otherField.classList.remove('show');               
        };

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
    // form built from database but add select2s after load

    // Single-selects
    $('#ppat-country, #ppat-purchase_frequency, #ppat-currently_use').select2({        
        minimumResultsForSearch: Infinity,                                          // hide search bar (method for single-selects)

    }); 
    // Single selects with alphabetical sorting
    $('#ppat-state_can, #ppat-state_mex, #ppat-state_usa').select2({        
        minimumResultsForSearch: Infinity,                                          // hide search bar (method for single-selects)
        sorter: data => data.sort((a, b) => a.text.localeCompare(b.text)),          // sort alphabetically
    }); 

    // Multi-selects    
    $('#ppat-brands').attr('name', $('#ppat-brands').attr('name') + '[]');         // add [] to name
    $('#ppat-brands').addClass('multiselect').select2({                             // init    
        placeholder: 'Select',
        multiple: true        
    });

    $('#ppat-brands').val(null).trigger("change");           // clear placeholder selection (glitch fix)
     
}