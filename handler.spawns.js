var handlerSpawns = {
    run: function(spawn) {
        
        var harvesters = _.filter(spawn.room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == 'harvester');
        var upgraders = _.filter(spawn.room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(spawn.room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == 'builder');
        var towerCaddies = _.filter(spawn.room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == 'towerCaddy');
        var claimer = _.filter(spawn.room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == 'claimer');
        
        
        var energyCap = spawn.room.energyCapacityAvailable;
        var hundreds = Math.floor(energyCap/100);
        var works = Math.floor(hundreds*1/3);
        var carries = Math.floor(hundreds*1/3);
        var moves = Math.floor(hundreds*1/3);
        
        var bodyParts = [];
        
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
        
        if(harvesters.length < 3) {
            newRole = 'harvester';
            make = true;
            
        }
        else if(builders.length < 4) {
            newRole = 'builder';
            make = true;
        }
        else if(upgraders.length < 4) {
            var newRole = 'upgrader';
            make = true;
        }
        else if(towerCaddies.length < 2) {
            newRole = 'towerCaddy';
            make = true;
        }
        
        if(make) { 
            spawn.createCreep(bodyParts,null,{role: newRole, working: false});
        }
        
        if(harvesters == 0) {
            spawn.createCreep([WORK,CARRY,MOVE], null, {role: 'harvester', working: false});
        }
    }
}

module.exports = handlerSpawns;