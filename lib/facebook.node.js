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

function Promise(client, method) {
  this.client = client;
  this.method = method;
  this.options = {
    access_token: this.client.key
  };
}
Promise.prototype.offset = function(offset) {
  this.options.offset = offset;
  return this;
}
Promise.prototype.limit = function(limit) {
  this.options.limit = limit;
  return this;
}
Promise.prototype.since = function(since) {
  this.options.since = since;
  return this;
}
Promise.prototype.until = function(until) {
  this.options.until = until;
  return this;
}
Promise.prototype.forEach = function(itemCallback, completionCallback) {
  this.client.get(this.method, this.options, function(err, data) {
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
}

// paging (limit,offset / until,since)
Facebook.prototype.graph = function(id, connection, callback) {
  var method = id;
  if (typeof(connection) === 'string') {
    method += '/' + connection;
  } else {
    callback = connection;
  }
  
  return new Promise(this, method);
};

module.exports = Facebook;