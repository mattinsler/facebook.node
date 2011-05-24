var util = require('util'),
    _ = require('underscore'),
    AbstractApi = require('abstract-api');

function Facebook(key) {
  AbstractApi.call(this, 'https://graph.facebook.com');
  this.key = key;
}

util.inherits(Facebook, AbstractApi);

// paging (limit,offset / until,since)
Facebook.prototype.graph = function(id, connection, options, callback) {
  callback = arguments[arguments.length - 1];
  
  var method = id;
  if (arguments.length === 2) {
    options = {};
  } else if (arguments.length === 3) {
    if (_.isString(arguments[1])) {
      method += '/' + arguments[1];
    } else {
      options = arguments[1];
    }
  }
  
  options.access_token = this.key;
  this.get(method, options, callback);
};

Facebook.prototype.graphEach = function(id, connection, options, itemCallback, completionCallback) {
  this.graph(id, connection, options, function(err, data) {
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