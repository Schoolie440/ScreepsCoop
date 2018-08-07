var roleHarvester = {

    //standard harvester module
    /** @param {Creep} creep **/
    run: function(creep) {
	    
	    //set required state parameters
	    if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
	    }
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.working = true;
	    }
	    
	    
	    if(creep.memory.working) {
	        //find nearest non-full depository
	        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            //if there is a non-full extension/spawn:
            if(target) {
                //transfer energy into it
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            //if all extensions/spawns are full...
            else {
                //find non-full tower and deposit into that
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER) &&
                            structure.energy < structure.energyCapacity;
                    }
                });
                //if non-full tower
                if(target) {
                    //deposit
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                else {
                    //Temporarily becomes a builder
                    var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            
                    //if c site found...
                    if(target) {
                        //build it
                        if(creep.build(target) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                    } else {
                        //temporarily becomes an upgrader
                        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.controller);
                        }
                    }
                }
            }
	    }
	    //if not working...
	    else {
	        //find closest source and harvest
	        var source = creep.pos.findClosestByRange(FIND_SOURCES);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
	    }
    }    
};

module.exports = roleHarvester;