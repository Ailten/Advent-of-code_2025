const fs = require('fs').promises;

//

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
    let countRollCanAxess = 0;

    let gridRoll = [];
    await readFileInput().then(output => gridRoll = output);

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
            if(rollAdj < fewerAdj)
                countRollCanAxess++;

        }
    }

    // output.
    console.log(countRollCanAxess);

})();