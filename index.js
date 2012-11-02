var util = require('util'),
    Rest = require('rest.node');

function Facebook(key) {
  Rest.call(this, 'https://graph.facebook.com');
  this.key = key;
}

util.inherits(Facebook, Rest);

urlencode = function(val, prefix) {
  var arr, k, v;
  if (prefix == null) {
    prefix = '';
  }
  arr = [];
  for (k in val) {
    v = val[k];
    if ((prefix != null) && prefix !== '') {
      k = "" + prefix + "[" + k + "]";
    }
    if (Array.isArray(v)) {
      Array.prototype.push.apply(arr, v.map(function(i, idx) {
        return "" + k + "[" + idx + "]=" + (encodeURIComponent(i));
      }));
    } else if (typeof v === 'object' && Object.prototype.toString(v) === '[object Object]') {
      arr.push(urlencode(v, k));
    } else {
      arr.push(k + '=' + encodeURIComponent(v));
    }
  }
  return arr.join('&');
};

Facebook.prototype.createQuerystring = function(opts) {
  return urlencode(opts);
};

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

Facebook.prototype.fql = function(query, callback) {
  var q = typeof(query) === 'string' ? query : JSON.stringify(query);
  this.get('fql', {access_token: this.key, q: q}, callback);
};

module.exports = Facebook;
