const result = require("../json/Results.json");
const promptly = require("promptly");
const Question = require("./Question");
const { reInstantiate } = require("./Storage");

module.exports = class Result {
  constructor(settings) {
    Object.assign(this, settings);
  }

  async startQuestions() {
    let getResults = new Result();
    let question = reInstantiate(Question, data);
    let results = await getResults.countPoints(question);
    let result = Object.assign(results);
    if (alreadyRegister) {
      alreadyRegister.results.push(result);
      modifyFile(alreadyRegister, account.getEmail());
      let getLastResults = alreadyRegister.results.pop();
      getResults.displayJsonResults(Object.entries(getLastResults));
    } else if (!alreadyRegister) {
      account.setResults(result);
      getResults.displayJsonResults(Object.entries(...account.getResults()));
      writeFile(account);
    }
  }

  getJsonResults(email) {
    let findResults = result.filter((x) => x.email === email);
    if (findResults.length === 0)
      return console.log("Du har inte gjort valkompassen än");
    let findResultsFlat = findResults.flatMap((x) => x.results);
    let keys = Object.values(findResultsFlat);
    let last = keys[keys.length - 1];
    this.displayJsonResults(Object.entries(last));

    return findResultsFlat;
  }

  getAllJsonResults(email) {
    let findResults = result.filter((x) => x.email === email);
    if (findResults.length === 0)
      return console.log("Du har inte gjort valkompassen än");
    let findResultsFlat = findResults.flatMap((x) => x.results);

    findResultsFlat.forEach((element) => {
      this.displayJsonResults(Object.entries(element));
    });

    return findResultsFlat;
  }

  displayJsonResults(result) {
    let results = result.sort((a, b) => b[1] - a[1]);
    let time = results.pop();
    time.shift();
    console.log("---------------------------------------");
    console.log(
      `Partiet som bäst stämmer överens med dina svar är: ${this.translate(
        ...results[0].slice(0, 1)
      )}`
    );
    console.log("---------------------------------------");
    results.forEach((x) => console.log(`${this.translate(x[0])}: ${x[1]}%`));
    console.log("---------------------------------------");
    console.log(`Utförd: ${time}`);
  }

  translate(party) {
    switch (party) {
      case "M":
        party = "Moderaterna";
        break;
      case "L":
        party = "Liberalerna";
        break;
      case "SD":
        party = "Sverigedemokraterna";
        break;
      case "C":
        party = "Centerpartiet";
        break;
      case "S":
        party = "Socialdemokraterna";
        break;
      case "MP":
        party = "Miljöpartiet";
        break;
      case "V":
        party = "Vänsterpartiet";
        break;
      case "KD":
        party = "Kristdemokraterna";
        break;
    }
    return party;
  }

  async countPoints(question) {
    let Vpoints = 0;
    let Spoints = 0;
    let MPpoints = 0;
    let Cpoints = 0;
    let Lpoints = 0;
    let KDpoints = 0;
    let Mpoints = 0;
    let SDpoints = 0;
    let countV = 0;
    let countS = 0;
    let countMP = 0;
    let countC = 0;
    let countL = 0;
    let countKD = 0;
    let countM = 0;
    let countSD = 0;
    let countQuestions = 0;
    for (const i in question) {
      countQuestions += 1;
      console.log(
        `${question[i].allQuestions(question)} [${countQuestions}/${
          question.length
        }]`
      );
      let usersChoice = await this.userAnswer();
      let distanceV = Math.abs(usersChoice - question[i].answer.V);
      Vpoints = 4 - distanceV;
      countV += Vpoints;
      let distanceS = Math.abs(usersChoice - question[i].answer.S);
      Spoints = 4 - distanceS;
      countS += Spoints;
      let distanceMP = Math.abs(usersChoice - question[i].answer.MP);
      MPpoints = 4 - distanceMP;
      countMP += MPpoints;
      let distanceC = Math.abs(usersChoice - question[i].answer.C);
      Cpoints = 4 - distanceC;
      countC += Cpoints;
      let distanceL = Math.abs(usersChoice - question[i].answer.L);
      Lpoints = 4 - distanceL;
      countL += Lpoints;
      let distanceKD = Math.abs(usersChoice - question[i].answer.KD);
      KDpoints = 4 - distanceKD;
      countKD += KDpoints;
      let distanceM = Math.abs(usersChoice - question[i].answer.M);
      Mpoints = 4 - distanceM;
      countM += Mpoints;
      if (question[i].answer.SD !== undefined) {
        let distanceSD = Math.abs(usersChoice - question[i].answer.SD);
        SDpoints = 4 - distanceSD;
        countSD += SDpoints;
      }
    }
    let finalResultV = Math.round(countV / ((4 * 30) / 100));
    let finalResultS = Math.round(countS / ((4 * 30) / 100));
    let finalResultMP = Math.round(countMP / ((4 * 30) / 100));
    let finalResultC = Math.round(countC / ((4 * 30) / 100));
    let finalResultL = Math.round(countL / ((4 * 30) / 100));
    let finalResultKD = Math.round(countKD / ((4 * 30) / 100));
    let finalResultM = Math.round(countM / ((4 * 30) / 100));
    let finalResultSD = Math.round(countSD / ((4 * 30) / 100));
    let time = new Date().toLocaleString().replace(",", "").slice(0, -3);

    const results = {
      V: finalResultV,
      S: finalResultS,
      MP: finalResultMP,
      C: finalResultC,
      L: finalResultL,
      KD: finalResultKD,
      M: finalResultM,
      SD: finalResultSD,
      finished: time,
    };
    return results;
  }

  async userAnswer() {
    console.log(
      "1. Instämmer helt, 2. Instämmer delvis, 3. Delvis emot, 4. Helt emot "
    );
    let choice = await promptly.choose("Välj:", [1, 2, 3, 4]);
    switch (choice) {
      case 1:
        choice = 2;
        break;
      case 2:
        choice = 1;
        break;
      case 3:
        choice = -1;
        break;
      case 4:
        choice = -2;
        break;
    }
    return choice;
  }
};
