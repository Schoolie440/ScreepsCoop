var jobs = require('jobs');

var workerManager = {

  run: function() {
    
    /* If there are no creeps, return */
    if(Object.keys(Game.creeps).length < 0) {
        return;
    }

    /*loops through all rooms and clears the decisionmaking
    data from each so it can be recalculated
    */
    for(var roomName in Game.rooms) {
      var room = Game.rooms[roomName];
      room.memory.activeEnergy = 0;
      room.memory.activeBuilders = 0;
      room.memory.activeCaddies = 0;
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
        room.memory.activeCaddies++;
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

      //if non-full towers are found, and creeps are available
      if(room.memory.availableCreeps.length > 0 && towers.length > 0 && room.memory.activeCaddies < 1) {
        var newCreep = Game.getObjectById(room.memory.availableCreeps[0]);
        //assign a creep to bring energy to the tower
        newCreep.memory.job = 'caddy';
        //call job method to begin creep behavior
        jobs.towerCaddy(newCreep);
        //remove this creep from the available creeps list
        room.memory.availableCreeps.shift();
      }

      //if there are still creeps available, and fewer than 3 builders are currently active
      if(room.memory.availableCreeps.length > 0 && room.memory.activeBuilders < 3) {
        var targets = room.find(FIND_CONSTRUCTION_SITES);
        //sort in descending order (I think)
        targets.sort((a,b) => b.hits/b.hitsMax - a.hits/a.hitsMax);
        //runs until out of targets or creeps, or max builders are assigned
        while(targets.length && room.memory.availableCreeps.length > 0 && room.memory.activeBuilders < 3) {
          var newCreep = Game.getObjectById(room.memory.availableCreeps[0]);
          //assigns job
          newCreep.memory.job = 'build';
          //stores build target in creep memory
          newCreep.memory.target = targets[0].id;
          //call job method to begin creep behavior
          jobs.buildStructures(newCreep);
          //record the addition of another active builder
          room.memory.activeBuilders += 1;
          //remove this creep from the available creeps list
          room.memory.availableCreeps.shift();
        }
      }
      //if there are any creeps available
      if(room.memory.availableCreeps.length > 0) {
        //find repair targets
        targets = room.find(FIND_STRUCTURES, {filter: (struct) => {
                return (struct.structureType == STRUCTURE_ROAD || struct.structureType == STRUCTURE_CONTAINER) &&
                    (struct.hits < (struct.hitsMax * .75))}});
        //sort weakest to strongest
        targets.sort((a,b) => a.hits/a.hitsMax - b.hits/b.hitsMax);

        //runs until out of targets or available creeps
        while(targets.length > 0 && room.memory.availableCreeps.length > 0) {
          var newCreep = Game.getObjectById(room.memory.availableCreeps[0]);
          //checks to see if this road is already another creep's target
          if(!room.memory.activeTargets.includes(targets[0].id)) {
            //assign job to creep
            newCreep.memory.job = 'repair';
            //store target in creep memory
            newCreep.memory.target = targets[0].id;
            //call job method to begin creep behavior
            jobs.repairStructures(newCreep);
            //remove this creep from available creeps
            room.memory.availableCreeps.shift();
            //add this assigned target to the active targets list
            room.memory.activeTargets.push(targets[0].id);
          }
          //remove target from targets list
          targets.shift();

        }
      }
      //if any creeps remain available, assign them to upgrade the controller
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
