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

    let sapins = output.map(e => {
        let nums = (e).match(/\d{1,}/g).map(e => Number(e));
        return {
            size: nums.slice(0, 2),
            shapeToFit: nums.slice(2)
        };
    });

    return {
        shapes: shapes,
        sapins: sapins
    };
}

function getVariantesOfShape(shape){
    let output = [];

    // mirror.
    for(let x=0; x<2; x++){
        for(let y=0; y<2; y++){
            
            for(let i=(x===0? 0: shape.length-1);(x===0? x<shape.length: x>=0); x+=(x===0? 1: -1))
                for(let j=(y===0? 0: shape[i].length-1);(y===0? j<shape[i].length: j>=0); j+=(y===0? 1: -1))
                    output.push([
                        [shape[i][j], shape[i][j], shape[i][j]],
                        [shape[i][j], shape[i][j], shape[i][j]],
                        [shape[i][j], shape[i][j], shape[i][j]]
                    ]);
        }
    }

    // rotate
    return output.map(e => {
        return [
            [
                [shape[0][0], shape[0][1], shape[0][2]],
                [shape[1][0], shape[1][1], shape[1][2]],
                [shape[2][0], shape[2][1], shape[2][2]]
            ],
            [
                [shape[2][0], shape[1][0], shape[0][0]],
                [shape[2][1], shape[1][1], shape[0][1]],
                [shape[2][2], shape[1][2], shape[0][2]]
            ],
            [
                [shape[2][2], shape[2][1], shape[2][0]],
                [shape[1][2], shape[1][1], shape[1][0]],
                [shape[0][2], shape[0][1], shape[0][0]]
            ],
            [
                [shape[0][2], shape[1][2], shape[2][2]],
                [shape[0][1], shape[1][1], shape[2][1]],
                [shape[0][0], shape[1][0], shape[2][0]]
            ]
        ];
    })
    .reduce((acu, e, i) => acu.concat(e));
}

function findMostOptiShape(shapes, space, shapeIndex){
    let mostOpti = {
        shape: null,
        pos: null,
        score: Number.NEGATIVE_INFINITY,
        indexShape: shapeIndex
    };

    shapes.forEach(shape => {

        // brows all emplacement in space.
        for(let y=0; y<space.length-2; y++){
            for(let x=0; x<space[0].length-2; x++){
                
                let currentScore = 0;
                let isShapCanFit = true;

                // brows square in shape.
                for(let y2=0; y2<shape.length; y2++){
                    for(let x2=0; x2<shape.length; x2++){
                        
                        // skip square empty.
                        if(!shape[y2][x2])
                            continue;

                        // if a square shape is busy in space.
                        if(space[y+y2][x+x2]){
                            isShapCanFit = false;
                            break;
                        }

                        // try square adjacent.
                        for(let y3=-1; y3<2; y3+=2){
                            for(let x3=-1; x3<2; x3+=2){
                                let _y = y2+y3;
                                let _x = x2+x3;

                                // if adjacent square is already busy in the shape (then do not score).
                                if(
                                    (_y >= 0 || _y <= shape.lenght) &&
                                    (_x >= 0 || _x <= shape[_y].lenght) &&
                                    (shape[_y][_x])
                                ){
                                    continue;
                                }
                                
                                _y += y;
                                _x += x;
                                let isInSpace = (
                                    (_y >= 0 || _y <= space.lenght) &&
                                    (_x >= 0 || _x <= space[_y].lenght)
                                );

                                // incrase score (if square is adjacent a border or another square placed).
                                if(
                                    (!isInSpace) ||
                                    (space[_y][_x])
                                ){
                                    currentScore++;
                                }

                            }
                        }

                    }
                    if(!isShapCanFit)
                        break;
                }

                // eval score.
                if(isShapCanFit && currentScore > mostOpti.score){
                    mostOpti.score = currentScore;
                    mostOpti.shape = shape;
                    mostOpti.pos = [x, y];
                }

            }
        }

    });

    if(mostOpti.shape === null)
        return null;

    return mostOpti;
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

    //console.log(data.shapes);
    //console.log(data.sapins);

    let sapinFeed = 0;
    data.sapins.forEach((sapin, sapinIndex) => {

        // make an empty space.
        let space = [];
        for(let y=0; y<sapin.size[0]; y++){
            space.push([]);
            for(let x=0; x<sapin.size[1]; x++){
                space[space.length-1].push(false);
            }
        }

        // loop until full feel (or no more shap fiting).
        while(true){

            // eval the most opti shape to place.
            let shapesPriorities = data.shapes.map((shape, shapeIndex) => {

                let shapeVariantes = getVariantesOfShape(shape);

                // TODO get the most opti shapes at the most opti place. (or null).
                return findMostOptiShape(shapeVariantes, space, shapeIndex);
            })
            .filter(e => e !== null);

            // skip this sapin (can't not fit).
            if(shapesPriorities.length === 0){
                console.log(`--- ${sapinIndex+1}/${data.sapins.length} --- [X]`);
                return;
            }

            // get the most opti shape in all valid brows.
            let shapeOpti = shapesPriorities
                .sort((a, b) => (a.valuePriority - b.valuePriority) * -1)[0];

            // place the shapeOpti in space.
            shapeOpti.shape.forEach((shapeY, y) => {
                shapeY.forEach((shapeX, x) => {
                    let _x = shapeOpti.pos[0] + x;
                    let _y = shapeOpti.pos[1] + y;
                    space[_y][_x] = true;
                })
            });

            // reduce the counter shape to place.
            sapin.shapeToFit[shapeOpti.indexShape] = sapin.shapeToFit[shapeOpti.indexShape] - 1;

            // verify if counter shape to place is zero (then break while).
            if(sapin.shapeToFit.every(e => e === 0)){
                console.log(`--- ${sapinIndex+1}/${data.sapins.length} --- [V]`);

                // increase counter.
                sapinFeed++;
                
                return;
            }

        }

    });


})();