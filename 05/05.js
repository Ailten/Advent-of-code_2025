const fs = require('fs').promises;

// in a kitchen, some ingredient ar "fresh" and other are "spoiled".
// the info of what id ingredients are fresh or spoiled is set like this :
// - a pair of id ('3-5') by line, mean a range of "fresh" ingredient. (start and end inclides).
// - a blank line (separator).
// - a id of "available" incredient (many line of one id).
// "available" mean it's an id of an incredients. (not determined if it's fresh or spoiled).
// find how many ingredient (available) are "fresh".

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

    // structure has obj.
    let outputObj = {
        freshRanges: output.filter(line => (/^\d{1,}-\d{1,}$/).test(line))
            .map(line => {
                return {
                    min: Number((/^\d{1,}/).exec(line)[0]),
                    max: Number((/\d{1,}$/).exec(line)[0]),
                };
            }),
        availables: output.filter(line => (/^\d{1,}$/).test(line))
    };

    return outputObj;
}

// main execution.
(async () => {

    console.log(`--- exo ${folderName} ---`);

    let freshCount = 0;

    // get data.
    let availables = [];
    let freshRanges = [];
    await readFileInput().then(output => {
        availables = output.availables;
        freshRanges = output.freshRanges;
    });

    // loop ingredients.
    availables.forEach(id => {

        let isFresh = false;

        freshRanges.forEach(rangeFresh => {
            
            // break if already find as fresh.
            if(isFresh){
                return;
            }

            // find in range fresh.
            if(id >= rangeFresh.min && id <= rangeFresh.max)
                isFresh = true;

        });

        if(isFresh){
            freshCount++;
        }

    });

    console.log(freshCount);

})();