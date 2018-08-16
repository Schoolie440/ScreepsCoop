
var jobs = {

  storeEnergy: function(creep) {
    if(creep.memory.working && creep.carry.energy == 0) {
          creep.memory.working = false;
          creep.memory.job = null;
    }
    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
        creep.memory.working = true;
    }

    if(creep.memory.working) {
      if(creep.memory.target == null) {
        //find nearest non-full depository
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                  filter: (structure) => {
                      return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                          structure.energy < structure.energyCapacity;
                  }
        });
        if(target) {
          creep.memory.target = target.id;
        }
      }
        //if there is a non-full extension/spawn/tower:
        if(creep.memory.target != null) {
          //transfer energy into it
          if(creep.transfer(Game.getObjectById(creep.memory.target), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(Game.getObjectById(creep.memory.target));
          }
          else if(creep.transfer(Game.getObjectById(creep.memory.target), RESOURCE_ENERGY) == ERR_FULL) {
              creep.memory.target = null;
          } 
        }
        //if not working...
        else {
          //find closest source and harvest
          var source = creep.pos.findClosestByRange(FIND_SOURCES);
          if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
              creep.moveTo(source);
          }
        }
      }
    },

  buildStructures: function(creep) {

    var target = Game.getObjectById(creep.memory.target);

    if(creep.memory.working && creep.carry.energy == 0) {
          creep.memory.working = false;
          creep.memory.job = null;
          creep.memory.target = null;
    }
    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
        creep.memory.working = true;
    }

    if(creep.memory.working) {
      if(creep.build(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      } else if(creep.build(target) != OK) {
        creep.memory.working = false;
        creep.memory.job = null;
        creep.memory.target = null;
      }
    }
    //creep is not working, i.e. needs energy
    else {
      //find closest source and harvest
      var source = creep.pos.findClosestByRange(FIND_SOURCES);
      if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
      }
    }
  },

  repairStructures: function(creep) {

    if(creep.memory.working && creep.carry.energy == 0) {
          creep.memory.working = false;
          creep.memory.target = null;
          creep.memory.job = null;
    }
    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
        creep.memory.working = true;
    }

    if(creep.memory.working) {
      var target = Game.getObjectById(creep.memory.target);

      if(creep.repair(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
      }

      if(target.hits == target.hitsMax) {
          creep.memory.working = false;
          creep.memory.target = null;
          creep.memory.job = null;
      }
    } else {
      var source = creep.pos.findClosestByRange(FIND_SOURCES);
      if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
      }
    }
  },

  upgradeController: function(creep) {
    if(creep.memory.working && creep.carry.energy == 0) {
        creep.memory.working = false;
    }
    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true;
    }

    //if working (have full energy)
    if(creep.memory.working) {
      //find controller and upgrade it
        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
    //if we need energy
    else {
        //find nearest source and harvest it
        var source = creep.pos.findClosestByRange(FIND_SOURCES);
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }
  }
}

module.exports = jobs;
