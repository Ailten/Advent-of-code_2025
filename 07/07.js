const fs = require('fs').promises;

// on a tree coint the particule desending the tree.
// (tree is a file txt with 140 line of dot, on of two is full dotted).
// the first line have an S in center (starting) and some time ray meet a '|' to splet.
// find how many time it split.
// (in txt file some ray can overlayer other).

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

    return output;
}

// main execution.
(async () => {

    console.log(`--- exo ${folderName} ---`);

    let lines = await readFileInput();

    let indexs = [lines[0].indexOf('S')];
    lines.shift();

    let splitCount = 0;

    // loop on lines.
    lines.forEach(line => {

        let currentIndexs = [];

        // loop on char.
        line.split('').forEach((char, i) => {

            if(!indexs.includes(i))
                return;

            if(char === '^'){  // split.

                splitCount++;

                if(!currentIndexs.includes(i - 1))
                    currentIndexs.push(i - 1);
                currentIndexs.push(i + 1);

            }else{  // projet.

                if(!currentIndexs.includes(i))
                    currentIndexs.push(i);

            }

        });

        indexs = currentIndexs;

    });

    console.log(splitCount);

})();