const fs = require('fs').promises;

// now, find how many path distinct can be found.

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

    let indexStart = lines[0].indexOf('S');
    lines.shift();

    lines = lines.filter(line => !(/^\.{1,}$/).test(line));

    let tree = [{
        x: indexStart,
        y: -1,
        paths: 1
    }];

    lines.forEach((line, y) => {

        let currentTree = [];

        tree.forEach((t, i) => {

            let char = line[t.x];

            if(char === '^'){  // split.

                let node = currentTree.find(ct => ct.x === t.x - 1);
                if(node === undefined){
                    currentTree.push({
                        x: t.x - 1,
                        y: y,
                        paths: t.paths
                    });
                }else{
                    node.paths += t.paths;
                }

                node = currentTree.find(ct => ct.x === t.x + 1);
                if(node === undefined){
                    currentTree.push({
                        x: t.x + 1,
                        y: y,
                        paths: t.paths
                    });
                }else{
                    node.paths += t.paths;
                }

            }else{

                let node = currentTree.find(ct => ct.x === t.x);
                if(node === undefined){
                    currentTree.push({
                        x: t.x,
                        y: y,
                        paths: t.paths
                    });
                }else{
                    node.paths += t.paths;
                }

            }

        });

        tree = currentTree;

    });

    console.log(tree.map(n => n.paths).reduce((acu, e, i) => acu + e));

})();