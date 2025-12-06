const fs = require('fs').promises;

// make some math, based on a file fill of numbers and operator :
// the 4 first line is numbers separate by various space (in a way to all numbers are on a same column char in, example).
// som column are 2 length, some 4, and the unit number is not eatch time align.
// ex : 12   23  1
//      101 111 12
//       55   3 2
// the last line is the operator signe (+ or *).
// ex : +   *   *
// calcul the operator aply to eatch column numbers.
// return the sum of all column result.
// on this patern you have to make : (12 + 101 + 55) + (23 * 111 * 3) + (1 * 12 * 2)

// folder name.
const folderName = __filename.split('/').filter(folder => (/^\d{2}$/).test(folder))[0];

// read file.
async function readFileInput(){
    let path = `${folderName}/input.txt`;
    let output = null;

    // file read.
    output = await fs.readFile(path, 'utf8');

    // sanitize.
    output = output.split('\n')
        .map(line => line
            .split(' ')
            .filter(cel => cel !== '')
        );
    output.pop(); // remove last line (an empty line).

    // structure has obj.
    let outputObj = {
        numbers: output.slice(0, output.length - 1) // take all exept last line.
            .map(line => line
                .map(cel => Number(cel))
            ),
        operators: output[output.length - 1]
    };

    return outputObj;
}

// main execution.
(async () => {

    console.log(`--- exo ${folderName} ---`);

    let result = 0;

    let numbers, operators;
    await readFileInput().then(output => {
        numbers = output.numbers;
        operators = output.operators;
    });

    // loop on operators.
    operators.forEach((operator, i) => {

        switch(operator){
            case('+'):
                result += numbers.map(line => line[i]).reduce((accumulator, currentValue) => accumulator + currentValue);
                break;
            case('*'):
                result += numbers.map(line => line[i]).reduce((accumulator, currentValue) => accumulator * currentValue);
                break;
        }

    });

    console.log(result);

})();