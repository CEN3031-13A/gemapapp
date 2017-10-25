(function () {
  'use strict';

  angular
    .module('customers.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.customers', {
        abstract: true,
        url: '/customers',
        template: '<ui-view/>'
      })
      .state('admin.customers.list', {
        url: '',
        templateUrl: '/modules/customers/client/views/admin/list-customers.client.view.html',
        controller: 'CustomersAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.customers.create', {
        url: '/create',
        templateUrl: '/modules/customers/client/views/admin/form-customer.client.view.html',
        controller: 'CustomersAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          customerResolve: newCustomer
        }
      })
      .state('admin.customers.edit', {
        url: '/:customerId/edit',
        templateUrl: '/modules/customers/client/views/admin/form-customer.client.view.html',
        controller: 'CustomersAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ customerResolve.title }}'
        },
        resolve: {
          customerResolve: getCustomer
        }
      });
  }

  getCustomer.$inject = ['$stateParams', 'CustomersService'];

  function getCustomer($stateParams, CustomersService) {
    return CustomersService.get({
      customerId: $stateParams.customerId
    }).$promise;
  }

  newCustomer.$inject = ['CustomersService'];

  function newCustomer(CustomersService) {
    return new CustomersService();
  }
}());
