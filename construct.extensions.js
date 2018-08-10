utilityFunctions = require('utilityFunctions');


var constructExtensions = {
    run: function(room) {
        //TODO Remember source in memory, only run find one time
        //find spawns
        var spawners = room.find(FIND_MY_SPAWNS);

        var source = spawners[0].pos.findClosestByRange(FIND_SOURCES);

        var p = utilityFunctions.findNextExtPos(source);

        if(p.x != 0 && p.y != 0) {
            console.log("construct at: " + p.x + " " + p.y)
            room.createConstructionSite(p.x, p.y, STRUCTURE_EXTENSION);
            room.createConstructionSite(p.x + 1, p.y, STRUCTURE_ROAD);
            room.createConstructionSite(p.x - 1, p.y, STRUCTURE_ROAD);
            room.createConstructionSite(p.x, p.y + 1, STRUCTURE_ROAD);
            room.createConstructionSite(p.x, p.y - 1, STRUCTURE_ROAD);
        }
    }
}


module.exports = constructExtensions;
