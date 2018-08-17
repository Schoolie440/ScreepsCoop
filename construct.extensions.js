
utilityFunctions = require('utilityFunctions');


var constructExtensions = {
    run: function(room) {

        var controllerLevel = room.controller.level;
        var maxExtensions = CONTROLLER_STRUCTURES['extension'][controllerLevel];  // get max count from constant definitions

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

            var depositPath = Math.ceil(extensionsToBuild / 4);

            // visualize path between source and extension array
            for (n=1; n<=entryRoad; n++) {
              room.visual.circle(baseX - n, baseY + n, {stroke: 'red'});
            }

            // visualize extension array
            for (n=entryRoad+1; n<=entryRoad + depositPath; n++) {
              var x = baseX - n;
              var y = baseY + n;
              room.visual.circle(x, y, {stroke: 'blue'}); // deposit road

              //show extensions
              room.visual.circle(x-1, y, {stroke: 'yellow'});
              room.visual.circle(x, y+1, {stroke: 'cyan'});
              room.visual.circle(x-1, y-1, {stroke: 'green'});
              room.visual.circle(x+1, y+1, {stroke: 'magenta'});

            }

            room.memory.lastMaxExtensions = maxExtensions; // store for change detection
        }
    }
}

module.exports = constructExtensions;
