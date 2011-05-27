var util = require('util'),
    _ = require('underscore'),
    AbstractApi = require('abstract-api');

function Facebook(key) {
  AbstractApi.call(this, 'https://graph.facebook.com');
  this.key = key;
}

util.inherits(Facebook, AbstractApi);

// paging (limit,offset / until,since)
Facebook.prototype.graph = function(method, options, callback) {
  if (_.isFunction(options)) {
    callback = options;
    options = {};
  }
  
  options.access_token = this.key;
  this.get(method, options, callback);
};

Facebook.prototype.graphEach = function(method, options, itemCallback, completionCallback) {
  if (_.isFunction(options)) {
    completionCallback = itemCallback;
    itemCallback = options;
    options = {};
  }
  
  this.graph(method, options, function(err, data) {
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