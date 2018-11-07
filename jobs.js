let jobs = {
  storeEnergy: creep => {
    if (creep.memory.working && creep.carry.energy == 0) {
      creep.memory.working = false
      creep.memory.job = null
    }
    if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true
    }

    if (creep.memory.working) {
      if (creep.memory.target == null) {
        if (creep.memory.assignment == 'harvestRoom') {
          //find nearest non-full depository
          let target = Game.getObjectById(creep.memory.homeRoom).find(FIND_STRUCTURES, {
            filter: structure => {
              return (
                (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                structure.energy < structure.energyCapacity
              )
            },
          })
          if (target) {
            creep.memory.target = target.id
          } else {
            creep.memory.job = null
            creep.memory.working = false
          }
        } else {
          //find nearest non-full depository
          let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: structure => {
              return (
                (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                structure.energy < structure.energyCapacity
              )
            },
          })
          if (target) {
            creep.memory.target = target.id
          } else {
            creep.memory.job = null
            creep.memory.working = false
          }
        }
      }
      //if there is a non-full extension/spawn/tower:
      if (creep.memory.target != null) {
        //transfer energy into it
        if (creep.transfer(Game.getObjectById(creep.memory.target), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(Game.getObjectById(creep.memory.target))
        } else if (creep.transfer(Game.getObjectById(creep.memory.target), RESOURCE_ENERGY) == ERR_FULL) {
          creep.memory.target = null
        }
      }
    }
    //if not working...
    else {
      //find closest source and harvest
      jobs.collectEnergy(creep)
    }
  },

  fillTowers: creep => {
    if (creep.memory.working && creep.carry.energy == 0) {
      creep.memory.working = false
      creep.memory.job = null
    }
    if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true
    }

    if (creep.memory.working) {
      if (creep.memory.target == null) {
        //find nearest non-full depository
        let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: structure => {
            return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity
          },
        })
        if (target) {
          creep.memory.target = target.id
        } else {
          creep.memory.job = null
          creep.memory.working = false
        }
      }
      //if there is a non-full tower:
      if (creep.memory.target != null) {
        //transfer energy into it
        if (creep.transfer(Game.getObjectById(creep.memory.target), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(Game.getObjectById(creep.memory.target))
        } else if (creep.transfer(Game.getObjectById(creep.memory.target), RESOURCE_ENERGY) == ERR_FULL) {
          creep.memory.target = null
        }
      }
    }
    //if not working...
    else {
      //find closest source and harvest
      jobs.collectEnergy(creep)
    }
  },

  buildStructures: creep => {
    let target = Game.getObjectById(creep.memory.target)

    if (creep.memory.working && creep.carry.energy == 0) {
      creep.memory.working = false
      creep.memory.job = null
      creep.memory.target = null
    }
    if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true
    }

    if (creep.memory.working) {
      let check = creep.build(target)
      if (check == ERR_NOT_IN_RANGE) {
        creep.moveTo(target)
      } else if (check != OK) {
        creep.memory.working = false
        creep.memory.job = null
        creep.memory.target = null
      }
    }
    //creep is not working, i.e. needs energy
    else {
      //find closest source and harvest
      jobs.collectEnergy(creep)
    }
  },

  repairStructures: creep => {
    if (creep.memory.working && creep.carry.energy == 0) {
      creep.memory.working = false
      creep.memory.job = null
    }
    if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true
    }

    if (creep.memory.target) {
      if (creep.memory.working) {
        let repairTarget = Game.getObjectById(creep.memory.target)

        if (creep.repair(repairTarget) == ERR_NOT_IN_RANGE) {
          creep.moveTo(repairTarget)
        }

        if (repairTarget.hits == repairTarget.hitsMax) {
          creep.memory.target = null
          creep.memory.job = null
        }
      } else {
        jobs.collectEnergy(creep)
      }
    } else {
      creep.memory.job = null
    }
  },

  upgradeController: creep => {
    if (creep.memory.working && creep.carry.energy == 0) {
      creep.memory.working = false
      creep.memory.job = null
    }
    if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true
    }

    //if working (have full energy)
    if (creep.memory.working) {
      //find controller and upgrade it
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller)
      }
    }
    //if we need energy
    else {
      jobs.collectEnergy(creep)
    }
  },

  captureRoom: (creep, flag) => {
    //move creep toward flag until in the same room
    if (creep.room != flag.room || creep.pos.x > 48 || creep.pos.y > 48 || creep.pos.x < 1 || creep.pos.y < 1) {
      creep.moveTo(flag)
    } else {
      //if creep is in same room as flag
      let check = creep.claimController(creep.room.controller)
      if (check == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller)
      } else if (check == OK) {
        creep.room.createConstructionSite(flag.pos.x, flag.pos.y, STRUCTURE_SPAWN)
        flag.remove();
        creep.room.createFlag(25,25,'helpRoom');
      }
    }
  },

  harvestRoom: (creep, flag) => {
    if (creep.room != flag.room || creep.pos.x > 48 || creep.pos.y > 48 || creep.pos.x < 1 || creep.pos.y < 1) {
      creep.moveTo(flag)
    } else if (creep.memory.job == 'moving') {
      creep.memory.source = creep.pos.findClosestByRange(FIND_SOURCES, {
        filter: source => {
          return source.energy > 0
        },
      })
      creep.memory.job = 'store'
    }
  },

  helpRoom: (creep, flag) => {
    if (creep.room != flag.room || creep.pos.x > 48 || creep.pos.y > 48 || creep.pos.x < 1 || creep.pos.y < 1) {
      creep.moveTo(flag)
    } else if (creep.memory.job == 'moving') {
      creep.memory.job = null
    }
  },

  collectEnergy: creep => {
    let source = Game.getObjectById(creep.memory.source)

    let check = creep.harvest(source)

    if (check == ERR_NOT_IN_RANGE) {
      creep.moveTo(source)
    } else if (check == ERR_NOT_ENOUGH_RESOURCES) {
      creep.memory.working = true;
    } else if (check != OK) {
      creep.memory.job = null
    }
  },
  defendBase: creep => {
    let hostileHealers = creep.room.find(FIND_HOSTILE_CREEPS, { filter: creep => creep.getActiveBodyparts(HEAL) > 0 })

    if (hostileHealers.length) {
      if (creep.attack(hostileHealers[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(hostileHealers[0])
      }
    } else {
      let nearEnemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS)
      if (nearEnemy) {
        if (creep.attack(nearEnemy) == ERR_NOT_IN_RANGE) {
          creep.moveTo(nearEnemy)
        }
      }
    }
  },
}

module.exports = jobs
