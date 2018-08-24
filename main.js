var roleMiner = require('role.miner');
var towerControls = require('tower.controls');
var constructRoads = require('construct.roads');
var handlerSpawns = require('handler.spawns');
var handlerArmySpawn = require('handler.armySpawn');
var constructExtensions = require('construct.extensions');
var workerManager = require('workerManager');
var armyManager = require('armyManager');
var expansionFunctions = require('expansionFunctions');

module.exports.loop = function () {

    var workerCreeps = [];
    var armyCreeps = [];

    for (var creepName in Game.creeps) {
      if (Game.creeps[creepName].memory.class == 'worker') {
        workerCreeps.push(Game.creeps[creepName].id);
      } else if (Game.creeps[creepName].memory.class == 'army') {
        armyCreeps.push(Game.creeps[creepName].id);
      }
    }

    //Runs all worker creep operation scripts if creeps exist
    workerManager.run(workerCreeps);
    armyManager.run(armyCreeps);

    //Finds all towers
    var towers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER);

    //Operates towers (attack, repair, repairWalls, combo)
    for(i=0; i<towers.length; i++) {
        towerControls.attack(towers[i]);
    }

    if(Game.time % 20 == 0) {
        //loops through all spawns and runs auto spawn module
        for(var i in Game.spawns) {
            //checks if enemies present in room
            var enemies = Game.spawns[i].room.find(FIND_HOSTILE_CREEPS);

            //if enemies present, shut down regular creep production, start military
            if(enemies.length) {
                handlerArmySpawn.run(Game.spawns[i, armyCreeps]);
            }
            else {
                handlerSpawns.run(Game.spawns[i], workerCreeps);
            }
        }
    }

    for (let r in Game.rooms) {
      var room = Game.rooms[r];
      // constructExtensions.run(room);
      constructRoads.run(room);
    }

    //See if a captureTarget Flag has been placed
    for (var name in Game.flags) {
      if (name == 'captureTarget') {
        expansionFunctions.roomCapture(Game.flags[name]);
      } else if (name == 'roomHelp') {
        expansionFunctions.roomHelp(Game.flags[name]);
      }
    }



    //deletes dead creeps from memory
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
}
