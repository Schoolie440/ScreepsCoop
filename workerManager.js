var jobs = require('jobs');

var workerManager = {

  run: function(workerCreeps) {

    /*loops through all rooms and clears the decisionmaking
    data from each so it can be recalculated
    */
    for(var roomName in Game.rooms) {
      var room = Game.rooms[roomName];
      room.memory.activeEnergy = 0;
      room.memory.activeBuilders = 0;
      room.memory.activeTargets = [];
      room.memory.availableCreeps = [];
    }


    /*Checks through all creeps. If the creep has a job,
    runs its job method. If not, stores creep id in memory
    as an available creep for job assignment
    */

    var job_tracker = {store: 0, build: 0, repair:0, upgrade:0, defend:0, open:0};

    for(var i in workerCreeps) {

      var creep = Game.getObjectById(workerCreeps[i]);

      if(creep.memory.job == 'store') {
        if(creep.memory.working) {
          creep.room.memory.activeEnergy += creep.carry[RESOURCE_ENERGY];
        } else {
          creep.room.memory.activeEnergy += creep.carryCapacity;
        }
        jobs.storeEnergy(creep);
        job_tracker.store++;
      }
      else if(creep.memory.job == 'build') {
        creep.room.memory.activeBuilders++;
        jobs.buildStructures(creep);
        job_tracker.build++;
      }
      else if(creep.memory.job == 'repair') {
        creep.room.memory.activeTargets.push(creep.memory.target);
        jobs.repairStructures(creep);
        job_tracker.repair++;
      }
      else if(creep.memory.job == 'upgrade') {
        jobs.upgradeController(creep);
        job_tracker.upgrade++;
      }
      else if(creep.memory.job == 'defender') {
        jobs.defendBase(creep);
        job_tracker.defend++;
      }
      else if(creep.memory.job == null) {
        creep.room.memory.availableCreeps.push(creep.id);
        job_tracker.open++;
      }
    }

    console.log('Creep Counts: ', JSON.stringify(job_tracker));

    for(var roomName in Game.rooms) {
      var room = Game.rooms[roomName];
      var energyNeeded = room.energyCapacityAvailable-room.energyAvailable-room.memory.activeEnergy;
      while(energyNeeded > 0 && room.memory.availableCreeps.length > 0){
        var newCreep = Game.getObjectById(room.memory.availableCreeps[0]);
        newCreep.memory.job = 'store';
        jobs.storeEnergy(newCreep);
        energyNeeded -= newCreep.carryCapacity;
        room.memory.availableCreeps.shift();
      }


      if(room.memory.availableCreeps.length > 0 && room.memory.activeBuilders <= 3) {
        var buildTargets = room.find(FIND_CONSTRUCTION_SITES);
        buildTargets.sort((b,a) => a.hits/a.hitsMax - b.hits/b.hitsMax);

        while(buildTargets.length && room.memory.availableCreeps.length > 0 && room.memory.activeBuilders <= 2) {
          var newCreep = Game.getObjectById(room.memory.availableCreeps[0]);
          newCreep.memory.job = 'build';
          newCreep.memory.target = buildTargets[0].id;
          jobs.buildStructures(newCreep);
          room.memory.activeBuilders += 1;
          room.memory.availableCreeps.shift();
        }
      }

      if(room.memory.availableCreeps.length > 0) {
        var repairTargets = room.find(FIND_STRUCTURES, {filter: (structure) => {
                return (structure.structureType == STRUCTURE_ROAD || structure.structureType == STRUCTURE_CONTAINER) &&
                    structure.hits < (structure.hitsMax - Game.getObjectById(room.memory.availableCreeps[0]).carryCapacity)}});
        //sort weakest to strongest
        repairTargets.sort((a,b) => a.hits/a.hitsMax - b.hits/b.hitsMax);

        while(repairTargets.length > 0 && room.memory.availableCreeps.length > 0) {
          var newCreep = Game.getObjectById(room.memory.availableCreeps[0]);
          if(!room.memory.activeTargets.includes(repairTargets[0].id)) {
            newCreep.memory.job = 'repair';
            newCreep.memory.target = repairTargets[0].id;
            jobs.repairStructures(newCreep);
            room.memory.availableCreeps.shift();
          }
          repairTargets.shift();

        }
      }

      if(room.memory.availableCreeps.length > 0) {
        for(var creepID in room.memory.availableCreeps) {
          var newCreep = Game.getObjectById(room.memory.availableCreeps[creepID]);
          newCreep.memory.job = 'upgrade'
          jobs.upgradeController(newCreep);
        }
      }
    }
  }
}

module.exports = workerManager;
