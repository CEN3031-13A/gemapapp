(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController, '$location');

  function HomeController($location) {
    var vm = this;
    $location.path('/customers');
  }
}());
