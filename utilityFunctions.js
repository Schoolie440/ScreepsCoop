
var utilityFunctions = {
    
    findNextExtPos: function(source) {
        
        var p = {
            x: 0,
            y: 0
        };
        
        p.x = source.pos.x - 2;
        p.y = source.pos.y + 2;
        
        var lap = 0;
        var count = 0;
        var dir = 0;

        
        do {
            console.log(p.x);
            console.log(p.y);
            var spot = source.room.lookAt(p.x,p.y);
            
            var good = utilityFunctions.checkSpot(spot);
            
            if(!good) {
                if(count < lap + 2) {
                    switch(dir % 5) {
                        case 0:
                            p.y -= 2;
                            break;
                        case 1:
                            p.x += 2;
                            break;
                        case 2:
                            p.y += 2;
                            break;
                        case 3:
                            p.x -= 2;
                            break;
                        case 4:
                            p.x -= 1;
                            p.y += 1;
                            lap++;
                            count = lap + 2;
                            break;
                    }
                    
                count++;
                
                } else {
                    count = 0;
                    dir++
                }
            }
        } while(!good);
        
        return p;
            
    },
    
    checkSpot: function(spot) {
        
        var good = true;
        
        for(var i in spot) {
            console.log(spot[i].type);
            switch(spot[i].type) {
                case LOOK_STRUCTURES:
                    good = false;
                    break;
                case LOOK_SOURCES:
                    good = false;
                    break;
                case LOOK_MINERALS:
                    good = false;
                    break;
                case LOOK_FLAGS:
                    good = false;
                    break;
                case LOOK_CONSTRUCTION_SITES:
                    good = false;
                    break;
                case LOOK_NUKES:
                    good = false;
                    break;
                case LOOK_CONSTRUCTION_SITES:
                    good = false;
                    break;
                case LOOK_TERRAIN:
                    console.log("reached terrain");
                    if(spot[i].terrain == 'wall') {
                        console.log("found wall");
                        good = false
                    }
            }
        }
        return good;
    }
}

module.exports = utilityFunctions;