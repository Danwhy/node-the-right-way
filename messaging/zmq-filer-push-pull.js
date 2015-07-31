"use strict";
const cluster = require('cluster');
const zmq = require('zmq');

if (cluster.isMaster) {

  let pusher = zmq.socket('push').bind('ipc://filer-pusher.ipc');
  let puller = zmq.socket('pull').bind('ipc://filer-puller.ipc');
  let readyCount = 0;

  puller.on('message', function(data) {
    let message = JSON.parse(data);
    if (message.type === 'ready') {
      readyCount++;
      if (readyCount >= 3) {
        for (let i = 0; i < 30; i++) {
          pusher.send(JSON.stringify({
            type: 'job'
          }));
        }
      }
    } else if (message.type === 'result'){
      console.log(message.pid + ':' + message.content);
    }
  });

  for (let i = 0; i < 3; i++) {
    cluster.fork();
  }

  cluster.on('online', function(worker) {
    console.log('Worker ' + worker.process.pid + ' is online.');
  });

} else {

  let puller = zmq.socket('pull').connect('ipc://filer-pusher.ipc');
  let pusher = zmq.socket('push').connect('ipc://filer-puller.ipc');

  puller.on('message', function() {
    pusher.send(JSON.stringify({
      type: 'result',
      content: 'result',
      pid: process.pid
    }));
  });

  pusher.send(JSON.stringify({
    type: 'ready'
  }));
}
