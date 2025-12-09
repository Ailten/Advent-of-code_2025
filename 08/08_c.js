const fs = require('fs').promises;

// based on a list of vector 3 (pos of box), connect all to another one (the closest).
// you can connect many to eatch others (as a group).
// then return the multiplication of the 3 most largest group (the amount of box in group).

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

function evalDist(a, b){
    //let difX = Math.abs(a[0] - b[0]);
    //let difY = Math.abs(a[1] - b[1]);
    //let difZ = Math.abs(a[2] - b[2]);
    //difX = Math.sqrt(difX*difX + difY*difY);
    //difX = Math.sqrt(difX*difX + difZ*difZ);
    //return difX;

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


// dans l'example demo : les elfs ne font pas tout les racord (car pas assé de cable): doit-je aussi m'arreter avant ? (non, car mon résultat est déja trop bas).
// esque ma méthode de calcul des distance est eroné ? (non, j'ai déja vérifié avec une autre formule, et obtenu les meme résultat).
// doit-on relier les boite dans un ordre spécifique ? (non, ca ne changeré rien au résultat final des groupes créé).
// doit-on relier les boite uniquement en groupe filaire : pas plus d'une boite connectée a 2 autres ? (a tester, mais rien ne le dit dans l'énoncé).

// faire les 1000 première connection (tant qu'elles ne conect pas 2 boite déja connectée entre elles).

    // add param conection.
    //poss = poss.map(p => {
    //    return {
    //        pos: p,
    //        grpId: -1
    //    };
    //});

    let proxiPos = poss.map((e, i) => {
        return poss.filter(e2 => e2 !== e)
            .map((e2, i2) => {
                return {
                    i, i,
                    i2: i2,
                    dist: evalDist(e, e2)
                };
            })
            //.sort((a, b) => a.dist - b.dist);
    });

    console.log('a');

    //let proxiUnique = [];
    //for(let i=0; i<proxiPos.length; i++){
    //    for(let j=0; j<proxiPos[i].length; j++){
    //        let pro = proxiPos[i][j];
    //        let match = proxiUnique.find(pu => pu.i === pro.j && pu.i2 === pro.i2);
    //        if(match === undefined){
    //            proxiUnique.push(pro);
    //        }
    //    }
    //}
    proxiUnique = proxiPos.reduce((acu, e, i) => acu.concat(e))
        .sort((a, b) => a.dist - b.dist);

    console.log('b');

    proxiUnique.sort((a, b) => a.dist - b.dist);

    let circuits = [];

    let connectionMade = [];

    // loop until made 1000 conection.
    let conectionMade = 0;
    for(let k=0; k<proxiUnique.length; k++){

        let pro = proxiUnique[k];
        let i = pro.i;
        let i2 = pro.i2;

        // get both id circuit.
        let circuitI = -1;
        for(let j=0; j<circuits.length; j++){
            if(circuits[j].includes(i)){
                circuitI = j;
                break;
            }
        }
        let circuitI2 = -1;
        for(let j=0; j<circuits.length; j++){
            if(circuits[j].includes(i2)){
                circuitI2 = j;
                break;
            }
        }


        // already connected.
        if(circuitI !== -1 && circuitI === circuitI2){

            let isDirectlyConnected = connectionMade.find(e => e.i === i && e.i2 === i2 || e.i === i2 && e.i2 === i);
            if(isDirectlyConnected === undefined){  // same grp but not connected.
                conectionMade++;
            }
            else  // directly connected.
                continue;

        }else if(circuitI === -1 && circuitI2 === -1){  // new grp for both.
            conectionMade++;

            circuits.push([i, i2]);

        }else if((circuitI !== -1) ^ (circuitI2 !== -1)){  // new grp for one.
            conectionMade++;

            let indexGrp = (circuitI !== -1)? circuitI: circuitI2;
            let indexPos = (circuitI !== -1)? i2: i;

            circuits[indexGrp].push(indexPos);

        }else if(circuitI !== -1 && circuitI2 !== -1 && circuitI !== circuitI2){  // merging grp.
            conectionMade++;

            while(circuits[circuitI2].length > 0){
                circuits[circuitI].push(circuits[circuitI2][0]);
                circuits[circuitI2].shift();
            }

        }

        connectionMade.push({i: i, i2: i2});

        if(conectionMade >= 1000)
            break;

        console.log(conectionMade);

    }

    console.log(circuits.map(e => e.length)
        .sort((a, b) => (a - b) * -1));

    let result = circuits
        .map(e => e.length)
        .sort((a, b) => (a - b) * -1)
        .splice(0, 3)
        .reduce((acu, e, i) => acu * e);

    console.log(result);


})();