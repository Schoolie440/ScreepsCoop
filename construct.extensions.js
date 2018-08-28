  let constructExtensions = {
    run: room => {

      var controllerLevel = room.controller.level;
      var maxExtensions = CONTROLLER_STRUCTURES['extension'][controllerLevel];  // get max count from constant definitions

      // room.memory.forceExtensions = true;
      // room.memory.forceExtensions = false;

      if (room.memory.lastMaxExtensions != maxExtensions || room.memory.forceExtensions) { // forceExtensions is a manual override for development

          var extensions = room.find(FIND_MY_STRUCTURES, {
              filter: { structureType: STRUCTURE_EXTENSION }
          });

          var extensionCount = extensions.length;
          var extensionsToBuild = maxExtensions - extensionCount;

          if (extensionCount < maxExtensions) {
            console.log('need to build ' + (extensionsToBuild) + ' extensions in room ' + room.name);
          }

          var entryRoad = 1; // length of road between source and extension array

          // flag based positioning
          let roomFlags = room.find(FIND_FLAGS);

          var flagFound = false;
          var arrayOffset = null;

          for (let f in roomFlags) {
            let flag = roomFlags[f];

            if (flag.name == 'extensionBase_angle3') {
              switch(flag.name) {
                case 'extensionBase_NE':
                  arrayOffset = [-1,1];
                  flagFound = true;
                  break;
                case 'extensionBase_NW':
                  arrayOffset = [-1,1];
                  flagFound = true;
                  break;
                case 'extensionBase_SW':
                  arrayOffset = [-1,1];
                  flagFound = true;
                  break;
                case 'extensionBase_SE':
                  arrayOffset = [-1,1];
                  flagFound = true;
                  break;
              }

              let baseFlag = flag;
              var baseX = baseFlag.pos.x;
              var baseY = baseFlag.pos.y;
              flagFound = true;
            }
          }

          if (flagFound) {
            // visualize path between source and extension array
            for (n=1; n<=entryRoad; n++) {
              var pos = new RoomPosition(baseX + arrayOffset[0] * n, baseY + arrayOffset[1] * n, room.name);

              room.visual.circle(pos, {stroke: 'orange'});
              pos.createConstructionSite(STRUCTURE_ROAD);
            }

            // build extension array
            var extensionsCreated = 0;

            var n=entryRoad+1;
            while (extensionsCreated < extensionsToBuild) {
              var x = baseX + arrayOffset[0] * n;
              var y = baseY + arrayOffset[1] * n;

              room.visual.circle(x, y, {stroke: 'green'}); // deposit road
              room.createConstructionSite(x, y, STRUCTURE_ROAD); // build deposit road

              // array of offsets from each deposit path point to extension locations
              let extensionOffsets = [
                [1, 0],
                [0, 1],
                [1, -1],
                [-1, 1],
              ]

              var eo = 0;
              while (eo < extensionOffsets.length) { // build extensions for each deposit path point, until all extensions are built

                var eoX = arrayOffset[0] * extensionOffsets[eo][0];
                var eoY = arrayOffset[1] * extensionOffsets[eo][1];

                room.visual.circle(x + eoX, y + eoY, {stroke: 'blue'});
                var result = room.createConstructionSite(x + eoX, y + eoY, STRUCTURE_EXTENSION); // build extension
                console.log(result)
                if ((result === 0) || (result == -14)) {
                  extensionsCreated++;
                }
                eo++;

              }
              n++;
            }
          }

          room.memory.lastMaxExtensions = maxExtensions; // store for change detection
          room.memory.forceExtensions = false // reset manual trigger (comment to persist)
      }
  }
}

module.exports = constructExtensions
