var orders = require('orders');

var armyManager = {

  run: function(armyCreeps) {

    /*Checks through all creeps. If the creep has a job,
    runs its job method. If not, stores creep id in memory
    as an available creep for job assignment
    */

    for(var creepID in armyCreeps) {
      var creep = Game.getObjectById(creepID);
      if(creep.memory.order == 'defend') {
        orders.defendBase(creep);
      } else {
        creep.memory.order = 'defend';
        orders.defendBase(creep);
      }
    }

}

module.exports = armyManager;
