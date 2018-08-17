var roleClaimer = require('role.claimer');
var roleDefender = require('role.defender');
var roleMiner = require('role.miner');
var towerControls = require('tower.controls');
var constructRoads = require('construct.roads');
var handlerOtherRoom = require('handler.otherRoom');
var handlerSpawns = require('handler.spawns');
var handlerArmySpawn = require('handler.armySpawn');
var constructExtensions = require('construct.extensions');
var workerManager = require('workerManager');
var roomCapture = require('roomCapture');

module.exports.loop = function () {


    //Runs all worker creep operation scripts if creeps exist
    if(Object.keys(Game.creeps).length > 0) {
      workerManager.run();
    }

    //Finds all towers
    var towers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER);

    //Operates towers (attack, repair, repairWalls, combo)
    for(i=0; i<towers.length; i++) {
        towerControls.combo(towers[i]);
    }

    if(false) {
        constructExtensions.run(Game.rooms['W12S56']);
        constructExtensions.run(Game.rooms['W12S56']);
        constructExtensions.run(Game.rooms['W12S56']);
        constructRoads.run(Game.rooms['W12S56']);
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

    //See if we should be capturing a room
    var ownedRooms = 0;
    for(var checkRoom in Game.rooms) {
      if(Game.getObjectById(checkroom).controller.owner == 'Schoolie440') {
        ownedRooms++;
      }
    }
    if(ownedRooms < Game.gcl) {
      roomCapture.run();
    }

    //deletes dead creeps from memory
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
}
