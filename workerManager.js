var jobs = require('jobs');

var workerManager = {

  run: function() {

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
    for(var name in Game.creeps) {
      var creep = Game.creeps[name];
      if(creep.memory.job == 'store') {
        //tracks amount of energy that can be stored by each active "store" creep to avoid overassignment
        if(creep.memory.working) {
          //creep is working, so some of his energy may have already been deposited,
          //avoid counting twice by counting only what he is carrying
          creep.room.memory.activeEnergy += creep.carry[RESOURCE_ENERGY];
        } else {
          //count non working creeps by the energy they will eventually deposit
          creep.room.memory.activeEnergy += creep.carryCapacity;
        }
        //call job method to continue creep behavior
        jobs.storeEnergy(creep);
      }
      else if(creep.memory.job == 'caddy') {
        //call job method to continue creep behavior
        jobs.towerCaddy(creep);
      }
      else if(creep.memory.job == 'build') {
        //Tracks number of builders active to prevent construction projects from halting room operation by hogging creeps
        creep.room.memory.activeBuilders++;
        //call job method to continue creep behavior
        jobs.buildStructures(creep);
      }
      else if(creep.memory.job == 'repair') {
        //keeps track of targets that are already set for repair to avoid multiple assignment
        creep.room.memory.activeTargets.push(creep.memory.target);
        //call job method to continue creep behavior
        jobs.repairStructures(creep);
      }
      else if(creep.memory.job == 'upgrade') {
        //call job method to continue creep behavior
        jobs.upgradeController(creep);
      }
      else if(creep.memory.job == null) {
        //add creep to available creeps list for this room if he has no assigned job
        creep.room.memory.availableCreeps.push(creep.id);
      }
    }
    //loop through all rooms and find/assign jobs as necessary
    for(var roomName in Game.rooms) {
      var room = Game.rooms[roomName];
      //finds amount of energy necessary to fill the room's spawn and extensions
      var energyNeeded = room.energyCapacityAvailable-room.energyAvailable-room.memory.activeEnergy;
      //runs until enough creeps are assigned to fill energy stores or until no more creeps are available
      while(energyNeeded > 0 && room.memory.availableCreeps.length > 0){
        //next available creep
        var newCreep = Game.getObjectById(room.memory.availableCreeps[0]);
        //assign the job
        newCreep.memory.job = 'store';
        //call job method to begin creep behavior
        jobs.storeEnergy(newCreep);
        //update energy needed with this creeps future contribution
        energyNeeded -= newCreep.carryCapacity;
        //remove this creep from the available creeps list
        room.memory.availableCreeps.shift();
      }

      //find non-full towers
      var towers = room.find(FIND_STRUCTURES, {filter: (struct) => {
            return (struct.structureType == STRUCTURE_TOWER &&
              struct.energy < struct.energyCapacity)
      }});

      
      if(room.memory.availableCreeps.length > 0 && towers.length > 0) {
        var newCreep = Game.getObjectById(room.memory.availableCreeps[0]);
        newCreep.memory.job = 'caddy';
        jobs.towerCaddy(newCreep);
        room.memory.availableCreeps.shift();
      }


      if(room.memory.availableCreeps.length > 0 && room.memory.activeBuilders <= 2) {
        var targets = room.find(FIND_CONSTRUCTION_SITES);
        targets.sort((b,a) => a.hits/a.hitsMax - b.hits/b.hitsMax);

        while(targets.length && room.memory.availableCreeps.length > 0 && room.memory.activeBuilders <= 2) {
          var newCreep = Game.getObjectById(room.memory.availableCreeps[0]);
          newCreep.memory.job = 'build';
          newCreep.memory.target = targets[0].id;
          jobs.buildStructures(newCreep);
          room.memory.activeBuilders += 1;
          room.memory.availableCreeps.shift();
        }
      }

      if(room.memory.availableCreeps.length > 0) {
        targets = room.find(FIND_STRUCTURES, {filter: (struct) => {
                return (struct.structureType == STRUCTURE_ROAD || struct.structureType == STRUCTURE_CONTAINER) &&
                    (struct.hits < (struct.hitsMax * .75))}});
        //sort weakest to strongest
        targets.sort((a,b) => a.hits/a.hitsMax - b.hits/b.hitsMax);

        while(targets.length > 0 && room.memory.availableCreeps.length > 0) {
          var newCreep = Game.getObjectById(room.memory.availableCreeps[0]);
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
          var newCreep = Game.getObjectById(room.memory.availableCreeps[creepID]);
          newCreep.memory.job = 'upgrade'
          jobs.upgradeController(newCreep);
        }
      }
    }
  }
}

module.exports = workerManager;
