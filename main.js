var roleMiner = require('role.miner');
var towerControls = require('tower.controls');
var constructRoads = require('construct.roads');
var handlerSpawns = require('handler.spawns');
var handlerArmySpawn = require('handler.armySpawn');
var constructExtensions = require('construct.extensions');
var workerManager = require('workerManager');
var expansionFunctions = require('expansionFunctions');

module.exports.loop = function () {


    //Runs all worker creep operation scripts if creeps exist
    workerManager.run();

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
                handlerArmySpawn.run(Game.spawns[i]);
            }
            else {
                handlerSpawns.run(Game.spawns[i]);
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
      } else if (name == 'firstSpawn') {
        expansionFunctions.buildFirstSpawn(Game.flags[name]);
      }
    }



    //deletes dead creeps from memory
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
}
