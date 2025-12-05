const fs = require('fs').promises;

// now, include the fact they can remove more scroll when a cell is make empty (by removing by robot).
// find the new amount of scroll remove in total.

// read file.
async function readFileInput(){
    let path = `04/input.txt`;
    let output = null;

    // file read.
    output = await fs.readFile(path, 'utf8');

    // sanitize.
    output = output.split('\n')
        .filter((bank) => bank !== '');

    return output;
}

// main execution.
(async () => {

    console.log("--- exo 04 ---");

    let fewerAdj = 4;
    let countRollCanAxessThisTime = 0;
    let countRollCanAxess = 0;

    let gridRoll = [];
    await readFileInput().then(output => gridRoll = output);

    while(true){

        // brows all rolls.
        for(let y = 0; y<gridRoll.length; y++){
            for(let x = 0; x<gridRoll[y].length; x++){

                if(gridRoll[y][x] === '.')
                    continue;

                let rollAdj = 0;

                if(x-1 !== -1){

                    if(y-1 !== -1){

                        if(gridRoll[y-1][x-1] === '@')
                            rollAdj++;

                    }
                    if(y+1 !== gridRoll.length){

                        if(gridRoll[y+1][x-1] === '@')
                            rollAdj++;

                    }

                    if(gridRoll[y][x-1] === '@')
                        rollAdj++;

                }
                if(x+1 !== gridRoll[y].length){

                    if(y-1 !== -1){

                        if(gridRoll[y-1][x+1] === '@')
                            rollAdj++;

                    }
                    if(y+1 !== gridRoll.length){

                        if(gridRoll[y+1][x+1] === '@')
                            rollAdj++;

                    }

                    if(gridRoll[y][x+1] === '@')
                        rollAdj++;

                }

                if(y+1 !== gridRoll.length){
                    if(gridRoll[y+1][x] === '@')
                        rollAdj++;
                }
                if(y-1 !== -1){
                    if(gridRoll[y-1][x] === '@')
                        rollAdj++;
                }

                // verify count.
                if(rollAdj < fewerAdj){
                    countRollCanAxessThisTime++;

                    // replace roll.
                    //gridRoll[y] = gridRoll[y].replace(new RegExp(`^(?![.@]{8})(?=[.@]{1})(?![.@]{0,})$`), '.');
                    gridRoll[y] = gridRoll[y].substring(0, x) + '.' + gridRoll[y].substring(x+1);

                }

            }
        }

        // exit while.
        if(countRollCanAxessThisTime === 0)
            break;
        
        // increase cont total.
        countRollCanAxess += countRollCanAxessThisTime;

        // reset count.
        countRollCanAxessThisTime = 0;

    }

    // output.
    console.log(countRollCanAxess);

})();