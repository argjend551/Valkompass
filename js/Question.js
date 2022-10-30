module.exports = class Question {
  constructor(settings) {
    Object.assign(this, settings);
  }

  allQuestions() {
    return this.question;
  }
};
