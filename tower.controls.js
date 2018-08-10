
//set of tower control functions
var towerControls = {
    
    //attacks healers first, then nearest enemy
    attack: function(tower) {
        var hostileHealers = tower.room.find(FIND_HOSTILE_CREEPS, { filter: (creep) => (creep.getActiveBodyparts(HEAL) > 0) });
        
        if(hostileHealers.length) {
            tower.attack(hostileHealers[0]);
        }
        else {
            var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(target) {
                tower.attack(target);
            }
        }
    },
    
    //Repairs walls/ramparts only, choosing proportionally weakest first
    repairWalls: function(tower) {
        if(tower) {
            const targets = tower.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) &&
                            structure.hits < structure.hitsMax;
                    }
            });
            targets.sort((a,b) => a.hits/a.hitsMax - b.hits/b.hitsMax);
            
            tower.repair(targets[0]);
                
        }
    },
    
    //repairs roads only, choosing proportionally weakest first
    repairRoads: function(tower) {
        if(tower) {
            const targets = tower.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_ROAD) &&
                            structure.hits < structure.hitsMax;
                    }
            });
            targets.sort((a,b) => a.hits/a.hitsMax - b.hits/b.hitsMax);
            
            tower.repair(targets[0]);
                
        }
    },
    //repairs anything, proportionally weakest first
    repairAll: function(tower) {
        if(tower) {
            const targets = tower.room.find(FIND_STRUCTURES, {
                    filter: (object) => {
                        return object.hits < object.hitsMax;
                    }
            });
            targets.sort((a,b) => a.hits/a.hitsMax - b.hits/b.hitsMax);
            
            tower.repair(targets[0]);
                
        }
    },
    
    //repairs down to half energy, prioritizes attack in any instance
    combo: function(tower) {
        
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var defenders = tower.room.find()
        
        if(closestHostile) {
            tower.attack(closestHostile);
        }
        else if(tower.energy > tower.energyCapacity/2) {
            const targets = tower.room.find(FIND_STRUCTURES, {filter: object => object.hits < object.hitsMax});
            targets.sort((a,b) => a.hits - b.hits);
            tower.repair(targets[0]);
                
        }
    }
};

module.exports = towerControls;