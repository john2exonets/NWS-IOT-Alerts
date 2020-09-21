//
// sdrClient.js
//
// John D. Allen
// May 2020
//

var mqtt = require('mqtt');
var spawn = require('child_process').spawn;
//
//  radio.sh contains:
//  rtl_fm -f 162.4M -M fm -F 0 -E dc -g 42 -s 22050 - | stdbuf -oL -eL multimon-ng -t raw -a EAS /dev/stdin
//
var child = spawn('/bin/bash', ['./radio.sh']);
var kill = require('tree-kill');

var MQTTBROKER = "http://mqtt.my.io/";
var DEBUG = 6;

if (DEBUG > 8) { console.log("Spawned PID = " + child.pid); }

// MQTT connection options
var copts = {
  clientId: "wxsdr",
  keepalive: 5000
};

//---------------------------------------------------------------------------
// MQTT Stuff
//---------------------------------------------------------------------------
var client = mqtt.connect(MQTTBROKER, copts);

client.on("connect", function() {
  // Do nothing....here in case we want to listen for commands in the future.
});

//---------------------------------------------------------------------------
// SDR Stuff
//---------------------------------------------------------------------------
process.on('SIGINT', () => {
  killProg();
});

child.stdout.setEncoding('utf8');
child.stdout.on('data', function(data) {
  data = data.toString();
  if (DEBUG > 8) { console.log('stdout: ' + data); }
  if (data.startsWith('EAS')) {
     sendInfoWxMsg(data);
  }
});

child.stderr.setEncoding('utf8');
child.stderr.on('data', function(data) {
  if (DEBUG > 5) {
    data = data.toString();
    console.log('stderr: ' + data);
  }
});

child.on('close', function(code) {
  if (DEBUG > 8) { console.log("Closing code: " + code); }
});

//
// If we get a KILL signal, go out and kill all the child
// programs started by the radio.sh shell script.
function killProg() {
  if (DEBUG > 3) { console.log("Terminiating Program..."); }
  kill(child.pid, 'SIGKILL', () => {
    process.exit(0);
  });
}

//
// send out the NWS text we received and decoded.
function sendInfoWxMsg(msg) {
  var rr = msg.split(/ /);
  var gg = rr[1].trim();
  if (DEBUG > 5) { console.log("-->sendInfoWxMsg():" + gg); }
  client.publish("info/wx", '{"txt": "' + gg + '"}');
}

