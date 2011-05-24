var util = require('util'),
    _ = require('underscore'),
    AbstractApi = require('abstract-api');

function Facebook(key) {
  AbstractApi.call(this, 'https://graph.facebook.com');
  this.key = key;
}

util.inherits(Facebook, AbstractApi);

Facebook.prototype.setRequestOptions = function(options, httpMethod, method, params) {
  options.method = httpMethod;
  options.uri.pathname += method;
  options.headers = _.extend(options.headers || {}, {
    Accept: 'application/json'
  });
  _.extend(options.uri.query, params);
  
  return options;
};

// paging (limit,offset / until,since)
Facebook.prototype.graph = function(id, connection, options, itemCallback, completionCallback) {
  completionCallback = arguments[arguments.length - 1];
  itemCallback = arguments[arguments.length - 2];
  
  var method = id;
  if (arguments.length === 3) {
    options = {};
  } else if (arguments.length === 4) {
    if (_.isObject(arguments[1])) {
      options = arguments[1];
    } else {
      method += '/' + arguments[1];
    }
  }
  
  options.access_token = this.key;
  this.get(method, options, function(err, data) {
    var count = 0;
    if (!err) {
      if (_.isArray(data.data)) {
        _.each(data.data, function(item, index, list) { ++count; itemCallback(item, index, list); });
      } else {
        ++count;
        itemCallback(data.data);
      }
    }
    completionCallback && completionCallback(err, count);
  });
};

module.exports = Facebook;