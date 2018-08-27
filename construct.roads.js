//automatically places road construction locations along paths from sources to spawns/controllers
let constructRoads = {
  run: room => {
    if (!room.memory.roadsBuilt) {
      console.log('Building Roads')

      //find spawns/sources
      let sources = room.find(FIND_SOURCES)
      let spawners = room.find(FIND_MY_SPAWNS)
      let extensions = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION } })

      //loop through spawns/sources, find paths, create construction sites
      for (let i in sources) {
        for (let j in spawners) {
          let path = room.findPath(sources[i].pos, spawners[j].pos, { ignoreCreeps: 'true' })
          for (let k in path) {
            room.createConstructionSite(path[k].x, path[k].y, STRUCTURE_ROAD)
          }
        }

        //repeat for controller
        let path = room.findPath(sources[i].pos, room.controller.pos, { ignoreCreeps: 'true' })
        for (let l in path) {
          room.createConstructionSite(path[l].x, path[l].y, STRUCTURE_ROAD)
        }
      }

      for (let m in extensions) {
        room.createConstructionSite(extensions[m].pos.x + 1, extensions[m].pos.y, STRUCTURE_ROAD)
        room.createConstructionSite(extensions[m].pos.x - 1, extensions[m].pos.y, STRUCTURE_ROAD)
        room.createConstructionSite(extensions[m].pos.x, extensions[m].pos.y + 1, STRUCTURE_ROAD)
        room.createConstructionSite(extensions[m].pos.x, extensions[m].pos.y - 1, STRUCTURE_ROAD)
      }

      room.memory.roadsBuilt = true
    }
  },
}

module.exports = constructRoads
