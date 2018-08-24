var handlerSpawns = {
    run: function(spawn) {

      //Currently finds all creeps since right now all creeps are worker creeps
      //find all types of creeps for counting purposes
      // var workerCreeps = spawn.room.find(FIND_MY_CREEPS);
      var workerCreeps = _.filter(spawn.room.find(FIND_MY_CREEPS), (creep) => creep.memory.job != 'defender');

      //determine desired amounts of each body part
      var energyCap = spawn.room.energyCapacityAvailable;
      var fifties = Math.floor(energyCap/50);
      var works = Math.floor(fifties*1/4);
      var carries = Math.floor(fifties*1/4);
      var moves = Math.floor(fifties*1/4);

      var bodyPartCap;

      //Not a huge fan of this since it runs in On^2 time
      var worksInRoom = 0;
      for (var creep in workerCreeps) {
        for (var part in creep.body) {
          if (creep.body[part].type == WORK) {
            worksInRoom++;
          }
        }
      }

      switch (true) {
        case worksInRoom == 0:
          bodyPartCap = 3;
          break;
        case worksInRoom < 3:
          bodyPartCap = 6;
          break;
        case worksInRoom < 6:
          bodyPartCap = 9
          break;
        case worksInRoom < 12:
          bodyPartCap = 12
          break;
        default:
          bodyPartCap = 15;
      }


      if(works+carries+moves > bodyPartCap) {
        works = carries = moves = bodyPartCap/3;
      }

      var bodyParts = [];

      //push desired number of each body part to array
      for(var i=0; i<works; i++) {
        bodyParts.push(WORK);
      }
      for(var i=0; i<carries; i++) {
        bodyParts.push(CARRY);
      }
      for(var i=0; i<moves; i++) {
        bodyParts.push(MOVE);
      }

      var make = false;

      if(Memory.needClaimer == true) {
        var check = spawn.createCreep([MOVE,CLAIM], null, {job: 'claim'});
        if (check == OK) {
          Game.memory.needClaimer = false;
        }
      }

      //spawn creep, if conditions are correct
      if(workerCreeps.length < 7) {
        spawn.createCreep(bodyParts, null, {class: 'worker', job: null, target: null, working: false});
      }
    },
}

module.exports = handlerSpawns;
