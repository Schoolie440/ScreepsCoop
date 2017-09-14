var towerControls = {
    
    attack: function(tower) {
        if(tower) {
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }
        }
    },
    
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