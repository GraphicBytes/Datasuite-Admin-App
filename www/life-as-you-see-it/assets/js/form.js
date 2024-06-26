/*
 *  NHS 75
 */


const dev = false;                   // boolean - dev/live switch, used for dropzones and possibly more
const form_id = '69';               // string - ID of form in DB, used for submission
const check_field = 'email';         // string - name of any field to check for to see when form is loaded

var domain = 'https://datasuite.com';
if (dev) {
  domain = 'https://datasuite-api.bright-staging.uk';
}




document.addEventListener('DOMContentLoaded', function () {

  // start interval to check form is loaded
  checkInterval = window.setInterval(checkFormLoaded, 100);

});


function checkFormLoaded() {

  // if loaded, add event listeners and clear interval
  if (document.querySelector('#ppat-' + check_field) != null) {
    // console.log('loaded');
    formLoaded();
    clearInterval(checkInterval);
  } else {
    // console.log('not loaded');
  }

}





function formLoaded() {
  // form has loaded so use this as a doc ready
  // console.log('formLoaded');

  editFormMarkup();

  initMultipleDropzones();

  addEventListeners();

  // checkCookies();

}





function addEventListeners() {

  var form = document.querySelector('#ppat-form');

  // front end validation
  form.querySelectorAll('input, select, textarea').forEach(el => el.addEventListener('change', validate));

  // scroll buttons
  // document.querySelectorAll('.button.scroll-to').forEach(el => el.addEventListener('click', scrollToTarget));

  // accordion
  document.querySelectorAll('.accordion-tile').forEach(el => el.addEventListener('click', clickAccordionTile));
  document.querySelectorAll('.accordion .next').forEach(el => el.addEventListener('click', clickAccordionNext));

  // cookie functionality for tracking
  // document.querySelector('.cookie-popup .accept').addEventListener('click', acceptCookies);
  // document.querySelector('.cookie-popup .close').addEventListener('click', closeCookiePopup);

  // checkbox label
  document.querySelectorAll('.ppat-form-row-checkbox label').forEach(el => el.addEventListener('click', clickCheckboxLabel));

}


function validate() {
  console.log('validate');

  /* Eliminate system bug of uploading images each time submit is clicked even if form is invalid
   *  by keeping submit disabled until valid.
   *
   * Valid = all general required fields, at least one image present, and where an image is present, its required text fields.
  */

  let valid = true;
  let dzFilled = 0;

  // vars for generic fields only, not image-specific ones
  let requiredTextFields = document.querySelectorAll('#ppat-first_name, #ppat-last_name, #ppat-email');
  let requiredCheckboxes = document.querySelectorAll('#ppat-terms_1, #ppat-terms_2');

  // required text fields
  requiredTextFields.forEach(function (textField) {
    if (textField.value == '') {
      textField.classList.add('error');
      valid = false;

    } else {
      textField.classList.remove('error');
      textField.previousElementSibling.previousElementSibling.classList.remove('ppat-field-error');
    }
  });

  // required checkboxes
  requiredCheckboxes.forEach(function (checkbox) {
    if (checkbox.checked == false) {
      valid = false;
      checkbox.classList.add('error');
    } else {
      checkbox.classList.remove('error');
    }
  });


  // Ensure required text fields are filled for each image present,
  // and also that at least one image is entered. 
  $('.ppat-dropzone').each(function () {

    // grab all image-specific required fields
    const dzWord = $(this).closest('.ppat-form-row').next().next().next('.ppat-form-row-textfield').find('input');
    const dzInputs = [dzWord];

    if (this.dropzone.files.length > 0) {

      dzInputs.forEach(function (dzInput) {
        if (dzInput.val() == '') {
          dzInput.addClass('error');
          valid = false;
        } else {
          dzInput.removeClass('error');
        }
      });

      dzFilled++;     // count filled dropzones


    } else {
      // image not present so no need to force text fields to be required

      dzInputs.forEach(function (dzInput) {
        dzInput.removeClass('error');
      });
    }


  });


  // TO DO - ensure an image field is filled
  if (dzFilled == 0) {
    valid = false;
  }

  // apply disabled state
  document.querySelector('.ppat-submit').disabled = !valid;

}


function initMultipleDropzones() {
  // Because multiple dropzones aren't init'ed properly by the get code, init them here.

  const maxFilesAllowed = 1;
  const fileTypesAllowed = '.jpg, .jpeg';

  $('.ppat-dropzone').each(function () {

    // destroy the single dz automatically init'ed so when we custom init them they all behave the same
    if (this.dropzone) {
      this.dropzone.destroy();
    }

    // init
    let dz = $(this).dropzone({
      url: domain + '/image_upload/' + form_id + '/',
      maxFiles: maxFilesAllowed,
      maxFilesize: 10, // MB even though docs say b
      addRemoveLinks: true,
      acceptedFiles: fileTypesAllowed,
      // chunking: true,
      // retryChunks: true,
      // retryChunksLimit: 5,
      headers: {
        'Cache-Control': null,
        'X-Requested-With': null,
      },
      removedfile: function (file) {

        // use first stored filename, then remove it and update storage
        console.log($(this.element));
        const dzContainer = $(this.element).closest('.accordion');
        let storedNames = JSON.parse(dzContainer.attr('data-filenames'));
        let name = storedNames[0];
        storedNames.shift();
        dzContainer.attr('data-filenames', JSON.stringify(storedNames));

        $.ajax({
          url: domain + '/image_delete/' + form_id + '/',
          type: 'POST',
          data: {
            "name": name,
            "csrf_token": $('.csrf_token-' + form_id).attr('value'),
            "session": $('.session-' + form_id).attr('value')
          },
          success: function (data) {
          }
        });
        var _ref;
        return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
      },
      sending: function (file, xhr, formData) {
        formData.append("csrf_token", $('.csrf_token-' + form_id + '').attr('value'));
        formData.append("session", $('.session-' + form_id + '').attr('value'));
      },
      success: function (file, response) {
        var imgName = response;
        file.previewElement.classList.add("dz-success");
      },
      error: function (file, response) {
        file.previewElement.classList.add("dz-error");
      },
      renameFile: function (file) {
        console.log('renameFile');

        const oldName = file.name;
        const i = oldName.lastIndexOf('.');
        const dzContainer = this.dzElement.closest('.accordion');
        const cat = dzContainer.attr('data-cat');
        const addition = '-' + cat + '-' + Date.now();

        let newName = oldName.substring(0, i) + addition + oldName.substring(i);
        console.log('newName', newName);

        // also store in a list for when files are removed
        let storedNames = (dzContainer.attr('data-filenames')) ? JSON.parse(dzContainer.attr('data-filenames')) : [];
        storedNames.push(newName);
        dzContainer.attr('data-filenames', JSON.stringify(storedNames));

        return newName;

      },
      dzElement: $(this)  // added reference to element for access from within event handlers (eg. renameFile)
    });

    // also force frontend validation to run when files are added & removed
    dz[0].dropzone.on('addedfile', function (file) {

      // (if uploading over the max, replace them instead of adding dead ones)
      if (this.files.length > maxFilesAllowed) {
        dz[0].dropzone.removeFile(this.files[0]);
      }

      validate();

    }).on('removedfile', function () {
      // console.log('also this removedfile');
      validate();
    });

  });

}

/*
function scrollToTarget() {
    const targetEl = document.getElementById(this.dataset.elId);
    targetEl.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
}
*/


function editFormMarkup() {
  // Take generated form markup and edit for this design.
  // This design requires wrapping groups of fields in accordion elements.

  const catNames = ['First_image', 'Second_image', 'Third_image', 'Fourth_image', 'Fifth_image'];
  const nextBtnTxt = 'Upload another image';
  const dropzoneLabel = ''; // image label hidden

  // wrap in accordion
  $('.ppat-form-row-dropzone').each(function (i) {

    let firstClass = (i == 0) ? 'open' : '';
    let accordionMarkup = `<div class="accordion ` + firstClass + `">
                                    <div class="accordion-content">
                                        <div class="accordion-fields"></div>
                                    </div>
                                </div>;`;

    let elsToGoIn = $($(this).nextUntil('.ppat-form-row-textfield[class*="camera_"]').addBack().next().addBack());

    elsToGoIn.wrapAll(accordionMarkup);

  });

  // then add to accordion    
  $('.accordion').each(function (i, el) {
    let numAccordions = $('.accordion').length;
    let catNameUI = catNames[i].replace('_', ' ');
    let topMarkup = `<div class="accordion-tile">
                            <h5>`+ catNameUI + `</h5>
                        </div>`;

    let bottomMarkup = (i < numAccordions - 1) ? `<div class="button light next">` + nextBtnTxt + `</div>` : '';

    $(this).prepend(topMarkup);
    $(this).find('.accordion-content').append(bottomMarkup);
    $(this).attr('data-cat', catNames[i]);
  });

  // also replace dropzone labels which aren't working from the DB
  $('.ppat-form-label-cf-upload').html(dropzoneLabel);

}



function clickAccordionTile() {

  const accordion = $(this).closest('.accordion');

  if (accordion.hasClass('open')) {
    accordion.removeClass('open');
  } else {
    $('.accordion').removeClass('open');
    accordion.addClass('open');
  }

}



function clickAccordionNext() {
  $(this).closest('.accordion').removeClass('open');
  $(this).closest('.accordion').next('.accordion').addClass('open');
}



function clickCheckboxLabel(e) {
  // toggle checked state of checkbox

  if (e.target.tagName == 'A') {
    // skip when clicking on links within the label
    return false;
  }

  const checkbox = $(this).siblings('input[type="checkbox"]');
  checkbox.prop("checked", !checkbox.prop("checked"));

  // also update the validity of the form
  validate();

}
