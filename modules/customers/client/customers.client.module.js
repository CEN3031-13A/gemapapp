(function (app) {
  'use strict';

  app.registerModule('customers');
}(ApplicationConfiguration));

function myFunction() {
  var x = document.getElementById('hide');
  if (x.style.display === 'none') {
    x.style.display = 'block';
  } else {
    x.style.display = 'none';
  }
}
