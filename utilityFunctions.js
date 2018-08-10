
var utilityFunctions = {

    findNextExtPos: function(source) {
            var spot = source.room.lookAt(Memory.construction.extp.x, Memory.construction.extp.y);

            var good = utilityFunctions.checkSpot(spot);

            if(!good) {
                console.log(Memory.construction.extp.x, Memory.construction.extp.y)
                if(Memory.construction.count < Memory.construction.lap + 2) {
                    switch(Memory.construction.dir % 5) {
                        case 0:
                            Memory.construction.extp.y -= 2;
                            break;
                        case 1:
                            Memory.construction.extp.x += 2;
                            break;
                        case 2:
                            Memory.construction.extp.y += 2;
                            break;
                        case 3:
                            Memory.construction.extp.x -= 2;
                            break;
                        case 4:
                            Memory.construction.extp.x -= 1;
                            Memory.construction.extp.y += 1;
                            Memory.construction.lap++;
                            Memory.construction.count = Memory.construction.lap + 2;
                            break;
                    }
                    console.log(Memory.construction.extp.x, Memory.construction.extp.y)

                    Memory.construction.count++;
<<<<<<< HEAD
=======
                    return {x: 0, y: 0};
>>>>>>> 1044cb172f08f5b90a315aa9359ca7925692484c

                } else {

                    Memory.construction.count = 0;
                    Memory.construction.dir++;

                    return {x: 0, y: 0};
                }
            } else {
              return Memory.construction.extp;
            }

<<<<<<< HEAD
        return Memory.construction.extp;
=======
>>>>>>> 1044cb172f08f5b90a315aa9359ca7925692484c
    },


    checkSpot: function(spot) {

        var good = true;

        for(var i in spot) {
            console.log("Checking spot : ", Memory.construction.extp.x, Memory.construction.extp.y);
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
                        good = false;
                    }
            }
        }
        console.log(good);
        return good;
    }
};

module.exports = utilityFunctions;
