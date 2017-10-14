var roleMiner = {
    run: function(creep) {
        
    //set required state parameters
    if(creep.memory.working && _.sum(creep.carry) == 0) {
        creep.memory.working = false;
    }
    if(!creep.memory.working && _.sum(creep.carry) == creep.carryCapacity) {
        creep.memory.working = true;
    }
    
    
    if(creep.memory.working) {
        //find nearest non-full depository
        var target = creep.room.storage;
        //if there is a non-full storage...
        if(target) {
            //transfer energy into it
            var x = creep.transfer(target, RESOURCE_UTRIUM)
            if(x == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            else if(x = ERR_FULL) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER)}});
            }
        }
    }
    //if not working...
    else {
        //find mineral and harvest
        var minerals = creep.room.find(FIND_MINERALS);
        if(creep.harvest(minerals[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(minerals[0]);
        }
    }
}
}

module.exports = roleMiner;