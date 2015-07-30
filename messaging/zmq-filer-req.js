"use strict";
const zmq = require('zmq');
const filename = process.argv[2];
// create request endpoint
const requester = zmq.socket('req');

// handle replies from responder
requester.on('message', function(data) {
  console.dir("Received response: " + data);
});

requester.connect("tcp://localhost:5433");

// send request for content
console.log("Sending request for " + filename);
requester.send(JSON.stringify({
  path: filename
}));
