

var workerManager = {

  run: function() {

    /*Checks through all creeps. If the creep has a job,
    runs its job method. If not, stores creep id in memory
    as an available creep for job assignment
    */
    for(var name in Game.creeps) {

      /*loops through all rooms and clears the decisionmaking
      data from each so it can be recalculated
      */
      for(var room in Game.rooms) {
        room.memory.activeEnergy = 0;
        room.memory.activeBuilders = 0;
        room.memory.activeTargets = [];
      }

      var creep = Game.creeps[name];
      if(creep.memory.job == 'store') {
        jobs.storeEnergy(creep);
        if(creep.memory.working) {
          creep.room.memory.activeEnergy += creep.carry.RESOURCE_ENERGY;
        } else {
          creep.room.memory.activeEnergy += creep.carryCapacity;
        }
      }
      else if(creep.memory.job == 'build') {
        jobs.buildStructures(creep);
        creep.memory.activeBuilders++;
      }
      else if(creep.memory.job == 'repair') {
        jobs.repairStructures(creep);
        room.memory.activeTargets.push(creep.memory.target);
      }
      else if(creep.memory.job == 'upgrade') {
        jobs.upgradeController(creep);
      }
      else if(creep.memory.job == null) {
        creep.room.memory.availableCreeps.push(creep.id);
      }
    }

    for(var room in Game.rooms) {
      var energyNeeded = room.energyCapacity-room.energyAvailable-room.memory.activeEnergy;
      while(energyNeeded > 0 && room.availableCreeps.length > 0){
        var newCreep = Game.getObjectById(room.memory.availableCreeps[0];
        newCreep.memory.job = 'store';
        jobs.storeEnergy(newCreep);
        energyNeeded -= newCreep.carryCapacity;
        room.memory.availableCreeps.shift();
      }

      if(room.memory.availableCreeps.length > 0 && room.memory.activeBuilders <= 2) {
        var targets = room.find(FIND_CONSTRUCTION_SITES);
        targets.sort((a,b) => b.hits/b.hitsMax - a.hits/a.hitsMax);

        while(targets.length && room.memory.availableCreeps.length > 0 && room.memory.activeBuilders <= 2) {
          var newCreep = Game.getObjectById(room.memory.availableCreeps[0];
          newCreep.memory.job = 'build';
          newCreep.memory.target = targets[0].id;
          jobs.buildStructures(newCreep);
          room.memory.activeBuilders += 1;
          room.memory.availableCreeps.shift();
        }
      }

      if(room.memory.availableCreeps.length > 0) {
        var targets = room.find(FIND_STRUCTURES, {filter: (structure) => {
                return (structure.structureType == STRUCTURE_ROAD || structure.structureType == STRUCTURE_CONTAINER) &&
                    structure.hits < (structure.hitsMax - room.memory.availableCreeps[0].carryCapacity)}});
        //sort weakest to strongest
        targets.sort((a,b) => a.hits/a.hitsMax - b.hits/b.hitsMax);

        while(targets.length > 0 && room.memory.availableCreeps.length > 0) {
          var newCreep = Game.getObjectById(room.memory.availableCreeps[0];
          if(!room.memory.activeTargets.includes(targets[0].id)) {
            newCreep.memory.job = 'repair';
            newCreep.memory.target = targets[0].id;
            jobs.repairStructures(newCreep);
            room.memory.availableCreeps.shift();
          }
          targets.shift();
          
        }
      }

      if(room.memory.availableCreeps.length > 0) {
        for(var creepID in room.memory.availableCreeps) {
          var newCreep = Game.getObjectById(creepID);
          newCreep.memory.job = 'upgrade'
          jobs.upgradeController(newCreep);
        }
      }
    }
  }
}

module.exports = workerManager;
