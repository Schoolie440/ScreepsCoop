utilityFunctions = require('utilityFunctions');


var constructExtensions = {
    run: function(room) {
        //find spawns/sources
        var sources = room.find(FIND_SOURCES);
        var spawners = room.find(FIND_MY_SPAWNS);
        
        for(var i in spawners) {
            var source = spawners[i].pos.findClosestByRange(FIND_SOURCES);
        }
        
        var p = utilityFunctions.findNextExtPos(source);
        
        
        console.log("construct at: " + p.x + " " + p.y)
        room.createConstructionSite(p.x, p.y, STRUCTURE_EXTENSION);
        
    }
}


module.exports = constructExtensions;