
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
        else {
          creep.memory.job = null;
          creep.memory.working = false
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
      }
      //if not working...
      else {
        //find closest source and harvest
        var source = creep.pos.findClosestByRange(FIND_SOURCES, {filter: (source) => {
                return (source.energy > 0)}});
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
      }
    },

    towerCaddy: function(creep) {
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
                        return (structure.structureType == STRUCTURE_TOWER &&
                            structure.energy < structure.energyCapacity);
                    }
          });
          if(target) {
            creep.memory.target = target.id;
          }
          else {
            creep.memory.job = null;
            creep.memory.working = false
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
        }
        //if not working...
        else {
          //find closest source and harvest
          var source = creep.pos.findClosestByRange(FIND_SOURCES, {filter: (source) => {
                  return (source.energy > 0)}});
          if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
              creep.moveTo(source);
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
      var check = creep.build(target);
      if(check == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      } else if(check != OK) {
        creep.memory.working = false;
        creep.memory.job = null;
        creep.memory.target = null;
      }
    }
    //creep is not working, i.e. needs energy
    else {
      //find closest source and harvest
      var source = creep.pos.findClosestByRange(FIND_SOURCES, {filter: (source) => {
              return (source.energy > 0)}});
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
      var repairTarget = Game.getObjectById(creep.memory.target);

      if(creep.repair(repairTarget) == ERR_NOT_IN_RANGE) {
          creep.moveTo(repairTarget);
      }

      if(repairTarget.hits == repairTarget.hitsMax) {
          creep.memory.target = null;
          creep.memory.job = null;
      }

    } else {
      var source = creep.pos.findClosestByRange(FIND_SOURCES, {filter: (source) => {
              return (source.energy > 0)}});
      if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
      }
    }
  },

  upgradeController: function(creep) {
    if(creep.memory.working && creep.carry.energy == 0) {
        creep.memory.working = false;
        creep.memory.job = null;
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
        var sources = creep.room.find(FIND_SOURCES, {filter: (source) => {
                return (source.energy > 0)}});
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0]);
        }
    }
  },

  captureRoom: function(creep, flag) {

    //move creep toward flag until in the same room
    if (creep.room != flag.room || creep.pos.x > 48 || creep.pos.y > 48 ||creep.pos.x < 1 ||creep.pos.y < 1) {
      creep.moveTo(flag);
    } else {  //if creep is in same room as flag
var check = creep.claimController(creep.room.controller);
      if (check == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
      } else if (check == OK) {
        flag.remove();
      }
    }
  },

  buildSpawn: function(creep, flag) {
    if (creep.room != flag.room) {
      creep.moveTo(flag);
    } else {
      if (creep.memory.target == null) {
        var target = creep.room.find(FIND_CONSTRUCTION_SITES, {filter: (site) => {
              return (site.structureType == STRUCTURE_SPAWN)}});
        if (target == null) {
          if (creep.room.find(FIND_MY_SPAWNS)) {
            flag.remove();
            creep.job = null;
          }
        } else {
          creep.memory.target = target.id;
          jobs.buildStructures(creep);
        }
      } else {
        jobs.buildStructures(creep);
      }
    }
  }
}

module.exports = jobs;
