const fs = require('fs').promises;

async function readFile(path){
    let output = await fs.readFile(path, 'utf8');
    output = output.split('\n').map(l => {
        let numLine = (l).match(/^--- [\d]{1,}/)[0].substring(4);
        let valueFound = (l).match(/[0-9A-Z-]{1,}$/)[0];
        return {
            numLine: Number(numLine),
            valueFound: (valueFound==='NOT-FOUND'? Infinity: Number(valueFound))
        };
    });
    return output;
}

(async () => {

    let paths = [
        "10/trySolus_part2_01.txt",
        "10/trySolus_part2_02.txt",
        "10/trySolus_part2_03.txt",
        "10/trySolus_part2_04.txt",
        "10/trySolus_part2_05.txt",
        "10/trySolus_part2_06.txt"
    ];

    let data = [
        await readFile(paths[0]),
        await readFile(paths[1]),
        await readFile(paths[2]),
        await readFile(paths[3]),
        await readFile(paths[4]),
        await readFile(paths[5])
    ];

    for(let i=1; i<data.length; i++){
        let d = data[i];

        data[0] = d.map((dv, i) => {
            let db = data[0][i];
            return {
                numLine: dv.numLine,
                valueFound: Math.min(db.valueFound, dv.valueFound)
            };
        })
    }

    data[0].forEach(db => {
        console.log(`--- ${db.numLine}/166 -- ${(db.valueFound === Infinity)? 'NOT-FOUND': db.valueFound}`)
    })



})();