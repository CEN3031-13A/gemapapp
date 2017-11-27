(function (app) {
  'use strict';

  app.registerModule('customers');
}(ApplicationConfiguration));

function toggleRightSideBar() {
  console.log("HELPS")
  var x = document.getElementById('hide');
  var y = document.getElementById('MAP_MARKERS');
  var z = document.getElementById('STEPS');
  if (x.style.display === 'block') {
    x.style.display = 'none';
    document.getElementById('MAP_MARKERS').className = "u-5/6";
    document.getElementById('MAP_MARKERS').style.right = "0";
    document.getElementById("STEPS").className = "u-5/6";
    document.getElementById('STEPS').style.right = "0";
  } else {
    x.style.display = 'block';
    document.getElementById('MAP_MARKERS').className = "u-4/6";
    document.getElementById('MAP_MARKERS').style.right = "16.6666667%";
    document.getElementById("STEPS").className = "u-4/6";
    document.getElementById('STEPS').style.right = "16.6666667%";
  }
}