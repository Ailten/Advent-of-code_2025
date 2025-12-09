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

function isLineCrossing(posA1, posA2, posB1, posB2){

    let lineTwoEndBis = [
        posB1[0] - 2*(posB2[0] - posB1[0]),
        posB1[1] - 2*(posB2[1] - posB1[1])
    ];
    
    let den = ( //if line paralèle.
        (posA1[0] - posA2[0]) *
        (posB1[1] - lineTwoEndBis[1]) - 
        (posA1[1] - posA2[1]) * 
        (posB1[0] - lineTwoEndBis[0])
    );
    if(den == 0)
        return null;
    
    let t = (
        (posA1[0] - posB1[0]) * 
        (posB1[1] - lineTwoEndBis[1]) - 
        (posA1[1] - posB1[1]) * 
        (posB1[0] - lineTwoEndBis[0])
    ) /den;
    let u = -(
        (posA2[0] - posA1[0]) * 
        (posA1[1] - posB1[1]) - 
        (posA2[1] - posA1[1]) * 
        (posA1[0] - posB1[0])
    ) /den;
    
    //dont colide.
    if(t<0 || t>1 || u<0 || u>1)
        return null;

    //vérifie le dépacement des limite du miroire.
	let limite = [
		posB1[0] + u*(lineTwoEndBis[0] - posB1[0]),
		posB1[1] + u*(lineTwoEndBis[1] - posB1[1])
    ];
	if(dist(posB1, posB2) < dist(posB1, limite))
		return null;
	
	let out = [
		Math.round(posA1[0] + t*(posA2[0] - posA1[0])),
		Math.round(posA1[1] + t*(posA2[1] - posA1[1]))
    ];
	
	return out; //find an intersection.
}

function dist(a, b){
    let difX = Math.abs(a[0] - b[0]);
    let difY = Math.abs(a[1] - b[1]);
    return Math.sqrt(difX*difX + difY*difY);
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

            let corner3 = [p1[0], p2[1]];
            let corner4 = [p2[0], p1[1]];

            // if 4 lignes rectangle is crossing one of the lines.
            let isCrossing = false;
            poss.forEach((e, i) => {
                if(isCrossing)
                    return;
                let i2 = (i+1)%poss.length;
                if(isLineCrossing(p1, corner3, e, poss[i2]) !== null)
                    isCrossing = true;
                if(isLineCrossing(p1, corner4, e, poss[i2]) !== null)
                    isCrossing = true;
                if(isLineCrossing(p2, corner3, e, poss[i2]) !== null)
                    isCrossing = true;
                if(isLineCrossing(p2, corner4, e, poss[i2]) !== null)
                    isCrossing = true;
            });
            if(isCrossing)
                continue;

            // verify if both corner are inside the forme.

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

    //4748826374  (to height)

})();