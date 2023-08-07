
async function genQuestions(q, num) {
  let ret;
  await fetch('/gen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ q: q, num: num}) // put data to send here
      })
        .then((res)=>res.json())
        .then((res)=>{
          ret = res;
        })
  return ret.qpairs;
}
async function checkAnswer(qpair, answer) {
  let ret;
  await fetch('/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ qpair: qpair, answer: answer}) // put data to send here
      })
        .then((res)=>res.json())
        .then((res)=>{
          ret = res;
        });
  return ret;
}
async function findTopics(qpair) {
  let ret;
  await fetch('/related', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ qpair: qpair}) // put data to send here
      })
        .then((res)=>res.json())
        .then((res)=>{
          ret = res;
        });
  return ret;
}
// genQuestions("history", 1).then(res => {
//   console.log(res)
//   console.log("loaded question");
//   let a = prompt("what is ur answer to this question "+res[0].question)
//   console.log(JSON.stringify({ qpair: res[0], answer: a}));
//     checkAnswer(res[0], a).then(r => {alert(r.correct + r.explanation)});
//   //checkAnswer(res[0], a)
// })

let qPairs = JSON.parse(localStorage.getItem("qPairs")) || {}; //ultimate dictionary for questions
let selectedQ = 0;
let selectedSet = "";

async function setNewQPairs() {
  let container = document.getElementsByClassName("flashcard")[0];
  setLoading(container);
  let q = document.getElementById("Name").value.replaceAll(`'`,`\\'`).replaceAll(`"`,`\\'`);
  console.log(q);
  await setQPairs(q);
  setFlashcard(qPairs[selectedSet][selectedQ]);
}
async function setQPairs(q) {
  let newQPairs = await genQuestions(q, 10);
  if (!qPairs[q] || qPairs[q] == "ChatGPT API Error") qPairs[q] = newQPairs;
  else qPairs[q].push(...newQPairs);
  selectedSet = q;
  selectedQ = 0;
  updateSets();
  localStorage.setItem("qPairs",JSON.stringify(qPairs));
}

function changeSet(set) {
  console.log("set changed to "+set)
  if (set in qPairs){
    selectedSet = set;
    selectedQ = 0;
    setFlashcard(qPairs[selectedSet][selectedQ]);
    setQuiz(0);
  }
}

let maxDropLen = 20;
function updateSets() {
  console.log("test")
  let text = "";
  for (v in qPairs) {
    let jailbreakv = v.replaceAll(`'`,`\\'`).replaceAll(`"`,`\\'`);
    text += `<div class= "dropdown-item" onclick = "changeSet('${jailbreakv}')">
    <span>${v.length < maxDropLen ? v : v.substring(0, maxDropLen -3 )+"..."}</span>
    <div class="remove-btn" onclick="removeSet('${jailbreakv}')">x</div>
    </div>`;
  }
  document.getElementsByClassName("dropdown-content")[0].innerHTML = text;
}

function removeSet(set) {
  delete qPairs[set];
  updateSets();
  localStorage.setItem("qPairs",JSON.stringify(qPairs));
}

//quiz page stuff
async function setCheckAnswer() {
  let container = document.getElementsByClassName("quiz-eval")[0];
  setLoading(container);
  let ans = document.getElementById("answer-box").value;
  let eval = await checkAnswer(qPairs[selectedSet][selectedQ], ans);
  console.log(eval)
  setEval(eval);
}



window.onload = updateSets; //update sets at the very beginning