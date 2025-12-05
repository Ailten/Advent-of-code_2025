const fs = require('fs').promises;

// 

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
            }).sort((a, b) => a.min - b.min),
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

    let valueMaxSaved = 0;

    // loop on ranges.
    freshRanges.forEach(range => {

        let min = range.min;
        let max = range.max;

        // check if whole range is already count (or partial).
        if(min <= valueMaxSaved){

            // skip if all range is allready count.
            if(max <= valueMaxSaved)
                return;

            // crop the range.
            min = valueMaxSaved + 1;
        }

        // add range values.
        freshCount += max - min + 1;

        // save max value saved.
        valueMaxSaved = max;

    });

    console.log(freshCount);

})();