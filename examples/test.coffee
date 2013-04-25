Facebook = require '../lib/facebook'

# client = new Facebook('AAACEdEose0cBAPO2qSbBjUnAbH9We925niW90A1ZC0DjxUou2usXffyOz3thRArlR9kYdfdB88MPL9xkIqGV8qgZCJpnZAq2CqljvD9ogZDZD')
client = new Facebook('AAAB4yaKASBABALHXr4ElkcZCE6enJOmpbpPzfyhbntGQnxKuS8QsiHok7tA7XIfkyPOpxGDCHxQDaIYwki8xG1vLBqN6OLoMI0yiikAZDZD')

# client.graph 'pagelever/posts', {limit: 2}, (err, data) ->
#   return console.error(JSON.stringify(err, null, 2)) if err?
#   console.log data

client.post_graph '322111460523/feed', {
  type: 'status'
  message: 'Testing feed targeting'
  fb_page_id: '322111460523'
  feed_targeting: JSON.stringify({
    cities: ['2421836']
    # regions: ['36']
    relationship_statuses: ['3', '4']
    locales: ['6']
  })
}, (err, data) ->
  return console.error(JSON.stringify(err, null, 2)) if err?
  console.log data
