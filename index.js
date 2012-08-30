var util = require('util'),
    Rest = require('rest.node');
    _ = require('underscore');

function Facebook(key) {
  Rest.call(this, 'https://graph.facebook.com');
  this.key = key;
}

util.inherits(Facebook, Rest);

Facebook.prototype.convertArray = function(name, array) {
  var h = {};
  for (var i = 0; i < array.length; i++ ) {
    h[name + "[" + i + "]"] = array[i];
  }
  return h;
}

// paging (limit,offset / until,since)
Facebook.prototype.graph = function(method, options, callback) {
  if ('function' === typeof(options)) {
    callback = options;
    options = {};
  }

  options.access_token = this.key;
  this.get(method, options, callback);
};

Facebook.prototype.delete_graph = function(method, options, callback) {
  if ('function' === typeof(options)) {
    callback = options;
    options = {};
  }

  options.access_token = this.key;
  this.delete(method, options, callback);
};

Facebook.prototype.post_graph = function(method, options, callback) {
  if ('function' === typeof(options)) {
    callback = options;
    options = {};
  }

  if (typeof (options) === "object") {
    var self = this;
    _.each(_.keys(options), function(key) {
      if (_.isArray(options[key])){
        var converted =  self.convertArray(key, options[key]);
        delete options[key];
        _.extend(options, converted);
      }
    });
  }

  options.access_token = this.key;
  this.post(method, options, callback);
};

Facebook.prototype.graph_each = function(method, options, itemCallback, completionCallback) {
  if ('function' === typeof(options)) {
    completionCallback = itemCallback;
    itemCallback = options;
    options = {};
  }

  this.graph(method, options, function(err, data) {
    var count = 0;
    if (!err) {
      if (data.data instanceof Array) {
        for (; count < data.data.length; ++count) {
          itemCallback(data.data[count], count, data.data);
        }
      } else {
        ++count;
        itemCallback(data.data);
      }
    }
    completionCallback && completionCallback(err, count);
  });
};

Facebook.prototype.fql = function(query, callback) {
  var q = typeof(query) === 'string' ? query : JSON.stringify(query);
  this.get('fql', {access_token: this.key, q: q}, callback);
};


module.exports = Facebook;
