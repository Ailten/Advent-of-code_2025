const fs = require('fs').promises;

// wheel numered from 0 to 99, with a cursor indicated on when number it is (like a wheel bank security).
// start a number 50.
// when past over 99 or under 0, comme back at opisite range.
// follow a list of instruction (like 'R20' or 'L11'), to move the wheel.
// find the amount of time the wheel stop to '0'.

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

    // loop instruction.
    attachedDocument.forEach((docInstruction) => {

        let instrObj = extractValueToInstruction(docInstruction);

        // move the wheel.
        dialIndex += instrObj.value * instrObj.isRight;

        // clamp the value overange.
        if(dialIndex > 99)
            dialIndex %= 100;
        else while(dialIndex < 0)
            dialIndex += 100;

        // count the zero skip.
        if(dialIndex == 0)
            passtZeroCount += 1;

    });

    // print result.
    console.log(passtZeroCount);

})();

