# facebook.node

A simple Facebook API for Node.js

## Installation
```
  npm install facebook.node
```


## Usage
```
  var Facebook = require('facebook.node'),
      client = new Facebook(access_token);
  
  client.graph('me', function(err, user) {
    if (err) {
      console.error(err.stack);
      return;
    }

    console.log('Nice to meet you ' + user.name + '!');
  });

  client.graph_each('me/friends', function(friend) {
    console.log('I know ' + friend.name);
  }, function(err, count) {
    if (err) {
      console.error(err.stack);
      return;
    }

    console.log('Wow, I have ' + (count == 0 ? 'no' : count) + ' friend' + (count == 1 ? '' : 's') + '!');
  });
```