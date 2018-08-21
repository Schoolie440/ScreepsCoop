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

  buildFirstSpawn: function(flag) {
    var spawnBuilder;
    for var creepName in Game.creeps) {
      if(Game.creeps[creepName].memory.job == 'buildSpawn') {
        spawnBuilder = Game.creeps[creepName];
      }
    }

    if (spawnBuilder == null) {
      Game.creeps[0].memory.job = 'buildSpawn';
    } else {
      spawnBuilder.memory.target = null;
      spawnBuilder.memory.working = false;
      jobs.buildSpawn(spawnBuilder, flag);
    }
  }
}

module.exports = expansionFunctions;
