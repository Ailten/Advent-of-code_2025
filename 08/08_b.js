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


    // add param conection.
    //poss = poss.map(p => {
    //    return {
    //        pos: p,
    //        grpId: -1
    //    };
    //});

    poss = poss.map(p => {
        return {
            pos: p,
            closestI: -1,
            dist: -1,
            grpId: -1
        };
    });

    let circuits = [];

    // loop on poss.
    for(let i=0; i<poss.length; i++){
        let p = poss[i];
    
        // skip when already connected.
        //if(p.closestI !== -1)
        //    continue;

        let closestI2;
        let closestDist = Infinity;
        for(let i2=0; i2<poss.length; i2++){
            let p2 = poss[i2];

            // skip if already connected to another.
            //if(p2.closestI !== -1)
            //    continue;

            // skip if trying to connect to it self.
            if(p2 === p)
                continue;

            let dist = evalDist(p.pos, p2.pos);
            if(dist < closestDist){
                closestDist = dist;
                closestI2 = i2;
            }
        }

        // connect.
        poss[i].closestI = closestI2;
        poss[i].dist = closestDist;

    }

    // order by dist.
    poss = poss.sort((a, b) => a.dist - b.dist);

    // loop on poss.
    for(let i=0; i<poss.length; i++){
        let p = poss[i];
        let p2 = poss[p.closestI];

        // skip if p already set in grp (as p2).
        if(p.grpId !== -1)
            continue;

        if(p2.grpId === -1){  // make a new grp.

            circuits.push([i, p.closestI]);
            poss[i].grpId = circuits.length - 1;
            poss[p.closestI].grpId = circuits.length - 1;
    
        }else{  // increase existing grp.

            circuits[p2.grpId].push(i);
            poss[i].grpId = p2.grpId;

        }

    }
    

/*
    // loop on poss.
    for(let i=0; i<poss.length; i++){
        let p = poss[i];

        // skip when already connected.
        if(p.grpId !== -1)
            continue;

        // get closest matching.
        let closestI2;
        let closestDist = Infinity;
        for(let i2=0; i2<poss.length; i2++){
            let p2 = poss[i2];

            // skip if already connected to another.
            //if(p2.connectToId !== -1)
            //    continue;

            // skip if trying to connect to it self.
            if(p2 === p)
                continue;

            let dist = evalDist(p.pos, p2.pos);
            if(dist < closestDist){
                closestDist = dist;
                closestI2 = i2;
            }
        }

        // connect.
        if(poss[closestI2].grpId === -1){  // make a new grp.

            circuits.push([i, closestI2]);
            poss[i].grpId = circuits.length - 1;
            poss[closestI2].grpId = circuits.length - 1;

        }else{

            circuits[poss[closestI2].grpId].push(i);
            poss[i].grpId = poss[closestI2].grpId;

        }
        
        //poss[i].connectToId = closestI2;
        //poss[closestI2].connectToId = i;
        //poss[i].dist = closestDist;
        //poss[closestI2].dist = closestDist;

    }
*/

    //console.log(circuits);
    console.log(circuits.map(e => e.length)
        .sort((a, b) => (a - b) * -1));
    //console.log(circuits).map(e => e.map(ee => poss[ee].pos));

    let result = circuits
        .map(e => e.length)
        .sort((a, b) => (a - b) * -1)
        .splice(0, 3)
        .reduce((acu, e, i) => acu * e);

    console.log(result);

    //294 to low.
    //890568 to big.
    //180 to low.

    //1210 (x).
    //576  (x)

})();