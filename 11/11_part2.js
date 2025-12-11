const fs = require('fs').promises;

// now find how many road from "svr" to "out", passing by "dac" and "fft" (in any order).

// folder name.
const folderName = __filename.split('/').filter(folder => (/^\d{2}$/).test(folder))[0];

// read file.
async function readFileInput(dataStr = undefined){
    let output = [];

    if(dataStr === undefined){

        let path = `${folderName}/input.txt`;
    
        // file read.
        output = await fs.readFile(path, 'utf8');

        // sanitize.
        output = output.split('\n');
        output.pop();

    }else{
        output = dataStr.split('\n');
    }

    output = output.map(l => {
        let to = l.match(/[a-z]{3}/g);
        let name = to[0];
        to.shift();
        return {
            name: name,
            to: to
        };
    });

    return output;
}

// main execution.
(async () => {

    console.log(`--- exo ${folderName} ---`);

    let connections = await readFileInput();

//    connections = await readFileInput(
//`aaa: you hhh
//you: bbb ccc
//bbb: ddd eee
//ccc: ddd eee fff
//ddd: ggg
//eee: out
//fff: out
//ggg: out
//hhh: ccc fff iii
//iii: out`
//    );

    // try reverce path ?

    // find "you".
    let tree = [['svr']];

    let pathOut = 0;

    while(true){

        tree = tree.map(t => {

            let lastPiece = t[t.length -1];
            if(lastPiece === 'out') // is a path finish.
                return t;

            let piece = connections.find(c => c.name === lastPiece);

            if(piece === undefined)
                return null;

            let nextT = piece.to.map(dest => {
                if(t.includes(dest)) // filter of loop.
                    return null;
                if(dest === 'out'){
                    if(t.includes("dac") && t.includes("fft"))
                        pathOut++;
                    return null;
                }
                return t.concat([dest]);
            })
            .filter(t2 => t2 !== null);

            return nextT;

        })
        .filter(t => t !== null);

        if(tree.length === 0)
            break;

        tree = tree.reduce((acu, e) => acu.concat(e));

    }

    let result = pathOut;

    console.log(result);

})();
