'use strict';


function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function getRandomColor(change = 0) {

    console.log('HERE!');
    
    var randomColor = [
        Math.ceil(Math.random() * 255),
        Math.ceil(Math.random() * 255),
        Math.ceil(Math.random() * 255)
    ];

    for (var i = 0; i < 3; i++) {

        if (randomColor[i] + change > 255) randomColor[i] = 255;
        else if (randomColor[i] + change < 0) randomColor[i] = 0;
    }

    return "#" + componentToHex(randomColor[0]) + componentToHex(randomColor[1]) + componentToHex(randomColor[2]);
}