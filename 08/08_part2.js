const fs = require('fs').promises;

// now, make connection until all are join in one group.
// then the last connection made, take both position box and multiply theyr both X value.
// return the result.

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

    output = output.map(line => line.split(','));

    return output;
}

function dist(a, b){
    // my vertion.
    //let difX = Math.abs(a[0] - b[0]);
    //let difY = Math.abs(a[1] - b[1]);
    //let difZ = Math.abs(a[2] - b[2]);
    //difX = Math.sqrt(difX*difX + difY*difY);
    //difX = Math.sqrt(difX*difX + difZ*difZ);
    //return difX;

    // vertion from internet (more opti).
    let difX = (a[0] - b[0]);
    let difY = (a[1] - b[1]);
    let difZ = (a[2] - b[2]);
    let squaredSum = Math.pow(difX, 2) + Math.pow(difY, 2) + Math.pow(difZ, 2);
    return Math.sqrt(squaredSum);
}

// main execution.
(async () => {

    console.log(`--- exo ${folderName} ---`);

    let poss = await readFileInput();

    let connectionToMake = 1000;
    

//    poss = [
//"162,817,812".split(','),
//"57,618,57".split(','),
//"906,360,560".split(','),
//"592,479,940".split(','),
//"352,342,300".split(','),
//"466,668,158".split(','),
//"542,29,236".split(','),
//"431,825,988".split(','),
//"739,650,466".split(','),
//"52,470,668".split(','),
//"216,146,977".split(','),
//"819,987,18".split(','),
//"117,168,530".split(','),
//"805,96,715".split(','),
//"346,949,466".split(','),
//"970,615,88".split(','),
//"941,993,340".split(','),
//"862,61,35".split(','),
//"984,92,344".split(','),
//"425,690,689".split(',')
//];
//    connectionToMake = 10;


    // calcul all connection (with dist).
    let allConnections = [];
    for(let i=0; i<poss.length; i++){
        for(let j=i+1; j<poss.length; j++){
            allConnections.push({
                i1: i,
                i2: j,
                dist: dist(poss[i], poss[j])
            });
        }
    }

    // sort by closest dist.
    allConnections.sort((a, b) => a.dist - b.dist);

    let grp = [];

    // make connection.
    connectionToMake--;
    let connectionMade = 0;
    let backupConnection = null;
    while(true){

        // exit.
        if(grp.find(g => g.length >= 1000) !== undefined){
            break;
        }

        // get conection closest.
        let currentCo = allConnections[0];
        backupConnection = currentCo;
        allConnections.shift();

        // get both pos.
        let p1 = poss[currentCo.i1];
        let p2 = poss[currentCo.i2];

        // get grp of both pos.
        let p1Grp = grp.find(g => g.includes(currentCo.i1));
        let p2Grp = grp.find(g => g.includes(currentCo.i2));

        if(p1Grp === undefined && p2Grp === undefined){  // new group.
            connectionMade++;

            grp.push([currentCo.i1, currentCo.i2]);
            
            continue;
        }
        if(p1Grp === undefined ^ p2Grp === undefined){  // connect a single to a grp.
            connectionMade++;

            let grpFind = (p1Grp === undefined)? p2Grp: p1Grp;
            grpFind.push((p1Grp === undefined)? currentCo.i1: currentCo.i2);

            continue;
        }
        if(p1Grp === p2Grp){  // already in same grp. (not sure).
            connectionMade++;
            continue;
        }
        if(p1Grp !== p2Grp){  // merging grp.
            connectionMade++;

            while(p2Grp.length > 0){
                p1Grp.push(p2Grp[0]);
                p2Grp.shift();
            }

        }

    }

    console.log(`${backupConnection.i1} - ${backupConnection.i1}`);
    console.log(`${poss[backupConnection.i1]} - ${poss[backupConnection.i1]}`);

    let result = (
        poss[backupConnection.i1][0] *
        poss[backupConnection.i2][0]
    );

    console.log(result);

})();