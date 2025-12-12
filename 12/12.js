const fs = require('fs').promises;

// you have a list of shape (the gift), and you need to make fit a various amount of theeze shapes in a rectangle (size send).
// for eatch rectangle, try if it can feet all.
// count how many rectangle can handle the amount of shapes it's attributed.
// shape (gift) is 3x3 and can be # or . (took place or not, on the gred).

// folder name.
const folderName = __filename.split('/').filter(folder => (/^\d{2}$/).test(folder))[0];

// read file.
async function readFileInput(dataStr = undefined){
    let output = [];

    if(dataStr === undefined){

        let path = `${folderName}/input.txt`;
    
        // file read.
        output = await fs.readFile(path, 'utf8');

        // sanitize.
        output = output.split('\n');
        output.pop();

    }else{
        output = dataStr.split('\n');
    }

    let shapes = [];
    for(let i=0; true; i++){
        let l = output[i];
        if((/^\d[:]$/).test(l)){
            shapes.push([
                [output[i+1][0]==='#', output[i+1][1]==='#', output[i+1][2]==='#'],
                [output[i+2][0]==='#', output[i+2][1]==='#', output[i+2][2]==='#'],
                [output[i+3][0]==='#', output[i+3][1]==='#', output[i+3][2]==='#']
            ]);
            i+=4; // skip the block and the space.
        }else{
            output = output.slice(i);
            break;
        }
    }

    let sapin = output.map(e => {
        let nums = (e).match(/\d{1,}/g).map(e => Number(e));
        return {
            size: nums.slice(0, 2),
            shapeToFit: nums.slice(2)
        };
    });

    return {
        shapes: shapes,
        sapin: sapin
    };
}

(async () => {

    console.log(`--- exo ${folderName} ---`);

    let data = await readFileInput();

    //*/
    data = await readFileInput(
`0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###

4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2`
    );
    //*/

    console.log(data.shapes);
    console.log(data.sapin);


})();