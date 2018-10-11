let jobs = require('jobs')

let workerManager = {
  run: workerCreeps => {
    const CADDY_LIMIT = 1
    const BUILDER_LIMIT = 3

    /*loops through all rooms and clears the decisionmaking
    data from each so it can be recalculated
    */
    for (let roomName in Game.rooms) {
      let room = Game.rooms[roomName]
      room.memory.activeEnergy = 0
      room.memory.activeBuilders = 0
      room.memory.activeCaddies = 0
      room.memory.activeTargets = []
      room.memory.availableCreeps = []
    }

    /*Checks through all creeps. If the creep has a job,
    runs its job method. If not, stores creep id in memory
    as an available creep for job assignment
    */

    let job_tracker = { store: 0, caddy: 0, build: 0, repair: 0, upgrade: 0, defend: 0, open: 0 }

    for (let i in workerCreeps) {
      let creep = Game.getObjectById(workerCreeps[i])

      if (creep.memory.job == 'store') {
        if (creep.memory.working) {
          creep.room.memory.activeEnergy += creep.carry[RESOURCE_ENERGY]
        } else {
          creep.room.memory.activeEnergy += creep.carryCapacity
        }
        jobs.storeEnergy(creep)
        job_tracker.store++
      } else if (creep.memory.job == 'caddy') {
        creep.room.memory.activeCaddies++
        jobs.fillTowers(creep)
        job_tracker.caddy++
      } else if (creep.memory.job == 'build') {
        creep.room.memory.activeBuilders++
        jobs.buildStructures(creep)
        job_tracker.build++
      } else if (creep.memory.job == 'repair') {
        creep.room.memory.activeTargets.push(creep.memory.target)
        jobs.repairStructures(creep)
        job_tracker.repair++
      } else if (creep.memory.job == 'upgrade') {
        jobs.upgradeController(creep)
        job_tracker.upgrade++
      } else if (creep.memory.job == 'defender') {
        jobs.defendBase(creep)
        job_tracker.defend++
      } else if (creep.memory.job == null) {
        creep.room.memory.availableCreeps.push(creep.id)
        job_tracker.open++
      }
    }

    console.log('Creep Counts: ', JSON.stringify(job_tracker))

    for (let roomName in Game.rooms) {
      let room = Game.rooms[roomName]
      let energyNeeded = room.energyCapacityAvailable - room.energyAvailable - room.memory.activeEnergy
      while (energyNeeded > 0 && room.memory.availableCreeps.length > 0) {
        let newCreep = Game.getObjectById(room.memory.availableCreeps[0])
        newCreep.memory.job = 'store'
        newCreep.memory.source = workerManager.findCloseSource(newCreep)
        jobs.storeEnergy(newCreep)
        energyNeeded -= newCreep.carryCapacity
        room.memory.availableCreeps.shift()
      }
      let towers = room.find(FIND_STRUCTURES, {
        filter: structure => {
          return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity
        },
      })

      while (room.memory.availableCreeps.length > 0 && room.memory.activeCaddies < CADDY_LIMIT && towers.length > 0) {
        let newCreep = Game.getObjectById(room.memory.availableCreeps[0])
        newCreep.memory.job = 'caddy'
        newCreep.memory.source = workerManager.findCloseSource(newCreep)
        room.memory.activeCaddies++
        jobs.fillTowers(newCreep)
        room.memory.availableCreeps.shift()
      }

      if (room.memory.availableCreeps.length > 0 && room.memory.activeBuilders < BUILDER_LIMIT) {
        var buildTargets = workerManager.getPrioritizedConstructionSites(room);

        while (buildTargets.length && room.memory.availableCreeps.length > 0 && room.memory.activeBuilders < BUILDER_LIMIT) {
          var newCreep = Game.getObjectById(room.memory.availableCreeps[0])
          newCreep.memory.job = 'build'
          newCreep.memory.target = buildTargets[0].id
          newCreep.memory.source = workerManager.findCloseSource(newCreep)
          jobs.buildStructures(newCreep)
          room.memory.activeBuilders += 1
          room.memory.availableCreeps.shift()
        }
      }

      if (room.memory.availableCreeps.length > 0) {
        let repairTargets = room.find(FIND_STRUCTURES, {
          filter: structure => {
            return (
              (structure.structureType == STRUCTURE_ROAD || structure.structureType == STRUCTURE_CONTAINER) &&
              structure.hits < structure.hitsMax - Game.getObjectById(room.memory.availableCreeps[0]).carryCapacity
            )
          },
        })
        //sort weakest to strongest
        repairTargets.sort((a, b) => a.hits / a.hitsMax - b.hits / b.hitsMax)

        while (repairTargets.length > 0 && room.memory.availableCreeps.length > 0) {
          let newCreep = Game.getObjectById(room.memory.availableCreeps[0])
          if (!room.memory.activeTargets.includes(repairTargets[0].id)) {
            newCreep.memory.job = 'repair'
            newCreep.memory.target = repairTargets[0].id
            newCreep.memory.source = workerManager.findCloseSource(newCreep)
            jobs.repairStructures(newCreep)
            room.memory.availableCreeps.shift()
          }
          repairTargets.shift()
        }
      }

      if (room.memory.availableCreeps.length > 0) {
        for (let creepID in room.memory.availableCreeps) {
          let newCreep = Game.getObjectById(room.memory.availableCreeps[creepID])
          newCreep.memory.job = 'upgrade'
          newCreep.memory.source = workerManager.findCloseSource(newCreep)
          jobs.upgradeController(newCreep)
        }
      }
    }
  },

  findCloseSource: creep => {
    let source = creep.pos.findClosestByRange(FIND_SOURCES, {
      filter: source => {
        return source.energy > 0
      },
    })
    return source.id;
  },

  getPrioritizedConstructionSites: room => {
    var buildTargets = room.find(FIND_CONSTRUCTION_SITES);
    buildTargets.sort((b, a) => a.hits / a.hitsMax - b.hits / b.hitsMax)

    var targetPriority = [
      STRUCTURE_SPAWN,
      STRUCTURE_EXTENSION,
      STRUCTURE_TOWER,
      STRUCTURE_STORAGE,

      STRUCTURE_KEEPER_LAIR,
      STRUCTURE_PORTAL,
      STRUCTURE_CONTROLLER,
      STRUCTURE_LINK,
      STRUCTURE_OBSERVER,
      STRUCTURE_POWER_BANK,
      STRUCTURE_POWER_SPAWN,
      STRUCTURE_EXTRACTOR,
      STRUCTURE_LAB,
      STRUCTURE_TERMINAL,
      STRUCTURE_CONTAINER,
      STRUCTURE_NUKER,

      STRUCTURE_ROAD,
      STRUCTURE_WALL,
      STRUCTURE_RAMPART,
    ]

    var prioritizedTargets = [];

    for (let s in targetPriority) {
      let structType = targetPriority[s];
      let filteredTargets = _.filter(buildTargets, target => target.structureType == structType)
      prioritizedTargets = prioritizedTargets.concat(filteredTargets);
    }

    return prioritizedTargets;
  }
}

module.exports = workerManager
