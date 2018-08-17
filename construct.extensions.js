
utilityFunctions = require('utilityFunctions');


var constructExtensions = {
    run: function(room) {

        var controllerLevel = room.controller.level;
        
        if (room.memory.lastControllerLevel != controllerLevel) {
            var maxExtensions = CONTROLLER_STRUCTURES['extension'][controllerLevel];  // get max count from constant definitions

            var extensions = room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_EXTENSION }
            });

            var extensionCount = extensions.length;

            if (extensionCount < maxExtensions) {
              console.log('need to build ' + (maxExtensions - extensionCount) + ' extensions in room ' + room.name);
            }

            // find sources, spawns, and controller
            controllerPos = room.controller.pos;

            console.log(controllerPos);

            room.memory.lastControllerLevel = controllerLevel;
        }
    }
}

module.exports = constructExtensions;
