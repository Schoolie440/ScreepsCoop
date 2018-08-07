var handlerSpawns = {
    run: function(spawn) {
        
        //find all types of creeps for counting purposes
        var harvesters = _.filter(spawn.room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == 'harvester');
        var upgraders = _.filter(spawn.room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(spawn.room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == 'builder');
        var towerCaddies = _.filter(spawn.room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == 'towerCaddy');
        var claimers = _.filter(spawn.room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == 'claimer');
        var miners = _.filter(spawn.room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == 'miners');
        
        //determine desired amounts of each body part
        var energyCap = spawn.room.energyCapacityAvailable;
        var fifties = Math.floor(energyCap/50);
        var works = Math.floor(fifties*1/6);
        var carries = Math.floor(fifties*1/3);
        var moves = Math.floor(fifties*1/3);
        
        var bodyPartCap = 12;
        
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
        
        var newRole;
        var make = false;
        
        //create creep using determined parts/roles
        if(harvesters.length < 2) {
            newRole = 'harvester';
            make = true;
            
        }
        else if(builders.length < 2) {
            newRole = 'builder';
            make = true;
        }
        else if(upgraders.length < 5) {
            var newRole = 'upgrader';
            make = true;
        }
        /*else if(miners.length < 4 && spawn.room.find(FIND_STRUCTURES, {filter: (structure) => {return(structure.structureType == STRUCTURE_EXTRACTOR)}}) && spawn.room.find(FIND_MINERALS, {filter: (mineral) => {return(mineral.mineralAmount > 0)}})) {
            newRole = 'miner';
            make = true;
        }*/
        else if(towerCaddies.length < 1) {
            newRole = 'towerCaddy';
            make = true;
        }
        
        //spawn creep, if conditions are correct
        if(make) { 
            spawn.createCreep(bodyParts,null,{role: newRole, working: false});
        }
        //emergency recovery creeps in case of genocide, prevents minimal energy amounts/
        //no production from halting the colony for extended period
        if(harvesters == 0) {
            spawn.createCreep([WORK,CARRY,MOVE], null, {role: 'harvester', working: false});
        }
    }
}

module.exports = handlerSpawns;