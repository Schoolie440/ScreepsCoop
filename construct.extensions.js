
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

            if (extensionCount < maxExtensions) {
              console.log('need to build ' + (maxExtensions - extensionCount) + ' extensions in room ' + room.name);
            }

            // find sources, spawns, and controller
            var controller = room.controller;
            var sources = room.find(FIND_SOURCES_ACTIVE);
            var spawns = room.find(FIND_MY_SPAWNS);
            spawns.push(controller); // add controller to list of places to take energy


            var longestShortestTrip = 0;
            //loop over all spawns / controllers, calculate distances to all spawns
            for (n=0; n < sources.length; n++) {
              var source = sources[n];

              var shortestTrip = 999;
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



            room.memory.lastMaxExtensions = maxExtensions; // store for change detection
        }
    }
}

module.exports = constructExtensions;
