/*
 *  Basic build
  *     - no Select2s
  *     - no other fields
  *     - no front end validation
 */

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

    wrapErrors();

}


function wrapErrors() {
    // attempt to wrap error messages in another div for styling and hope it doesn't break functionality

    $('.ppat-field-feedback-msg').wrap(`<div class="feedback-msg-container"></div>`);
}


function addEventListeners() {

    // front end validation
    // document.querySelectorAll('input, select').forEach(el=>el.addEventListener('change', validate));
    
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





