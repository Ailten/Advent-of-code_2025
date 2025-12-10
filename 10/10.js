const fs = require('fs').promises;

// 

// folder name.
const folderName = __filename.split('/').filter(folder => (/^\d{2}$/).test(folder))[0];

// read file.
async function readFileInput(dataStr=undefined){
    let output = [];

    if(dataStr === undefined){

        let path = `${folderName}/input.txt`;
        let output = null;
    
        // file read.
        output = await fs.readFile(path, 'utf8');

        // sanitize.
        output = output.split('\n');
        output.pop();

    }else{
        output = dataStr.split('\n');
    }

    output = output.map(l => {
        let split = l.split(' ');
        let light = split[0]
            .split('')
            .filter(c => c === '.' || c === '#')
            .map(c => c === '#');
        split.shift();

        let voltage = (split[split.length-1]).match(/\d{1,}/g)
            .map(e => Number(e));
        split.pop();

        let buttons = split
            .map(e => (e).match(/\d{1,}/g).map(c => Number(c)));

        return {
            light: light,
            buttons: buttons,
            voltage: voltage
        }
    })

    return output;
}

function lightStr(light){
    return light.map(e => e? '#':'.').join('');
}
function machineStr(machine){
    return `[${lightStr(machine.light)}] ${machine.buttons.map(button => '('+button.join(',')+')').join(' ')} {${machine.voltage.join(',')}}`;
}
function reverceLight(light, lightToSwitch){
    let output = light.filter(l => !lightToSwitch.includes(l));
    output = output.concat(lightToSwitch.filter(lts => !light.includes(lts)));
    return output;
}

// main execution.
(async () => {

    console.log(`--- exo ${folderName} ---`);

    let machines = await readFileInput();

    machines = await readFileInput(
`[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`
    );

    let amoutMinOfButton = [];

    const buttonAlowToPressByMachines = 7;

    // loop on machines
    machines.forEach((machine, mi) => {

        let tree = machine.buttons.map((button, i) => {
            let lightToSwitch = machine.light
                .map((l, li) => (!l)? li: null)
                .filter(l => l !== null);
            return {
                buttonPressed: [i],
                lightToSwitch: reverceLight(lightToSwitch, button)
            }
        });
        
        let findPath = undefined;
        for(let i=1; i<buttonAlowToPressByMachines; i++){

            findPath = tree.find(t => t.lightToSwitch.length === 0);
            if(findPath !== undefined){
                break;
            }

            //if(i === 2){
            //    console.log('aaa');
            //    console.log(tree.filter(t => t.lightToSwitch[0] === 2 && t.lightToSwitch[1] === 3));
            //    console.log('aaa');
            //}

            let newTree = tree.map((t, ti) => {
                let newBranches = machine.buttons.map((button, bi) => {
                    return {
                        buttonPressed: t.buttonPressed.concat([bi]),
                        lightToSwitch: reverceLight(t.lightToSwitch, button)
                    }
                });
                return newBranches;
            }).reduce((acu, e, i) => acu.concat(e));
            tree = newTree;

        }
        if(findPath === undefined){
            console.log('error -> out of range path');
            console.log(machineStr(machine));
            console.log(mi);
            throw new Error('PATH OVERANGE');
        }

        amoutMinOfButton.push(findPath.buttonPressed.length);
        
        console.log('---');
        console.log(`${mi+1}/${machines.length}`);
        console.log(findPath.buttonPressed);
        console.log('---');




        /*
        let buttonsPressed = 0;
        let backupButtonPressed = [];
        while(!machine.light.every(e => e)){

            let priorityButtons = machine.buttons.map((button, i) => {

                let valuePriority = machine.light
                    .filter((e, i) => button.includes(i) && !e)
                    .length * 10;

                valuePriority -= machine.light
                    .filter((e, i) => button.includes(i) && e)
                    .length * 10;

                //valuePriority += backupButtonPressed
                //    .filter(e => e === i)
                //    .length * -5;
                    
                return {
                    button: button,
                    i: i,
                    valuePriority: valuePriority
                };
            })
            .sort((a, b) => (a.valuePriority - b.valuePriority) * -1);

            if(backupButtonPressed[backupButtonPressed.length -1] === priorityButtons[0].i){
                priorityButtons.shift();
            }

            //if(buttonsPressed > 20 && buttonsPressed < 30){
            //    console.log(machineStr(machine));
            //    //console.log(backupButtonPressed);
            //    
            //    console.log(`${priorityButtons.map(e => '[b:'+e.button.join(',')+' ,i:'+e.i+' ,v:'+e.valuePriority+']')}`)
            //}

            let mostOptiButton = priorityButtons[0];

            //if(buttonsPressed < 5)
            //    console.log(`[${lightStr(machine.light)}] -> ${mostOptiButton.button.join(',')}`);

            mostOptiButton.button.forEach(b => {
                machine.light[b] = !machine.light[b];
            });
            buttonsPressed++;
            backupButtonPressed.push(mostOptiButton.i);

        }
        amoutMinOfButton.push(buttonsPressed);

        console.log(`${mi+1}/${machines.length}`);
        */
    });


    let result = amoutMinOfButton.reduce((acu, e, i) => acu + e);

    console.log(result);

})();