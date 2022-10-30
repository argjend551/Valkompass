const fs = require("fs");
module.exports = class Storage {
  static writeFile(account) {
    let result = fs.readFileSync("../json/Results.json", "utf-8");

    let results = JSON.parse(result);
    results.push(account);

    result = JSON.stringify(results, null, 2);

    fs.writeFileSync("../json/Results.json", result, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
  static modifyFile(account, email) {
    let result = fs.readFileSync("../json/Results.json", "utf-8");

    let results = JSON.parse(result);
    const findAccount = results.find((x) => x.email === email);
    Object.assign(findAccount, account);

    result = JSON.stringify(results, null, 2);

    fs.writeFileSync("../json/Results.json", result, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
  static reInstantiate(_class, arrayOfObjects) {
    return arrayOfObjects.map((object) => new _class(object));
  }

  static validator(value) {
    if (value.length < 2 || !value.includes("@")) {
      throw new Error("EJ GILTIG MAIL");
    }
    return value;
  }
};
