'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Customers Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/customers',
      permissions: '*'
    }, {
      resources: '/api/customers/:customerId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/customers',
      permissions: '*'
    }, {
      resources: '/api/customers/:customerId',
      permissions: '*'
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/customers',
      permissions: '*'
    }, {
      resources: '/api/customers/:customerId',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Customers Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];
  console.log("YEEEEEP")
  // If an Customer is being processed and the current user created it then allow any manipulation
  if (req.customer && req.user && req.customer.user && req.customer.user.id === req.user.id) {
    return next();
  }

  // Check for user 
  return next();
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
