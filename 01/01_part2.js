const fs = require('fs').promises;

// now, find the amount of time the wheel pass by '0' (not only stop at).

// read file input for get instructions.
async function readFileAttachedDocument(){
    let path = `01/input.txt`;
    let output = null;

    // file read.
    output = await fs.readFile(path, 'utf8');

    // sanitize.
    output = output.split('\n').filter((l) => l !== "")

    return output;
}

// convert 'R15' as {isRight: 1, value: 15}.
function extractValueToInstruction(instruction){
    return {
        isRight: (instruction[0] === 'R')? 1: -1,
        value: Number(instruction.substring(1))
    };
}


// main execution.
(async () => {

    console.log("--- exo 01 ---");
    
    let dialIndex = 50;
    let passtZeroCount = 0;
    let attachedDocument = [];

    // get doc from file.
    await readFileAttachedDocument().then(output => attachedDocument = output);

    let s = 1;
    // loop instruction.
    attachedDocument.forEach((docInstruction) => {

        let instrObj = extractValueToInstruction(docInstruction);

        // easy waye.
        //for(let i=0; i<instrObj.value; i++){
        //    dialIndex += instrObj.isRight;
        //    dialIndex %= 100;
        //    if(dialIndex === 0)
        //        passtZeroCount += 1;
        //}

        // more opti waye.
        let amountToRotate = instrObj.value;
        let isRight = instrObj.isRight === 1;

        while(amountToRotate !== 0){

            let rotateToZero = (
                (dialIndex === 0)? 100:
                (isRight)? 100 - dialIndex:
                - dialIndex
            );

            let rotate = Math.min(
                amountToRotate,
                Math.abs(rotateToZero)
            );
            if(!isRight && rotate > 0)
                rotate *= -1;

            dialIndex += rotate;
            dialIndex %= 100;
            if(dialIndex === 0)
                passtZeroCount +=1;

            if(dialIndex < 0)
                dialIndex += 100;

            amountToRotate -= Math.abs(rotate);

        }

    });

    // print result.
    console.log(passtZeroCount);

    //6498 (v)

})();

