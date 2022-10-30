const result = require("../json/Results.json");
const promptly = require("promptly");
const { validator } = require("./Storage");
module.exports = class Account {
  results = [];
  constructor(email) {
    this.email = email;
  }

  getEmail() {
    return `${this.email}`;
  }
  getResults() {
    return this.results;
  }

  setEmail(email) {
    this.email = email;
  }
  setResults(result) {
    this.results.push(result);
  }

  async registerLogin() {
    console.log("Välkommen, logga in eller registera dig");
    let email = await (
      await promptly.prompt("ange email: ", { validator })
    ).toLocaleLowerCase();
    let alreadyRegister = result.find((x) => x.email === email);
    this.setEmail(email);
    if (alreadyRegister) {
      console.log("Loggar in..");
      console.log("Välkommen tillbaka " + email);
    } else if (!alreadyRegister) {
      console.log("Du har nu registerat dig, Välkommen " + email);
    }
    return alreadyRegister;
  }
};
