const fs = require('fs').promises;



async function readFileInput(){
    let path = `02/input.txt`;
    let output = null;

    // file read.
    output = await fs.readFile(path, 'utf8');

    // sanitize.
    output = output.split(',').map((block) => {
        let arrayBlock = block.split('-');
        return {
            min: arrayBlock[0],
            max: arrayBlock[1].replace('\n', '')
        };
    });

    return output;
}

// main execute.
(async () => {

    console.log("--- exo 02 ---");

    let invalidIDCount = 0;
    let IDs = [];
    await readFileInput().then((output) => {IDs = output;});

    // loop ids.
    IDs.forEach(id => {

        // get values as both type.
        let minStr = id.min;
        let maxStr = id.max;
        let minNum = Number(id.min);
        let maxNum = Number(id.max);

        // skip invalid by starting to '0'.
        if(minStr[0] === '0' || maxStr[0] === '0')
            return;
        
        // browse inner values.
        for(let i=minNum; i<=maxNum; i++){
            let iStr = i.toString();

            // loop on every split.
            for(let j=1; j<iStr.length; j++){

                if(iStr.length % j !== 0)
                    continue;

                // split in array values.
                let arraySplits = iStr.match(new RegExp(`[0-9]{${j}}`, "g"));

                if(arraySplits.every(val => val === arraySplits[0])){
                    invalidIDCount += i;
                    break;
                }

            }

        }

    });
    

    // print result.
    console.log(invalidIDCount);

})();
