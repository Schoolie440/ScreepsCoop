
//automatically places road construction locations along paths from sources to spawns/controllers
var constructRoads = {
    run: function(room) {
        //find spawns/sources
        var sources = room.find(FIND_SOURCES);
        var spawners = room.find(FIND_MY_SPAWNS);
        
        //loop through spawns/sources, find paths, create construction sites 
        for(var i in sources) {
            for(var j in spawners) {
                var path = room.findPath(sources[i].pos, spawners[j].pos, {ignoreCreeps: 'true'});
                for(var k in path) {
                    room.createConstructionSite(path[k].x, path[k].y, STRUCTURE_ROAD);
                }
            }
            
            //repeat for controller
            path = room.findPath(sources[i].pos, room.controller.pos, {ignoreCreeps: 'true'});
            for(var l in path) {
                room.createConstructionSite(path[l].x,path[l].y, STRUCTURE_ROAD);
            }
        }
    }
}


module.exports = constructRoads;