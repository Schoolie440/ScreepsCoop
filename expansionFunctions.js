const jobs = require('jobs')

let expansionFunctions = {
  roomCapture: flag => {
    let claimerCreep
    for (let creepName in Game.creeps) {
      if (Game.creeps[creepName].memory.job == 'claim') {
        claimerCreep = Game.creeps[creepName]
      }
    }

    if (claimerCreep == null) {
      //Spawn a claimer creep
      Memory.needClaimer = true
    } else {
      //have the creep claim the room
      jobs.captureRoom(claimerCreep, flag)
    }
  },

  roomHelp: function(flag) {
    let roomHelper
    for (let creepName in Game.creeps) {
      if (Game.creeps[creepName].memory.assignment == 'helpRoom') {
        roomHelper = Game.creeps[creepName]
      }
    }

    if (roomHelper == null) {
      let i = 0
      let found = false
      while (i < Object.keys(Game.creeps).length - 1 && !found) {
        roomHelper = Game.creeps[Object.keys(Game.creeps)[Object.keys(Game.creeps).length - 1 - i]]
        if (roomHelper.room != flag.room) {
          found = true
        }
        i++
      }
      roomHelper.memory.assignment = 'helpRoom'
      roomHelper.memory.job = 'moving'
    } else {
      jobs.helpRoom(roomHelper, flag)
    }
  },
}

module.exports = expansionFunctions
