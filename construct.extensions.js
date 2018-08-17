
utilityFunctions = require('utilityFunctions');


var constructExtensions = {
    run: function(room) {

        var controllerLevel = room.controller.level;  //TODO: Generalize for multiple rooms / spawns
        var maxExtensions = CONTROLLER_STRUCTURES['extension'][controllerLevel];
        var extensions = room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_EXTENSION }
        });
        var extensionCount = extensions.length;

        if (extensionCount < maxExtensions) {
          console.log('need to build ' + (maxExtensions - extensionCount) + ' extensions in room ' + room.name);
        }
    }
}

module.exports = constructExtensions;
