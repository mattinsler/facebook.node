var util = require('util'),
    Rest = require('rest.node');

function Facebook(key) {
  Rest.call(this, 'https://graph.facebook.com');
  this.key = key;
}

util.inherits(Facebook, Rest);

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

module.exports = Facebook;