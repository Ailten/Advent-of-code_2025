const fs = require('fs').promises;

// tear are bateries, eatch bateries have a voltage (to 1 from 9) fix, bateries are place on bank (list of bateries), tear are many bank.
// found the bigest voltage you can make for eatch bank, by turning ON two bateires by bank.
// the result voltage is the concatenation of both voltage batery turn ON (ex: '5' and '9' make voltage bank of '59').
// (you can turn on many time the same value voltage by bank.)
// found the sum of eatch bank.

// read file.
async function readFileInput(){
    let path = `03/input.txt`;
    let output = null;

    // file read.
    output = await fs.readFile(path, 'utf8');

    // sanitize.
    output = output.split('\n')
        .filter((bank) => bank !== '');

    return output;
}



// main execution.
(async () => {

    console.log("--- exo 03 ---");

    let voltage = 0;
    let amountBateryCanTurnOn = 2;

    // get banks of bateries data.
    let banks = [];
    await readFileInput().then(fileOutput => { banks = fileOutput; });

    // loop on banks.
    banks.forEach(bank => {

        console.log('---');
        console.log(`bank: ${bank}`);

        let currentBank = bank;
        let arrayOfElementsTurnOn = '';
        for(let iTurnOn=0; iTurnOn<amountBateryCanTurnOn; iTurnOn++){
            let amountOfCharToTurnOnAfterThisOne = amountBateryCanTurnOn - iTurnOn - 1;

            console.log(`--- find the ${iTurnOn+1}eme/${amountBateryCanTurnOn} char to turn on.`);

            for(let valSearched=9; valSearched>=0; valSearched--){
                let varSearchedStr = valSearched.toString();

                console.log(`try to find num ${valSearched}`);

                // skip if this number is already turn on.
                //if(arrayOfElementsTurnOn.includes(varSearchedStr)){
                //    console.log(`[x] already turn on`);
                //    continue;
                //}
    
                // search the number ask on the most left in the string send.
                let indexFind = currentBank.indexOf(varSearchedStr);
                if(indexFind === -1){ // thear is not this char on the string.
                    console.log(`[x] not found`);
                    continue;
                }
    
                // verify if there are enouth distinct number at right.
                let restBank = currentBank.substring(indexFind + 1);
                let restBankUnique = restBank;
                //    .split('') // to array.
                //    .filter((val, ind, arr) => arr.indexOf(val) === ind) // unique.
                //    .join(''); // to string.
                if(restBankUnique.length < amountOfCharToTurnOnAfterThisOne){ // tear is not enouth space at right for other turn on.
                    console.log(`[x] not enouth place at right (${restBankUnique.length})`);
                    continue;
                }

                console.log(`[v] validate`);
    
                // whe found a number to turn on.
                arrayOfElementsTurnOn += varSearchedStr; // memorise the char to turn on.
                currentBank = restBank; // reduse bank for next number to turn on.

                console.log(`new bank: ${currentBank}`);

                break;
    
            }

        }
        
        let voltageOfThisBank = Number(arrayOfElementsTurnOn);
        console.log(`voltage found for this bank: ${voltageOfThisBank}`);
        voltage += voltageOfThisBank;

    });

    // result.
    console.log(voltage);

})();
