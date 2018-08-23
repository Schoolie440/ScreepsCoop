var orders = require('orders');

var armyManager = {

  run: function(armyCreeps) {

    /*loops through all rooms and clears the decisionmaking
    data from each so it can be recalculated
    */
    for(var roomName in Game.rooms) {
      var room = Game.rooms[roomName];

    }


    /*Checks through all creeps. If the creep has a job,
    runs its job method. If not, stores creep id in memory
    as an available creep for job assignment
    */

    for(var creepID in armyCreeps) {
      var creep = Game.getObjectById(creepID);
      if(creep.memory.order == 'defend') {
        orders.defendBase(creep);
      }
    }

    for(var roomName in Game.rooms) {
      var room = Game.rooms[roomName];

    }
}

module.exports = armyManager;
