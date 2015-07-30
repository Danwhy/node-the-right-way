"use strict";
const zmq = require('zmq');
// create subscriber endpoint
const subscriber = zmq.socket('sub');

// subscribe to all messages
subscriber.subscribe("");

// handle messages from publisher
subscriber.on("message", function(data) {
  let message = JSON.parse(data);
  let date = new Date(message.timestamp);

  console.log("File '" + message.file + "' changed at " + date);
});

// connect to publisher
subscriber.connect("tcp://localhost:5432");
