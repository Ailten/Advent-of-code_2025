const fs = require('fs').promises;

// now, make the same but this time take the numbers as the vertical value.
// ex : 12   23  1
//      101 111 12
//       55   3 2
//      +   *   *
// on this patern you have to make : (12 * 12) + (313 * 21 * 1) + (15 + 205 + 11)
// (numbers have no space into verticaly, and operator is set at first char always).

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
    output.pop(); // remove last line (an empty line).

    let operatorsRaw = output.pop();
    let operators = operatorsRaw.replace(/ /g,'').split('');
    console.log(operators);
    let numbersRaw = output;

    let numbers = [];
    operatorsRaw.split('').forEach((charOperatorRaw, i) => {
        if(charOperatorRaw !== ' '){  // push a new column number.
            numbers.push([]);
        }
        if(i+1 !== operatorsRaw.length && operatorsRaw[i+1] !== ' '){  // if next is a new column, this one is an empty space (skip).
            return;
        }

        let verticalNumStr = numbersRaw.map(line => line[i]).join('');
        numbers[numbers.length-1].push(Number(verticalNumStr.trim()));
    });

    // structure has obj.
    let outputObj = {
        numbers: numbers,
        operators: operators
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
                result += numbers[i].reduce((accumulator, currentValue) => accumulator + currentValue);
                break;
            case('*'):
                result += numbers[i].reduce((accumulator, currentValue) => accumulator * currentValue);
                break;
        }

    });

    console.log(result);

})();