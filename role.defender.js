var roleDefender = {
    //prioritizes healers, attacks nerest otherwise
    /** @param {Creep} creep **/
    run: function(creep) {
        
        var hostileHealers = creep.room.find(FIND_HOSTILE_CREEPS, { filter: (creep) => (creep.getActiveBodyparts(HEAL) > 0) });
        
        if(hostileHealers.length) {
            if(creep.attack(hostileHealers[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(hostileHealers[0]);
            }
        }
        else {
            var nearEnemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            if(nearEnemy) {
                if(creep.attack(nearEnemy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(nearEnemy);
                }
            }
        }
    }
};

module.exports = roleDefender;