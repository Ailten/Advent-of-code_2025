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

        // skip if both values values same length and odd.
        if(minStr.length === maxStr.length && minStr.length%2===1)
            return;
        
        // browse inner values.
        for(let i=minNum; i<=maxNum; i++){
            let iStr = i.toString();

            // skip if length odd.
            if(iStr.length%2===1)
                continue;

            // split.
            let midIndex = iStr.length/2;
            let leftPart = iStr.substring(0, midIndex);
            let rightPart = iStr.substring(midIndex);

            // skip if an alf part is start by '0'.
            if(leftPart[0] === '0' || rightPart[0] === '0')
                continue;

            // match and incriase output.
            if(leftPart === rightPart)
                invalidIDCount += i;
        }

    });
    

    // print result.
    console.log(invalidIDCount);

})();
