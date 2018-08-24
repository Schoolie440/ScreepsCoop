var handlerSpawns = require('handler.spawns');
var jobs = require('jobs');

var expansionFunctions = {

  roomCapture: function(flag) {
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
  },

  roomHelp: function(flag) {
    var roomHelper;
    for (var creepName in Game.creeps) {
      if(Game.creeps[creepName].memory.assignment == 'helpRoom') {
        roomHelper = Game.creeps[creepName];
      }
    }

    if (roomHelper == null) {
      var i = 0;
      var found = false;
      while (i < Object.keys(Game.creeps).length - 1 && !found) {
        roomHelper = Game.creeps[Object.keys(Game.creeps)[Object.keys(Game.creeps).length - 1 - i]];
        if (roomHelper.room != flag.room) {
          found = true;
        }
        i++
      }
      roomHelper.memory.assignment = 'helpRoom';
      roomHelper.memory.job = 'moving';
    } else {
      jobs.helpRoom(roomHelper, flag);
    }
  }
}

module.exports = expansionFunctions;
