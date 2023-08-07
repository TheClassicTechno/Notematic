let questionContainer = document.getElementsByClassName("quiz-question")[0]
let evalContainer = document.getElementsByClassName("quiz-eval")[0]

function setQuiz(n) {
  if (!questionContainer || !("innerHTML" in questionContainer)) return;
  selectedQ = n;
  questionContainer.innerHTML = `<p class="quiz-question-text">${qPairs[selectedSet][selectedQ].question}</p>`;
  evalContainer.innerHTML = "";
}

async function setEval(eval) {
  let rightClass = false;
  let rightMsg = "";
  let explanation = "";
  let relatedTopics = "";
  if (eval.correct) {
    //correct answer
    rightClass = "right-eval";
    rightMsg = "Correct!";
    
  } else {
    relatedTopics = relatedTopicHTML(await findTopics(qPairs[selectedSet][selectedQ]));
    rightClass = "wrong-eval";
    rightMsg = "Wrong!";
  }
  if (eval.explanation) explanation = eval.explanation;
  if (!evalContainer) return;
  evalContainer.innerHTML = `<div class='${rightClass}'>
  <h3>${rightMsg}</h3>
  <p class="explanation">${explanation}</p>
  ${relatedTopics}
  <br>
  <div class="button_slide slide_right" onClick="setQuiz(++selectedQ)" >Next Question!</div>
  </div>`;
}

function relatedTopicHTML(relatedTopics) {
  let text = "<br><span>Investigate Related Topics: </span>";
  for (let i = 0; i < relatedTopics.length; i++) {
    text += `<span class = "new-topic" onclick = "loadNewTopic(' ${relatedTopics[i].replaceAll(`'`,`\\'`).replaceAll(`"`,`\\'`)} ')"> ${relatedTopics[i]} </span>`
  }
  return text;
}

async function loadNewTopic(topic) {
  let container = document.getElementsByClassName("quiz-eval")[0];
  setLoading(container);
  await setQPairs(topic);
  setQuiz(0);
}
