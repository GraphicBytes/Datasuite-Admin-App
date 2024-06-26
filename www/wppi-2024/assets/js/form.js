
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

    setSuccessStyle();

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