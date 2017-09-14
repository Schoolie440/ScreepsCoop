var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.target = null;
	    }
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.working = true;
	    }

	    if(creep.memory.working) {
	        var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            
            if(target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else if(creep.memory.target == null) {
                var targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {
                        return (structure.structureType == STRUCTURE_ROAD) &&
                            structure.hits < structure.hitsMax*9/10;}})
                targets.sort((a,b) => a.hits/a.hitsMax - b.hits/b.hitsMax);
                
                if(targets.length > 0) {
                    
                    creep.memory.target = targets[0].id;
                    if(creep.repair(Game.getObjectById(creep.memory.target)) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.getObjectById(creep.memory.target));
                        if(Game.getObjectById(creep.memory.target).hits == Game.getObjectById(creep.memory.target).hitsMax) {
                            creep.memory.target = null;
                        }
                    }
                }
                else {
                    var targets = creep.room.find(FIND_STRUCTURES, {filter: object => object.hits < object.hitsMax});
                    targets.sort((a,b) => a.hits/a.hitsMax - b.hits/b.hitsMax);
                    
                    if(targets.length > 0) {
                        
                        creep.memory.target = targets[0].id;
                        if(creep.repair(Game.getObjectById(creep.memory.target)) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(Game.getObjectById(creep.memory.target));
                            if(Game.getObjectById(creep.memory.target).hits == Game.getObjectById(creep.memory.target).hitsMax) {
                                creep.memory.target = null;
                            }
                        }
                    }
                }
                
            } else {
                if(creep.repair(Game.getObjectById(creep.memory.target)) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.getObjectById(creep.memory.target));
                }
                if(Game.getObjectById(creep.memory.target).hits == Game.getObjectById(creep.memory.target).hitsMax) {
                    creep.memory.target = null;
                }
            }
	    }
	    else {
	        var closeSource = creep.pos.findClosestByPath(FIND_SOURCES);
            if(creep.harvest(closeSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closeSource);
            }
	    }
	}
};

module.exports = roleBuilder;