let handlerArmySpawn = {
  run: (spawn, armyCreeps) => {
    //determines desired number of each body part
    let energyCap = spawn.room.energyCapacityAvailable
    let hundreds = Math.floor(energyCap / 100)
    let toughs = Math.floor(((hundreds * 1) / 3) * 2)
    let attacks = Math.floor((hundreds * 1) / 3)
    let moves = Math.floor(((hundreds * 1) / 3) * 3)

    let bodyParts = []

    //pushes desired number of each body part into array
    for (let i = 0; i < toughs; i++) {
      bodyParts.push(TOUGH)
    }
    for (let i = 0; i < moves; i++) {
      bodyParts.push(MOVE)
    }
    for (let i = 0; i < attacks; i++) {
      bodyParts.push(ATTACK)
    }

    let newJob
    let make = false

    //construct armyCreeps, little fast ones first, then big ones
    if (armyCreeps.length < 3) {
      newJob = 'defender'
      bodyParts = [MOVE, MOVE, ATTACK, ATTACK]
      make = true
    } else if (armyCreeps.length < 6) {
      newJob = 'defender'
      make = true
    }

    //spawn armyCreeps, if conditions are correct
    if (make) {
      console.log('Spawning Defender')
      spawn.createCreep(bodyParts, null, { class: 'army', job: newJob })
    }
  },
}

module.exports = handlerArmySpawn
