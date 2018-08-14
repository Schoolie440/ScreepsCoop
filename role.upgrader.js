var roleUpgrader = {
    //basic controller upgrader module
    /** @param {Creep} creep **/
    run: function(creep) {
        //set state parameters
        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
	    }
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.working = true;
	    }
        
        //if working (have full energy)
	    if(creep.memory.working) {
	        //find controller and upgrade it
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        //if we need energy
        else {
            //find nearest source and harvest it
            var closeSource = creep.pos.findClosestByPath(FIND_SOURCES);
            if(creep.harvest(closeSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closeSource);
            }
        }
	}
};

module.exports = roleUpgrader;