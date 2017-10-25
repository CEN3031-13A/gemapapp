(function () {
  'use strict';

  // Configuring the Customers Admin module
  angular
    .module('customers.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Customers',
      state: 'admin.customers.list'
    });
  }
}());
