
utilityFunctions = require('utilityFunctions');


var constructExtensions = {
    run: function(room) {

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

            // load sources, spawns, and controller
            var controller = room.controller;
            var sources = room.find(FIND_SOURCES_ACTIVE);
            var spawns = room.find(FIND_MY_SPAWNS);
            spawns.push(controller); // add controller to list of places to take energy


            var longestShortestTrip = 0; // initialize for longest distance between source and nearest storage location

            //loop over all spawns / controllers, calculate distances to all spawns
            for (n=0; n < sources.length; n++) {
              var source = sources[n];

              var shortestTrip = 999; // initialize for distance to nearest storage location to this spawn
              for (i=0; i < spawns.length; i++) {
                var store = spawns[i];
                var distance = store.pos.findPathTo(source).length;

                shortestTrip = Math.min(distance, shortestTrip); // shortest trip between this source and a storage location
              }

              longestShortestTrip = Math.max(shortestTrip, longestShortestTrip);
              if (longestShortestTrip == shortestTrip) {  // find the source with the longest shortest trip, this is where we'll put the first extensions
                var mostIsolatedSource = source;
              }

            }

            room.visual.circle(mostIsolatedSource.pos,
              {fill: 'transparent', radius: 1, stroke: 'red'}); // draw circle to verify we found the right spawns


            // build extension array based on this method: https://screeps.com/forum/topic/136/compact-extension-arrays
            var baseX = mostIsolatedSource.pos.x;
            var baseY = mostIsolatedSource.pos.y;

            var entryRoad = 3; // length of road between source and extension array

            var depositPath = Math.ceil(maxExtensions / 4); // length of deposit path assuming 4 extensions per step


            // offsets for each 45 degree vector
            var offsets = [
              [ 1,  1],
              [ 1, -1],
              [-1,  1],
              [-1, -1]
            ];

            var clearRanges = [0, 0, 0, 0]; // placeholder for clear distances in each direction

            for (o=0; o<offsets.length; o++) { // loop over each 45 degree direction
              var offset = offsets[o];
              var oX = offset[0];
              var oY = offset[1];

              var r = 2; // start angle for check
              var clear = true; // loop logical check, goes false when a wall is found

              while (clear) { // haven't hit a wall yet
                var x = baseX + oX * r;
                var y = baseY + oY * r;

                // room.visual.circle(x, y, {stroke: 'orange'});
                var terrainCheck = Game.map.getTerrainAt(x, y, room.name);
                if (terrainCheck == 'wall') {
                  clear = false; // found a wall, break loop
                  clearRanges[o] = r; // store range in array
                }
                r++; // go one step further
              }
            }

            var offsetIndex = clearRanges.indexOf(Math.max.apply(null, clearRanges)); // get index of farthest clear distance
            var clearestOffset = offsets[offsetIndex]; // offset vector for clearest direction

            // visualize path between source and extension array
            for (n=1; n<=entryRoad; n++) {
              var pos = new RoomPosition(baseX + clearestOffset[0] * n, baseY + clearestOffset[1] * n, room.name);

              room.visual.circle(pos, {stroke: 'orange'});
              pos.createConstructionSite(STRUCTURE_ROAD);
            }

            var extensionsCreated = 0;

            // build extension array
            var extensionsCreated = 0;

            // for (n=entryRoad+1; n<=entryRoad + depositPath; n++) { //start at end of entry road, step over each point in deposit path
            var n=entryRoad+1;
            while (extensionsCreated < maxExtensions) {
              var x = baseX + clearestOffset[0] * n;
              var y = baseY + clearestOffset[1] * n;

              room.visual.circle(x, y, {stroke: 'green'}); // deposit road
              room.createConstructionSite(x, y, STRUCTURE_ROAD); // build deposit road

              // array of offsets from each deposit path point to extension locations
              extensionOffsets = [
                [1, 0],
                [0, 1],
                [1, -1],
                [-1, 1],
              ]

              var eo = 0;
              while (extensionsCreated < maxExtensions && eo < extensionOffsets.length) { // build extensions for each deposit path point, until all extensions are built

                var eoX = clearestOffset[0] * extensionOffsets[eo][0];
                var eoY = clearestOffset[1] * extensionOffsets[eo][1];

                room.visual.circle(x + eoX, y + eoY, {stroke: 'blue'});
                room.createConstructionSite(x + eoX, y + eoY, STRUCTURE_EXTENSION); // build extension
                extensionsCreated++;
                eo++;

              }
            }

            room.memory.lastMaxExtensions = maxExtensions; // store for change detection
            room.memory.forceExtensions = false // reset manual trigger (comment to persist)
        }
    }
}

module.exports = constructExtensions;
