let handlerSpawns = {
  run: spawn => {
    //Currently finds all creeps since right now all creeps are worker creeps
    //find all types of creeps for counting purposes
    // let workerCreeps = spawn.room.find(FIND_MY_CREEPS);
    let workerCreeps = _.filter(spawn.room.find(FIND_MY_CREEPS), creep => creep.memory.job != 'defender')

    //determine desired amounts of each body part
    let energyCap = spawn.room.energyCapacityAvailable
    let fifties = Math.floor(energyCap / 50)
    let works = Math.floor((fifties * 1) / 4)
    let carries = Math.floor((fifties * 1) / 4)
    let moves = Math.floor((fifties * 1) / 4)

    let bodyPartCap = 15

    if (works + carries + moves > bodyPartCap) {
      works = carries = moves = bodyPartCap / 3
    }

    let bodyParts = []

    //push desired number of each body part to array
    for (let i = 0; i < works; i++) {
      bodyParts.push(WORK)
    }
    for (let i = 0; i < carries; i++) {
      bodyParts.push(CARRY)
    }
    for (let i = 0; i < moves; i++) {
      bodyParts.push(MOVE)
    }

    if (Memory.needClaimer == true) {
      let check = spawn.createCreep([MOVE, CLAIM], null, { job: 'claim' })
      if (check == OK) {
        Game.memory.needClaimer = false
      }
    }

    //spawn creep, if conditions are correct
    if (workerCreeps.length < 7) {
      spawn.createCreep(bodyParts, null, { class: 'worker', job: null, target: null, working: false })
    }
    //emergency recovery creeps in case of genocide, prevents minimal energy amounts/
    //no production from halting the colony for extended period
    if (workerCreeps.length == 0) {
      spawn.createCreep([WORK, CARRY, MOVE], null, { class: 'worker', job: null, target: null, working: false })
    }
  },
}

module.exports = handlerSpawns
