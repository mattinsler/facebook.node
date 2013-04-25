(function() {
  var Facebook, Rest,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Rest = require('rest.node');

  Facebook = (function(_super) {

    __extends(Facebook, _super);

    Facebook.hooks = {
      access_token: function(access_token) {
        return function(request_opts, opts) {
          var _ref;
          if ((_ref = request_opts.qs) == null) {
            request_opts.qs = {};
          }
          return request_opts.qs.access_token = access_token;
        };
      },
      opts_to_query_string: function(request_opts, opts) {
        var k, v, _ref, _results;
        if ((_ref = request_opts.qs) == null) {
          request_opts.qs = {};
        }
        _results = [];
        for (k in opts) {
          v = opts[k];
          _results.push(request_opts.qs[k] = v);
        }
        return _results;
      }
    };

    function Facebook(opts) {
      if (opts == null) {
        opts = {};
      }
      Facebook.__super__.constructor.call(this, {
        base_url: opts.base_url || 'https://graph.facebook.com'
      });
      if (opts.access_token != null) {
        this.hook('pre:request', Facebook.hooks.access_token(opts.access_token));
      }
      this.hook('pre:request', Facebook.hooks.opts_to_query_string);
    }

    Facebook.prototype.graph = function(path, opts, cb) {
      return this.get(path, opts, cb);
    };

    Facebook.prototype.post_graph = function(path, opts, cb) {
      return this.post(path, opts, cb);
    };

    Facebook.prototype.delete_graph = function(path, opts, cb) {
      return this["delete"](path, opts, cb);
    };

    Facebook.prototype.fql = function(query, cb) {
      if (typeof query !== 'string') {
        query = JSON.stringify(query);
      }
      return this.get('fql', {
        q: query
      }, cb);
    };

    return Facebook;

  })(Rest);

  module.exports = Facebook;

}).call(this);
