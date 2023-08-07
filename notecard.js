/* NOTECARD TEMPLATE
<div class="flashcard">
		<div class="flashcard-question">
      <div class="flashcard-content">
        Why did the functions stop calling each other?
      </div>
		</div>
		<div class="flashcard-answer">
      <div class="flashcard-content">
        Because they had constant arguments.
      </div>
		</div>
	</div>
 
*/
let flashcardContainer = document.getElementsByClassName("notecards-container")[0];

function setFlashcard(qPair) {
  if (!flashcardContainer || !("innerHTML" in flashcardContainer)) return;
  flashcardContainer.innerHTML = `<input type="checkbox" id="flipper">
    <label for="flipper" class="flashcard-container">
  	<div class="flashcard">
  		<div class="flashcard-question">
        <div class="flashcard-content">
          ${qPair.question}
        </div>
  		</div>
  		<div class="flashcard-answer">
        <div class="flashcard-content">
          ${qPair.answer}
        </div>
  		</div>
  	</div>
  </label>`;
}
//notecard select
function nextCard() {
  selectedQ ++;
  selectedQ = Math.max(0, Math.min(qPairs[selectedSet].length, selectedQ))
  setFlashcard(qPairs[selectedSet][selectedQ]);
}
function prevCard() {
  selectedQ --;
  selectedQ = Math.max(0, Math.min(qPairs[selectedSet].length, selectedQ))
  setFlashcard(qPairs[selectedSet][selectedQ]);
}