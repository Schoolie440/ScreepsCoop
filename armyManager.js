const orders = require('orders')

let armyManager = {
  run: armyCreeps => {
    /*Checks through all creeps. If the creep has a job,
    runs its job method. If not, stores creep id in memory
    as an available creep for job assignment
    */

    for (let i in armyCreeps) {
      let creep = Game.getObjectById(armyCreeps[i])
      if (creep.memory.order == 'defend') {
        orders.defendBase(creep)
      } else if (creep.memory.order == 'attack') {
        orders.attackBase(creep)
      } else if (creep.memory.order == null) {
        creep.room.memory.availableArmyCreeps.push(creep.id)
      }
    }
  },
}

module.exports = armyManager
