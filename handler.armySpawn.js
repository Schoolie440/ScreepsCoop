var handlerArmySpawn = {
    run: function(spawn) {
        
        //find defenders for counting purposes
        var defenders = _.filter(spawn.room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == 'defender');
        
        //determines desired number of each body part
        var energyCap = spawn.room.energyCapacityAvailable;
        var hundreds = Math.floor(energyCap/100);
        var toughs = Math.floor(hundreds*1/3*2);
        var attacks = Math.floor(hundreds*1/3);
        var moves = Math.floor(hundreds*1/3*3);
        
        var bodyParts = [];
        
        //pushes desired number of each body part into array
        for(var i=0; i<toughs; i++) {
            bodyParts.push(TOUGH);
        }
        for(var i=0; i<moves; i++) {
            bodyParts.push(MOVE);
        }
        for(var i=0; i<attacks; i++) {
            bodyParts.push(ATTACK);
        }
        
        var newRole;
        var make = false;
        
        //construct defenders, little fast ones first, then big ones
        if(defenders.length < 3) {
            newRole = 'defender';
            bodyParts = [MOVE,MOVE,ATTACK,ATTACK]
            make = true;
        }
        else if(defenders.length < 6) {
            newRole = 'defender';
            make = true;
        }
        
        //spawn defenders, if conditions are correct
        if(make) { 
            spawn.createCreep(bodyParts,null,{role: newRole});
        }
    }
}

module.exports = handlerArmySpawn;