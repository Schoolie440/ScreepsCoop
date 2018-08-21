var roomCaptureUtilities = require('roomCaptureUtilities');
var handlerSpawns = require('handler.spawns');
var jobs = require('jobs');

var roomCapture = {

  run: function(flag) {
    var claimerCreep;
    for (var creepName in Game.creeps) {
      if (Game.creeps[creepName].memory.job == 'claim') {
        claimerCreep = Game.creeps[creepName];
      }
    }

    if (claimerCreep == null) {
      //Spawn a claimer creep
      Memory.needClaimer = true;
    } else {
      //have the creep claim the room
      jobs.captureRoom(claimerCreep, flag);
    }
  }
}

module.exports = roomCapture;
