const Question = require("./Question");
const data = require("../json/Data.json");
const promptly = require("promptly");
const Account = require("./Account");
const Result = require("./Result");
const { modifyFile, writeFile, reInstantiate } = require("./Storage");

start();
let alreadyRegister;

async function start() {
  let account = new Account();
  alreadyRegister = await account.registerLogin();
  menu(account);
}

async function menu(account) {
  console.log("1. Valkompass, 2. Se mina resultat, 3. Avsluta");
  let choice = await promptly.choose("Välj 1-3:", [1, 2, 3]);

  while (choice != 3) {
    switch (choice) {
      case 1:
        let start = new Result();
        let question = reInstantiate(Question, data);
        let result = await start.countPoints(question);
        if (alreadyRegister) {
          alreadyRegister.results.push(result);
          modifyFile(alreadyRegister, account.getEmail());
          let getLastResults = alreadyRegister.results.pop();
          start.displayJsonResults(Object.entries(getLastResults));
        } else if (!alreadyRegister) {
          account.setResults(result);
          start.displayJsonResults(Object.entries(...account.getResults()));
          writeFile(account);
        }
        return;
      case 2:
        let results = new Result();
        console.log("1. Min senaste, 2. Alla resultat");
        let choice1 = await promptly.choose("Välj 1-2:", [1, 2]);
        switch (choice1) {
          case 1:
            results.getJsonResults(account.getEmail());
            return menu(account);
          case 2:
            results.getAllJsonResults(account.getEmail());
            return menu(account);
        }
        break;
      case 3:
        console.log("Avslutar..");
        break;
    }
  }
}
