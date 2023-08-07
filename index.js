const express = require('express');
const bp = require("body-parser")
const { Configuration, OpenAIApi } = require("openai");
const ai = require("./aiResponse.js");


const app = express();
app.use(bp.json({ limit: '50mb', extended: true }))
app.use(bp.urlencoded({ limit: '50mb', extended: true }))
app.use(express.static(__dirname + "/public"));

//chatGPT
let delimiter = "###"

const configuration = new Configuration({
  apiKey: process.env["OPENAI_KEY"],
});
const openai = new OpenAIApi(configuration);

//connect to frontend
app.post("/gen", async (req, res) => {
  console.log("Generating questions...")
  let qs = await ai.genQuestions(openai, req.body.q, req.body.num);
  res.send({ qpairs: qs });
  //req.body
});
app.post("/check", async (req, res) => {
  console.log("Checking answer...")
  let answer = await ai.checkAnswer(openai, req.body.qpair.question, req.body.answer, req.body.qpair.answer);
  res.send(answer);
  //req.body
});
app.post("/related", async (req, res) => {
  console.log("Getting related topics...")
  let topics = await ai.findTopic(openai, req.body.qpair);
  res.send(topics);
  //req.body
});



app.listen(3000, () => {
  console.log('server started');
});

//ChatGPT API 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 arky
//ChatGPT API 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 crystal

// try {
//     ai.findTopic(openai, {question:"In javascript, how could you monitor the stock market?", answer: "Use an API to track global stock markets like the NY Stock Exchange"}).then((res) => {
//       console.log(res);
//     }).catch(e => console.log)
// } catch (e) {

// }
