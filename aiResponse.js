let delimiter = "###";
async function genQuestions(openai, q, num) {
  try {
    num = Math.max(Math.min(num, 10), 1); //generate between 1 and 10 questions
    let x = await openai.createChatCompletion({
     model: "gpt-3.5-turbo",
     messages: [{role: "system", content: `You are a knowledgeable assistant that generates question-answer pairs about a given topic. Provide ${num} question-answer pairs for the topic the user provides.  The questions should be approximately 10 to 20 words, and the answers around 5 to 15 words. Separate each question and its answer with the delimiter ${delimiter}. Also separate each question-answer pair with a line break. For example a potential response should follow the format: Question 1${delimiter}Answer 1\nQuestion 2${delimiter}Answer 2. Avoid adding extraneous text.`}, {role: "user", content: q}],
    });
    console.log(x.data.choices[0].message.content)
    return parseQuestions(x.data.choices[0].message.content);
  }
  catch(e) {
    console.log(e);
    return "ChatGPT API Error";
  }
}

function parseQuestions(input) {
  let text = input.replaceAll(`\n${delimiter}\n`, "\n").split("\n");
  let questions = [];
  for (let i = 0; i < text.length; i++) {
    let qPair = text[i].split(delimiter);
    if (qPair.length == 2 && qPair[0] != "" &&qPair[1] != "") {
      questions.push({})
      questions[i].question = qPair[0];
      questions[i].answer = qPair[1];
    }
  }
  return questions;
}

async function checkAnswer(openai, question, answer, intendedAnswer) {
  try {
    if (!answer || answer =="") return [];
    let x = await openai.createChatCompletion({
     model: "gpt-3.5-turbo",
     messages: [{role: "system", content: `Determine if the user response is the correct answer to this question: ${question} given the intended answer of ${intendedAnswer}. If the response is correct aligns with the intended answer, reply with a single character Y. If the response is reasonably correct, but does not align with the intended answer, reply with Y and a delimiter ${delimiter} followed by an explanation of why the response is correct and how it relates to the intended answer.  If the response is incorrect, reply with N and a delimiter ${delimiter} followed by an explanation of why the response is wrong. Refer to the user's response as 'The response.'`}, {role: "user", content: answer}],
    });
    console.log("answer evaluated")
    return parseAnswer(x.data.choices[0].message.content);
  }
  catch(e) {
    console.log(e);
    return "ChatGPT API Error";
  }
}

function parseAnswer(input) {
  let text = input.split(delimiter);
  let res = {};
  res.correct = text[0] == "Y";
  if (text.length > 1) res.explanation = text[1];
  return res;
}

async function findTopic(openai, qPair) {
  try {
    let x = await openai.createChatCompletion({
     model: "gpt-3.5-turbo",
     messages: [{role: "system", content: `When the user gives a question-answer pair, respond exactly with the general subject of study this question falls under. Then, add the following delimiter ${delimiter} and respond with the specific topic this question covers. Avoid adding extraneous text.`}, {role: "user", content: `Question: ${qPair.question} Answer: ${qPair.answer}`}],
    });
    return x.data.choices[0].message.content.split(delimiter);
  }
  catch(e) {
    console.log(e);
    return "ChatGPT API Error";
  }
}

module.exports = {genQuestions, checkAnswer, findTopic}