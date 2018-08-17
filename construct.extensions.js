
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
            controller = room.controller;
            spawns = room.spawns;
            var sources = room.find(FIND_SOURCES_ACTIVE);
            var spawns = room.find(FIND_MY_SPAWNS);
            spawns.push(controller);

            //loop over all spawns / controllers, calculate distances to all spawns
            for (i=0; i < spawns.length; i++) {
              var store = spawns[i];

              for (n=0; n < sources.length; n++) {
                var spawn = sources[n];
                console.log(store, spawn);
              }
            }

            console.log('spawns', spawns);
            console.log('sources', sources);


            room.memory.lastMaxExtensions = maxExtensions; // store for change detection
        }
    }
}

module.exports = constructExtensions;
