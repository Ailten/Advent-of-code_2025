const fs = require('fs').promises;

// now ignore the light part, and use the voltage part.
// the obectif now is to make the voltage machine matching the voltage counter.
// eatch button press increase the conter voltage of machine at his indectated range.
// conter voltage of machine start at 0.
// conter how many button need to be pressed.

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
function decreaseVoltage(voltage, voltageToIncrease){
    return voltage.map((v, i) => v + voltageToIncrease.includes(i)? -1: 0);
}

//function allButtonMineOne(machine){
//
//    let lightToSwitchStart = machine.light
//        .map((l, li) => (l)? li: null)
//        .filter(l => l !== null);
//    
//    let tree = machine.buttons.map((button, i) => {
//        let cummulLight = machine.buttons.reduce((acu, e, i2) => {
//            if(i === i2)
//                return acu;
//            return reverceLight(acu, e);
//        });
//        let buttonPressed = machine.buttons.map((e, i2) => i === i2? null: e).filter(e => e !== null)
//        return {
//            buttonPressed: buttonPressed,
//            lightToSwitch: reverceLight(lightToSwitchStart, cummulLight)
//        }
//    });
//
//    let findPath = tree.find(t => t.lightToSwitch.length === 0);
//
//    if(findPath !== undefined)
//        return findPath.buttonPressed;
//    else
//        return null;
//    
//
//}

// main execution.
(async () => {

    console.log(`--- exo ${folderName} ---`);

    let machines = await readFileInput();

//    machines = await readFileInput(
//`[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
//[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
//[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`
//    );

    let amoutMinOfButton = [];

    // loop on machines
    machines.forEach((machine, mi) => {

        // exeptions.
        // try first all buttons, mine one.
        //let tryExeptions = allButtonMineOne(machine);
        //if(tryExeptions !== null){
        //    amoutMinOfButton.push(tryExeptions.length);
        //    return;
        //}

        // exeptions.
        //if(mi === 66){
        //    amoutMinOfButton.push([0,1,3,4,5,6,7,8,9].length);
        //    return;
        //}
        //if(mi === 83){
        //    amoutMinOfButton.push([1,2,3,4,5,6,7,8,9,10].length);
        //    return;
        //}
        //if(mi === 119){
        //    amoutMinOfButton.push([0,1,2,3,4,5,7].length);
        //    return;
        //}
        //if(mi === 159){
        //    amoutMinOfButton.push([0,1,3,4,6,7].length);
        //    return;
        //}

        let voltageStart = machine.voltage.map(v => v);

        let tree = machine.buttons.map((button, i) => {
            return {
                buttonPressed: [i],
                lightToSwitch: reverceLight(lightToSwitchStart, button)
            }
        });

        let findPath = undefined;
        for(let i=1; true; i++){

            findPath = tree.find(t => t.lightToSwitch.length === 0);
            if(findPath !== undefined){
                break;
            }

            /*
            let newTree = [];
            for(let j=0; j<tree.length; j++){
                let t = tree[j];

                let newRange = [];
                for(let k=0; k<machine.buttons.length; k++){
                    let b = machine.buttons[k];

                    if(t.buttonPressed.includes(k))
                        continue;

                    newRange.push({
                        buttonPressed: t.buttonPressed.concat([k]),
                        lightToSwitch: reverceLight(t.lightToSwitch, b)
                    });
                }

                newTree = newTree.concat(newRange);
            }
            tree = newTree;
            */

            tree = tree.map((t, ti) => {
                return machine.buttons.map((button, bi) => {
                    //if(t.buttonPressed.includes(bi))
                    //    return null;
                    return {
                        buttonPressed: t.buttonPressed.concat([bi]),
                        lightToSwitch: reverceLight(t.lightToSwitch, button)
                    }
                })
                //.filter(e => e !== null);
            })
            .reduce((acu, e, i) => acu.concat(e));

        }
        if(findPath === undefined){
            throw new Error('PATH OVERANGE');
        }

        amoutMinOfButton.push(findPath.buttonPressed.length);
        //amoutMinOfButton.push(findPath.buttonPressed);
        
        console.log(`--- ${mi+1}/${machines.length} -- ${findPath.buttonPressed.join(',')}`);

    });

    let result = 0;
    amoutMinOfButton.forEach(e => result += e);

    //let result = amoutMinOfButton.reduce((acu, e, i) => acu + e);

    console.log(result);

})();