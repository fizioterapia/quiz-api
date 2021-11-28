const express = require("express");

let questions;
let config;

try {
  questions = require("./files/questions.json");
} catch (e) {
  console.error(`Error: Questions not found.`);
  process.exit(1);
}

try {
  config = require("./config/configuration.json");
} catch (e) {
  console.error(`Error: Config not found.`);
  process.exit(1);
}

let quizes = [];

const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log("Quiz API listening on 3000.");
});

function* idMaker() {
  var index = 1;
  while (true) yield index++;
}

var gen = idMaker();

const sendError = (res, err) => {
  res.json({ error: !err || /^\s*$/.test(err) ? "No reason specified" : err });
};

app.get("/start", (req, res) => {
  let questionpool = questions.sort((a, b) => 0.5 - Math.random());

  let quiz = {};
  quiz.id = gen.next().value;
  quiz.length = quizes.length >= config.length ? config.length : quizes.length;
  quiz.questions = [];

  while (quiz.questions < 10) {
    // Send question without answer to prevent cheating
    let question =
      questionpool[Math.floor(Math.random() * questionpool.length)];
    delete question.correctAnswer;

    quiz.questions.push(question);
  }

  quizes.push(quiz);
  res.json(quiz);
});

app.post("/finish", (req, res) => {
  const answers = req.body.answers;
  if (!answers) {
    let quiz = quizes.filter((elem, index, array) => {
      if (answers.id == elem.id) return true;
    });

    if (quiz.length > 0) {
      quiz = quiz[0];

      quiz.questions.forEach((element) => {
        let question = questions.filter((elem, index, array) => {
          if (elem.id == element.id) return true;
        })[0];

        element.correct =
          element.answer === question.correctAnswer ? true : false;
      });

      res.json(quiz);
    } else {
      sendError(res, "Invalid Quiz");
    }
  } else {
    sendError(res, "No answers passed");
  }
});

// Debugging purposes
app.get("/question/:questionId", (req, res) => {
  let question = questions[req.params.questionId];

  if (typeof question === "object") {
    res.json(question);
  } else {
    sendError(res, "Invalid Question");
  }
});

// Catch all links
app.get("*", (req, res) => {
  sendError(res, "Invalid Route");
});

app.post("*", (req, res) => {
  sendError(res, "Invalid Route");
});
