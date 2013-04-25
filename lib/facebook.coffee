Rest = require 'rest.node'

class Facebook extends Rest
  @hooks:
    access_token: (access_token) ->
      (request_opts, opts) ->
        request_opts.qs ?= {}
        request_opts.qs.access_token = access_token
    
    opts_to_query_string: (request_opts, opts) ->
      request_opts.qs ?= {}
      request_opts.qs[k] = v for k, v of opts
  
  constructor: (access_token) ->
    super(base_url: 'https://graph.facebook.com')
    
    @hook('pre:request', Facebook.hooks.access_token(access_token)) if access_token?
    @hook('pre:request', Facebook.hooks.opts_to_query_string)
  
  graph: (path, opts, cb) -> @get(path, opts, cb)
  post_graph: (path, opts, cb) -> @post(path, opts, cb)
  delete_graph: (path, opts, cb) -> @delete(path, opts, cb)
  
  fql: (query, cb) ->
    query = JSON.stringify(query) if typeof query is 'string'
    @get('fql', {q: query}, cb)

module.exports = Facebook
