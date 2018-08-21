var handlerSpawns = {
    run: function(spawn) {

        //Currently finds all creeps since right now all creeps are worker creeps
        //find all types of creeps for counting purposes
        var workerCreeps = spawn.room.find(FIND_MY_CREEPS);

        //determine desired amounts of each body part
        var energyCap = spawn.room.energyCapacityAvailable;
        var fifties = Math.floor(energyCap/50);
        var works = Math.floor(fifties*1/4);
        var carries = Math.floor(fifties*1/4);
        var moves = Math.floor(fifties*1/4);

        var bodyPartCap = 15;

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

        if(Game.memory.needClaimer == true) {
          if (!spawn.createCreep([MOVE,CLAIM], null, {job: 'claim'})) {
            Game.memory.needClaimer == false;
          }
        }

        //spawn creep, if conditions are correct
        if(workerCreeps.length < 7) {
            spawn.createCreep(bodyParts,null,{job: null, target: null, working: false});
        }
        //emergency recovery creeps in case of genocide, prevents minimal energy amounts/
        //no production from halting the colony for extended period
        if(workerCreeps.length == 0) {
            spawn.createCreep([WORK,CARRY,MOVE], null, {job: null, target: null, working: false});
        }
    },
}

module.exports = handlerSpawns;
