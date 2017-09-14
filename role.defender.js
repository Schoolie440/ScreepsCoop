var roleDefender = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        var nearEnemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if(nearEnemy) {
            if(creep.attack(nearEnemy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(nearEnemy);
            }
        }
    }
};

module.exports = roleDefender;