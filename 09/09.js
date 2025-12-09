const fs = require('fs').promises;

// you have a list of position (vector2).
// find the bigest rectangle you can make with two of theese position (as corecter rectangle).
// return the era of this rectangle.
// (include the corner in the length of rectangle).

// folder name.
const folderName = __filename.split('/').filter(folder => (/^\d{2}$/).test(folder))[0];

// read file.
async function readFileInput(){
    let path = `${folderName}/input.txt`;
    let output = null;

    // file read.
    output = await fs.readFile(path, 'utf8');

    // sanitize.
    output = output.split('\n');
    output.pop();

    output = output.map(line => line.split(','));

    return output;
}

function evalAir(a, b){
    let difX = Math.abs(a[0] - b[0]) +1;
    let difY = Math.abs(a[1] - b[1]) +1;
    return difX * difY;
}

// main execution.
(async () => {

    console.log(`--- exo ${folderName} ---`);

    let poss = await readFileInput();

//    poss = [
//"7,1".split(','),
//"11,1".split(','),
//"11,7".split(','),
//"9,7".split(','),
//"9,5".split(','),
//"2,5".split(','),
//"2,3".split(','),
//"7,3".split(',')
//    ];

    let bigestRect = {
        i1: -1,
        i2: -1,
        air: -1
    };
    for(let i=0; i<poss.length; i++){
        let p1 = poss[i];

        for(let j=i+1; j<poss.length; j++){
            p2 = poss[j];

            let air = evalAir(p1, p2);
            if(air > bigestRect.air){
                bigestRect.i1 = i;
                bigestRect.i2 = j;
                bigestRect.air = air;
            }
        }
    }

    console.log(`${poss[bigestRect.i1]} - ${poss[bigestRect.i2]}`)
    console.log(bigestRect.air);

    //4748688420 (to low).
    //4748826374 (v)

})();