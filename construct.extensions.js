
  let constructExtensions = {
    run: room => {

      var controllerLevel = room.controller.level;
      var maxExtensions = CONTROLLER_STRUCTURES['extension'][controllerLevel];  // get max count from constant definitions

      // room.memory.forceExtensions = true;

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
          for (let name in Game.flags) {
            if (name == 'extensionBase_angle3') {
              let baseFlag = Game.flags[name]
              var baseX = baseFlag.pos.x;
              var baseY = baseFlag.pos.y;
              var clearestOffset = [-1,1];
            }
          }

          // visualize path between source and extension array
          for (n=1; n<=entryRoad; n++) {
            var pos = new RoomPosition(baseX + clearestOffset[0] * n, baseY + clearestOffset[1] * n, room.name);

            room.visual.circle(pos, {stroke: 'orange'});
            pos.createConstructionSite(STRUCTURE_ROAD);
          }

          // build extension array
          var extensionsCreated = 0;

          var n=entryRoad+1;
          while (extensionsCreated < maxExtensions) {
            var x = baseX + clearestOffset[0] * n;
            var y = baseY + clearestOffset[1] * n;

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

              var eoX = clearestOffset[0] * extensionOffsets[eo][0];
              var eoY = clearestOffset[1] * extensionOffsets[eo][1];

              room.visual.circle(x + eoX, y + eoY, {stroke: 'blue'});
              var result = room.createConstructionSite(x + eoX, y + eoY, STRUCTURE_EXTENSION); // build extension

              if (result === 0) {
                extensionsCreated++;
              }
              eo++;

            }
            n++;
          }

          room.memory.lastMaxExtensions = maxExtensions; // store for change detection
          room.memory.forceExtensions = false // reset manual trigger (comment to persist)
      }
  }
}

module.exports = constructExtensions
