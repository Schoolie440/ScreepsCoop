
//automatically places road construction locations along paths from sources to spawns/controllers
var constructRoads = {
    run: function(room) {
        //find spawns/sources
        var sources = room.find(FIND_SOURCES);
        
        var spawners = room.find(FIND_MY_SPAWNS);
        
        //loop through spawns/sources, find paths, create construction sites 
        if(!Memory.construction.control) {
            var path = room.findPath(sources[Memory.construction.srce].pos, spawners[Memory.construction.spawn].pos, {ignoreCreeps: 'true'});
            for(var k in path) {
                room.createConstructionSite(path[k].x, path[k].y, STRUCTURE_ROAD);
            }
        } else {
            path = room.findPath(room.controller.pos.findClosestByRange(FIND_SOURCES), room.controller.pos, {ignoreCreeps: 'true'});
            for(var l in path) {
                room.createConstructionSite(path[l].x,path[l].y, STRUCTURE_ROAD);
            }
        }
        
        if(!Memory.construction.control) {
            if(Memory.construction.srce < sources.length - 1) {
                Memory.construction.srce += 1;
            } else if (Memory.construction.spawn < spawners.length - 1) {
                Memory.construction.srce = 0;
                Memory.construction.spawn += 1;
            } else {
                Memory.construction.srce = 0;
                Memory.construction.spawn = 0;
                Memory.construction.control = 1;
            }
        } else {
            Memory.construction.control = 0;
        }
    }
}


module.exports = constructRoads;