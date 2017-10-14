
//builder role, builds construction sites, then maintains roads, then repairs anything else
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

    //set necessary conditional variables
	    if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.target = null;
	    }
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.working = true;
	    }

	    if(creep.memory.working) {
	        //find nearest C site
	        var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            
            //if c site found...
            if(target) {
                //build it
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            //if no construction sites...
            else if(creep.memory.target == null) {
                //find roads with <90% hits
                var targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {
                        return (structure.structureType == STRUCTURE_ROAD || structure.structureType == STRUCTURE_CONTAINER) &&
                            structure.hits < structure.hitsMax*9/10}});
                //sort weakest to strongest
                targets.sort((a,b) => a.hits/a.hitsMax - b.hits/b.hitsMax);
                
                //if there are roads with <90% hits...
                if(targets.length > 0) {
                    
                    //store weakest road section as target in memory
                    creep.memory.target = targets[0].id;
                    //repair it until out of energy, or section has 100% hits
                    if(creep.repair(Game.getObjectById(creep.memory.target)) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.getObjectById(creep.memory.target));
                        //if max hits attained, find set target null, but not working, this means the next loop will find a new target instead of returning for energy
                        if(Game.getObjectById(creep.memory.target).hits == Game.getObjectById(creep.memory.target).hitsMax) {
                            creep.memory.target = null;
                        }
                    }
                }
                //if no roads <90% hits...
                else {
                    //find any other structures with <100% hits
                    var targets = creep.room.find(FIND_STRUCTURES, {filter: object => object.hits < object.hitsMax});
                    //sort smallest to largest
                    targets.sort((a,b) => a.hits/a.hitsMax - b.hits/b.hitsMax);
                    
                    //if weakened structures found...
                    if(targets.length > 0) {
                        
                        //store weakest (proportionally) as target
                        creep.memory.target = targets[0].id;
                        //repair it until out of energy, or fully repaired
                        if(creep.repair(Game.getObjectById(creep.memory.target)) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(Game.getObjectById(creep.memory.target));
                            if(Game.getObjectById(creep.memory.target).hits == Game.getObjectById(creep.memory.target).hitsMax) {
                                creep.memory.target = null;
                            }
                        }
                    }
                }
            }
            //if we already have a target
            else {
                //repair the target
                if(creep.repair(Game.getObjectById(creep.memory.target)) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.getObjectById(creep.memory.target));
                }
                //if we finish the target, clear and get a new one
                if(Game.getObjectById(creep.memory.target).hits == Game.getObjectById(creep.memory.target).hitsMax) {
                    creep.memory.target = null;
                }
            }
	    }
	    //if not working...
	    else {
	        //find source, get energy
	        var closeSource = creep.pos.findClosestByPath(FIND_SOURCES);
            if(creep.harvest(closeSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closeSource);
            }
	    }
	}
};

module.exports = roleBuilder;