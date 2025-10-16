//Across array: answer, clue, x coordinate of cell of first letter of answer, y coordinate of the same.
// empty arrays represent a clue number that isnt used for this direction
//i.e. there is no clue/answer for 1,2,3 across.

const down = [
  [
    "variability",
    "Learner _________________ is the recognition that students learn in different ways, and these differences are normal and expected.",
    3,
    1,
    "Begins with the letter V and describes natural differences in how people learn.",
  ],
  [
    "expression",
    "Multiple means of action and _________________ is offering learners different ways to demonstrate what they know.",
    6,
    1,
    "Begins with the letter E and is a way of showing or communicating an idea.",
  ],
  [
    "engagement",
    "Multiple means of _________________ is using diverse methods to motivate and engage learners based on interests, effort, and self-regulation.",
    8,
    1,
    "This is active involvement in learning,  when learners are participating fully.",
  ],
  [
    "flexible",
    "_________________ learning environments are spaces and approaches that adapt to learners’ needs, preferences, and choices.",
    11,
    1,
    "Able to shift when circumstances or needs change. The opposite of rigid.",
  ],
  [],
  [
    "wcag",
    "Initials for the globally recognised guidelines for website content accessibility. _________________",
    1,
    8,
    "Initials for the rules that ensure digital content is usable by everyone.  The first letter is W.",
  ],
];

const across = [
  [],
  [],
  [],
  [],
  [
    "universal",
    "_________________ design for learning is a framework that guides the design of inclusive learning environments to accommodate all learners' diverse needs.",
    1,
    4,
    "This word also means ‘meant for everyone’, not just a few.",
  ],
  [],
  [
    "diverse",
    "The wide range of differences among learners in terms of abilities, backgrounds, learning styles, languages, cultures, interests, and needs. _________________",
    5,
    8,
    "Not all the same, made up of many differences or variations.",
  ],
  [
    "alternative",
    "A different format or method of presenting information that serves the same purpose as the original, such as providing a text description for an image or captions for audio. _________________",
    1,
    10,
    "Another option or choice.",
  ],
];

//Object utilised by createCellsAndClues and checkAnswer function
let answerArray = [
  { name: "across", data: across },
  { name: "down", data: down },
];

let isPopupOpen = false;
//Create the container for both crossword and clues
const crosswordAndClues = document.getElementById("crossword_and_clues");
// Get the parent div for the crossword and set aria attributes
const crosswordDiv = document.getElementById("crossword");
crosswordDiv.setAttribute("role", "grid");
crosswordDiv.setAttribute("aria-label", "Crossword puzzle");
// Create the parent div for clues
const cluesDiv = document.getElementById("clues");
// Create the Across and Down parent divs and give them their respective classnames
const acrossUl = document.createElement("div");
acrossUl.className = "across_clues";
const downUl = document.createElement("div");
downUl.className = "down_clues";

//Add across heading
const acrossHeading = document.createElement("div");
acrossHeading.className = "heading";
acrossHeading.textContent = "Across";

//Add down heading
const downHeading = document.createElement("div");
downHeading.className = "heading";
downHeading.textContent = "Down";

//Append headings to their respective lists
downUl.appendChild(downHeading);
acrossUl.appendChild(acrossHeading);

//Create the Check Answer button and set attributes
const checkAnswerButton = document.createElement("button");
checkAnswerButton.id = "checkAnswer";
checkAnswerButton.textContent = "Check Answers";
checkAnswerButton.addEventListener("click", checkAnswer);

// Create the #dialog_feedback div
const dialogFeedback = document.createElement("div");
dialogFeedback.id = "dialog_feedback";

// Create a <p> element to hold the feedback message
let dialogMessage = document.createElement("p");
dialogMessage.textContent =
  "Well done! You have answered every question correctly.";

// Append the message to the dialog div
dialogFeedback.appendChild(dialogMessage);

// Optionally append dialogFeedback to the body or any other parent container
crosswordAndClues.appendChild(dialogFeedback);

// Number of cells in width and height
let crossWordWidth = 11;
let rowsArray = []; // Store rows for later reference

// Create grid with blank element (black div)
for (let i = 0; i < crossWordWidth; i++) {
  const row = document.createElement("div"); // Create a new row
  row.className = "row";
  row.setAttribute("role", "row");
  let cellsArray = [];

  for (let j = 0; j < crossWordWidth; j++) {
    // Create a new blank element for the number of times specified by crossWordWidth variable
    const cell = document.createElement("div");
    cell.className = "blank";
    cell.setAttribute("role", "gridcell");
    row.appendChild(cell); // Append cell to the row
    cellsArray.push(cell); // Store reference to the cell
  }

  rowsArray.push(cellsArray); // Store reference to the row's cells
  crosswordDiv.appendChild(row); // Append row to the crossword
}

function createCellsAndClues() {
  for (let k = 0; k < answerArray.length; k++) {
    let currentArray = answerArray[k].data; //Get the actual array
    let currentName = answerArray[k].name; //Get "across" or "down"
    let dataClueNumber;

    //Loop through each clue/word entry in currentArray
    for (let i = 0; i < currentArray.length; i++) {
      let entry = currentArray[i];

      // Skip if the entry is an empty array (no clue at this index)
      if (entry.length > 0) {
        let word = entry[0];
        let startX = entry[2] - 1; //Starting X coordinate (adjusted for 0-based indexing)
        let startY = entry[3] - 1; //Starting Y coordinate (adjusted for 0-based indexing)

        //Place each letter of the word on the grid
        for (let j = 0; j < word.length; j++) {
          //Decide which cell to target depending on "across" or "down"
          let targetCell =
            currentName === "across"
              ? rowsArray[startY][startX + j] //Move right for across
              : rowsArray[startY + j][startX]; //Move down for down

          //If there's no target cell, stop processing this word
          if (!targetCell) break;

          let input;
          //Reuse existing input if already created, otherwise create a new <input>,
          //this pertains to crossroad cells where a letter is a part of both an across and down answer
          if (targetCell.tagName === "INPUT") {
            input = targetCell;
          } else {
            input = document.createElement("input");
            input.type = "text";
            input.maxLength = 1;
            //At first we create all blanks cells crossWordWidth * crossWordWidth,
            //which is why replace is used here, we rewrite specific cells with what we determine need to change to input cells
            targetCell.replaceWith(input);
          }
          //Add clue number to the first cell of the word
          if (j === 0) {
            dataClueNumber = i + 1;
            input.setAttribute("data-clue", dataClueNumber);
          }

          // Update our rows array. This code is replacing the blanks we previously added to the rowsArray with our new cells
          if (currentName === "across") {
            rowsArray[startY][startX + j] = input;
          } else {
            rowsArray[startY + j][startX] = input;
          }
          //Add classes so each input can be tracked (e.g., "across_5_2")
          input.classList.add(`${currentName}_${dataClueNumber}_${j + 1}`);

          let ariaText = `Clue ${dataClueNumber}, ${currentName}, letter ${j + 1} of ${word.length}`;
          let idText = `clue_${dataClueNumber}_${currentName}_cell_${j + 1}`;

          // If an aria-label already exists, append to it, so that cells which intersect 2 answers have an 
          // id/label that represents both its across and down clue
          if (input.hasAttribute("aria-label")) {
            let existingLabel = input.getAttribute("aria-label");
            input.setAttribute("aria-label", existingLabel + " | " + ariaText);

            let existingId = input.id;
            input.id = `${existingId}_and_${idText}`;
          } else {
            input.setAttribute("aria-label", ariaText);
            input.id = idText;
          }
        }

        //Create wrapper div which encapsulates the clue, correctness icon and hint button for each question
        const wrapperDiv = document.createElement("div");
        wrapperDiv.className = "list_and_clue";

        //Create clue item and set attributes
        const clueAndIcon = document.createElement("div");
        clueAndIcon.classList.add("clue_text");
        clueAndIcon.setAttribute("data-clue", `${i + 1}`);
        clueAndIcon.setAttribute("data-dir", currentName);
        clueAndIcon.setAttribute("tabindex", 0);
        clueAndIcon.setAttribute("data-length", word.length);
        clueAndIcon.classList.add(`${currentName}_${i + 1}`);
        clueAndIcon.classList.add("clue");
        const clueP = document.createElement("p");

        //Set the clue text
        const clueText = `${i + 1}. ${entry[1]} (${word.length})`;
        clueAndIcon.setAttribute("data-original-clue", entry[1]);
        clueP.textContent = clueText;

        //Create span for correctness icon
        const correctnessIcon = document.createElement("span");
        correctnessIcon.classList.add("correctness_icon");

        //Create hint button and set attributes
        const hintBtn = document.createElement("button");
        hintBtn.className = "hint-button disabled";
        hintBtn.setAttribute("aria-hidden", "true");
        hintBtn.setAttribute("aria-expanded", "false");
        hintBtn.setAttribute("data-clue", `${i + 1}`);
        hintBtn.setAttribute("data-dir", currentName);
        hintBtn.classList.add(`${currentName}_${i + 1}`);
        hintBtn.textContent = "HINT";

        clueAndIcon.appendChild(clueP);
        clueAndIcon.appendChild(correctnessIcon);
        clueAndIcon.appendChild(hintBtn);

        // Append clue, icon and button set to wrapper div
        wrapperDiv.appendChild(clueAndIcon);

        // Append wrapper to its correct list
        currentName === "across"
          ? acrossUl.appendChild(wrapperDiv)
          : downUl.appendChild(wrapperDiv);
      }
    }
  }
  cluesDiv.appendChild(downUl);
  cluesDiv.appendChild(acrossUl);
}
createCellsAndClues();

// Append the button to the parent div
cluesDiv.appendChild(checkAnswerButton);

//Function to wrap span around cells that need data clues numbers, as pseudo before: element not possible on <input>
document.querySelectorAll("input[data-clue]").forEach((input) => {
  let clueNumber = document.createElement("span");
  clueNumber.textContent = input.getAttribute("data-clue");
  clueNumber.className = "clue-number";

  // Wrap input in a relatively positioned container
  let wrapper = document.createElement("div");
  wrapper.style.position = "relative";
  wrapper.style.display = "inline-block";

  // Move input inside the wrapper
  input.parentNode.insertBefore(wrapper, input);
  wrapper.appendChild(clueNumber);
  wrapper.appendChild(input);
});

//Popup element variables 
const closeButton = document.querySelector(".close_popup");
const popup = document.querySelector(".popup");

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("hint-button")) {
    openHintWindow(e)
  }
});

document.addEventListener("keydown", function (e) {
  // Only trigger on Enter key when focused on a hint button
  if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("hint-button")) {
    e.preventDefault(); // prevent default scrolling for Space
    openHintWindow(e);
  }
});

document.addEventListener('keydown', function (e) {
  closePopup(e)
});

document.addEventListener('click', function (e) {
  // Handle close button
  if (e.target.closest(".close_popup")) {
    popup.classList.add("hide");
    isPopupOpen = false;
  }
});

//Initialise last focused element 
let lastFocusedElement = null;

function openHintWindow(e) {
  if (!e.target.classList.contains("hint-button")) return;
  e.target.setAttribute("aria-expanded", "true");
  isPopupOpen = true;
  //Set last focused element to the element which was selected in order to fire this function (hint button)
  lastFocusedElement = e.target;

  //Get clue number and direction
  const clueNum = parseInt(e.target.getAttribute("data-clue")) - 1;
  const clueDir = e.target.getAttribute("data-dir");

  const array = clueDir === "across" ? across : down;
  //Get the hint from correct array for the question
  const hintEntry = array[clueNum];

  //Ensures we dont get any of the empty arrays
  if (hintEntry && hintEntry.length > 0) {
    //set hint to correct array/index
    const hintText = hintEntry[4];
    const hintTextElement = document.getElementById("popup_hint_text");

    popup.classList.remove("hide");
    //Set the hint text
    hintTextElement.textContent = hintText;

    document.querySelector(".close_popup").setAttribute("tabindex", 0);
    document.querySelector("#popup_hint_text").setAttribute("tabindex", 0);
  }
}

function closePopup(e) {
  //if popup is not open, return
  if (!isPopupOpen) return;
  //Otherwise...
  //Set accessibility attributes
  popup.setAttribute("role", "dialog");
  popup.setAttribute("aria-modal", "true");

  //Get only elements you wish to be focusable while popup is open, store them in a variable
  const focusable = [
    document.querySelector(".close_popup"),
    document.querySelector("#popup_hint_text")
  ];
  //Get the index of the active element, 
  const index = focusable.indexOf(document.activeElement);

  if (e.key === "Tab") {
    e.preventDefault();
    //If shift and key pressed at same time, move backwards. 
    //Else, cycle forwards between the focusable elements
    let nextIndex = e.shiftKey ? index - 1 : index + 1;
    if (nextIndex < 0) nextIndex = focusable.length - 1;
    if (nextIndex >= focusable.length) nextIndex = 0;
    focusable[nextIndex].focus();
  }
}

//On close button click
closeButton.addEventListener("click", function (e) {
  //Hide hint popup
  popup.classList.add("hide");
  //Set popup flag to false
  isPopupOpen = false;
  //Set attribute of the last focused element (hint-button) to false
  lastFocusedElement.setAttribute("aria-expanded", "false");
  //Set attribute of hint popup modal to false
  popup.setAttribute("aria-modal", "false");
});

document.addEventListener("keydown", function (e) {
  //Check if key is Enter or Space
  if (
    (e.key === "Enter" || e.key === " ") &&
    //If close popup selected 
    document.activeElement.classList.contains("close_popup")
  ) {
    //Set attributes
    popup.classList.add("hide");
    popup.setAttribute("aria-modal", "false");
    isPopupOpen = false;
    if (lastFocusedElement) {
      lastFocusedElement.focus(); //Restore focus to same clue’s hint button
      lastFocusedElement.setAttribute("aria-expanded", "false");
    }
  }
});

checkAnswerButton.addEventListener("keydown", function (e) {
  if (e.key === "Enter" || e.key === " ") {
    checkAnswer();
    e.preventDefault();
  }
});

//get the number of across clues/answers by getting the length of across array minus empty subarrays.
let truthyAcross = across.filter((arr) => arr.length > 0).length;
//get the number down clues/answers by getting the length of down array minus empty subarrays.
let truthyDown = down.filter((arr) => arr.length > 0).length;
//initialise correctAnswers as an empty array
let correctAnswers = [];
//This is what the length of the correctAnswers array should be once the user has answered every answer correctly.
let correctAnswersExpectedLength = truthyAcross + truthyDown;
let userInput;

//checkAnswer function fired when check answer button is selected.
function checkAnswer() {
  //Loop through each answer set (across and down)
  for (let k = 0; k < answerArray.length; k++) {
    let currentArray = answerArray[k].data; // Get the actual array
    let currentName = answerArray[k].name; // Get the string "across" or "down"

    for (let i = 0; i < currentArray.length; i++) {
      let correctWord = currentArray[i][0]; // Extract the correct word (answer)
      let currentClue = currentArray[i][1]; //Clue text

      if (correctWord) {
        let isCorrect = true; // Assume the answer is correct until proven otherwise
        let isIncomplete; //Initialise as incomplete

        // Iterate over each letter of the correct word without breaking early
        for (let j = 0; j < correctWord.length; j++) {
          let currentCell = document.querySelector(
            `.${currentName}_${i + 1}_${j + 1}`
          );

          // If no cell found or empty value, mark incomplete
          if (!currentCell || currentCell.value.trim() === "") {
            isIncomplete = true;
          } else {
            // Check if letter matches (case-insensitive)
            if (currentCell.value.trim().toLowerCase() !== correctWord[j]) {
              isCorrect = false;
            }
          }
        }

        // Get corresponding clue element
        let clueLi = document.querySelector(
          `div[data-clue="${i + 1}"][data-dir="${currentName}"] p`
        );

        //Build a unique key like "across 3" or "down 7" - used to determine overall correctness
        const clueKey = `${currentName} ${i + 1}`;
        const indexInCorrect = correctAnswers.indexOf(clueKey);

        // Locate this clue’s tick/cross icon and hint button
        let thisIcon = clueLi
          .closest(".clue")
          .querySelector(".correctness_icon");
        let thisHintBtn = clueLi
          .closest(".list_and_clue")
          .querySelector(".hint-button");
        //############ IS INCORRECT
        if (isIncomplete) {
          //Reset clue text without icon or hint
          if (clueLi) {
            clueLi.textContent = `${i + 1}. ${currentClue} (${correctWord.length
              })`;
            if (
              thisIcon.classList.contains("correct_tick") ||
              thisIcon.classList.contains("incorrect_cross")
            ) {
              //Remove tick/cross if previously set
              thisIcon.classList.remove("correct_tick", "incorrect_cross");
            }
          }
          // Remove this clue from correctAnswers if it was there before
          if (indexInCorrect !== -1) {
            correctAnswers.splice(indexInCorrect, 1);
          }
          if (!thisHintBtn.classList.contains("disabled")) {
            thisHintBtn.classList.add("disabled");
            thisHintBtn.setAttribute("aria-hidden", "true");
          }
          //############ IS CORRECT
        } else if (isCorrect) {
          //Replace underscores with the correct answer in uppercase
          if (clueLi) {
            clueLi.textContent = `${i + 1}. ${currentClue.replace(
              "_________________",
              correctWord.toUpperCase()
            )} (${correctWord.length})`;
            // Remove cross if present, add tick
            if (thisIcon.classList.contains("incorrect_cross")) {
              thisIcon.classList.remove("incorrect_cross");
            }
            thisIcon.classList.add("correct_tick");
            //If hint button isnt disabled, disable it
            if (!thisHintBtn.classList.contains("disabled")) {
              thisHintBtn.classList.add("disabled");
              thisHintBtn.setAttribute("aria-hidden", "true");
            }
          }

          //For each cell for the correct word
          for (let j = 0; j < correctWord.length; j++) {
            let currentCell = document.querySelector(
              `.${currentName}_${i + 1}_${j + 1}`
            );
            let currentClue = document.querySelector(
              `.${currentName}_${i + 1}`
            );
            //Set cell to read only, remove from tab order and "lock" cell
            if (currentCell) {
              currentCell.readOnly = true;
              if (currentClue) {
                currentClue.style.pointerEvents = "none";
                currentClue.classList.add("locked-cell");
                currentClue.setAttribute("tabindex", -1);
                currentClue.setAttribute("aria-disabled", "true");
                currentClue.classList.remove("current");
              }
              currentCell.classList.add("locked-cell");
              currentCell.classList.remove("editting");
              currentCell.classList.remove("cursor");
            }
          }
          // Add to correct answers array if not already present
          if (!correctAnswers.includes(clueKey)) {
            correctAnswers.push(clueKey);
          }
        } else {
          // INCORRECT ANSWER
          // show cross and hint button
          if (clueLi) {
            clueLi.innerHTML = `${i + 1}. ${currentClue} (${correctWord.length
              })`;
            thisIcon.classList.add("incorrect_cross");
            //Display the hint button for this question
            thisHintBtn.classList.remove("disabled");
            thisHintBtn.setAttribute("aria-hidden", "false");
          }
          // Remove from correct answers if previously added
          if (indexInCorrect !== -1) {
            correctAnswers.splice(indexInCorrect, 1);
          }
        }
      }
    }

    //setting score to pass to continue when activity correct logic
    // ########uncomment below when theres a quiz in the unit
    // let score = 100; //IZ
    // let scoreToPass = 100; //IZ
    // // Check that the length of correctAnswers array is the same as the length of expectedCorrectAnswers.
    if (correctAnswers.length === correctAnswersExpectedLength) {
      // If so, fire "all correct" dialog box.
      document.getElementById("dialog_feedback").style.display = "block";
      //   parent.parent.quizScores(score, scoreToPass); //IZ
    }
  }
}

//FOLLOWING IS LOGIC FROM STARTING POINT/EXAMPLE (IZ)

// Create an array of input elements and blank cells from the crossword
let index = Array.from(
  document.querySelectorAll("#crossword input, #crossword .blank")
);

// Create an array of clue elements
let clues = Array.from(document.querySelectorAll("div[data-clue]"));
// Select all in one query, in DOM order
let checkAndClues = Array.from(
  document.querySelectorAll("div[data-clue], #checkAnswer, .hint-button")
);

// State object to track the current state of the crossword
let state = {
  index: null, // Index of the current input
  clue: null, // Current clue number
  cursor: 0, // Current position of the cursor
  answers: {}, // Store answers for each clue
  count: 16, // Number of clues (example value)
};

// Function to toggle highlighting on the crossword cells based on the clue
// This is triggered by mouseover and mouseout events
function toggleClue() {
  let c = this.getAttribute("data-clue"); // Get the clue number
  let d = this.getAttribute("data-dir"); // Get the direction: "across" or "down"
  let l = this.getAttribute("data-length"); // Get the length of the word
  let s = index.indexOf(document.querySelector('input[data-clue="' + c + '"]'));

  // Highlight the correct cells based on direction (across/down)
  for (let x = 0; x < l; x++) {
    if (d === "across") {
      index[s + x].classList.toggle("highlight");
    } else {
      index[s + x * crossWordWidth].classList.toggle("highlight");
    }
  }
}

// Function to handle the editing of a clue
// It updates the state and adds visual classes to the crossword cells
function editClue() {
  // Remove any previous cursor, editing, or current classes
  Array.from(document.querySelectorAll(".cursor,.editting,.current")).map(
    (el) => el.classList.remove("cursor", "editting", "current")
  );

  let c = parseInt(this.getAttribute("data-clue"));
  let l = parseInt(this.getAttribute("data-length"));
  let d = this.getAttribute("data-dir");
  let s = index.indexOf(document.querySelector('input[data-clue="' + c + '"]'));

  for (let x = 0; x < l; x++) {
    let cell;
    if (d === "across") {
      cell = index[s + x];
    } else {
      cell = index[s + x * crossWordWidth];
    }

    if (cell && !cell.classList.contains("locked-cell")) {
      cell.classList.add("editting");
    }
  }
  // Update the state with the current clue details
  state.index = s;
  state.clue = c;
  state.dir = d;
  state.length = l;
  if (state.answers[c + "-" + d] === undefined) {
    state.answers[c + "-" + d] = "";
    state.cursor = 0;
  } else {
    if (state.length === state.answers[c + "-" + d].length) {
      state.cursor = state.answers[c + "-" + d].length - 1;
    } else {
      state.cursor = state.answers[c + "-" + d].length;
    }
  }
  // Set the cursor on the correct cell
  if (state.dir === "across") {
    const target = index[s + state.cursor];

    //Check that cell isnt locked cell before adding cursor
    if (target && !target.classList.contains("locked-cell"))
      target.classList.add("cursor");

  } else {
    const target = index[s + state.cursor * crossWordWidth];
    //NEW IZ, so error isnt thrown if target is check answer button
    if (target && !target.classList.contains("locked-cell"))
      target.classList.add("cursor");
  }
  //Highlight the current clue in the clues list
  const clueElement = document.querySelector(
    'div[data-clue="' + c + '"][data-dir="' + d + '"]'
  );
  //Check that this clue isnt locked, before adding "current" class/highlight
  if (clueElement && !clueElement.classList.contains("locked-cell")) {
    clueElement.classList.add("current");
  }
}

// Add event listeners to the clues for mouseover, mouseout, and click
clues.forEach((clue) => {
  ["mouseover", "mouseout"].map((e) => {
    clue.addEventListener(e, toggleClue);
  });
  clue.addEventListener("click", editClue);
});

// Handle keyboard input for navigation and answering crossword clues
let target;
let navigables = [];

document.addEventListener(
  "keydown",
  (e) => {
    e.preventDefault();

    switch (e.key) {
      //Ignore shift, space and enter keys
      case "Shift":
      case "Space":
      case "Enter":
        return;

      case "Tab": {
        //Exit/dont run this tab functionality if hint popup window is open 
        if (isPopupOpen) return;

        //Create an array for all the questions/clues, visible hint buttons ant the check answer button
        //These are all the elements we want to cycle through when selecting tab
        //filter out any locked clues 
        navigables = Array.from(
          document.querySelectorAll(
            "div[data-clue], .hint-button:not(.disabled), #checkAnswer"
          )
        );

        // .filter((el) => !el.classList.contains("locked-cell"));

        //Get the current active element and find its index within the navigables array
        let current = document.activeElement;
        let c = navigables.indexOf(current);

        //Cycle backwards through elements in navigables array if shift and tab selected at same time, 
        //otherwise cycle forwards
        let nc = e.shiftKey ? c - 1 : c + 1;
        //loop backwards when arriving at first element
        if (nc < 0) nc = navigables.length - 1;
        //loop forwards when arriving at last element
        if (nc >= navigables.length) nc = 0;

        //Get the current target and focus it 
        target = navigables[nc];
        target.focus();

        //Call edit clue function with the correct element as parameter 
        editClue.bind(target)();
        return;
      }

      case "Backspace": {
        //Only act if a clus is currently active
        if (!state.clue) return;
        // Build a unique key: e.g., "3-across"
        let key = state.clue + "-" + state.dir;
        // Remove the last typed character for this answer
        state.answers[key] = state.answers[key].slice(0, -1);
        break;
      }

      // --- DEFAULT (letters, numbers, etc.) ---
      default: {
        // Only act if a clue is active
        if (!state.clue) return;
        if (e.key.length > 1) return;

        // Ignore non-character keys (like ArrowUp, F1, etc.)
        let key = state.clue + "-" + state.dir;
        // Only add the character if the word isn’t full
        if (state.answers[key].length < state.length) {
          state.answers[key] += e.key;
        }
        break;
      }
    }

    //Ensures if hint button is whats focused, and user starts typing, console error doesnt fire
    if (e.target.classList.contains("hint-button")) {
      return;
    }

    // === Move cursor highlight ===
    if (state.dir === "across") {
      index[state.index + state.cursor].classList.remove("cursor");
    } else {
      index[state.index + state.cursor * crossWordWidth].classList.remove(
        "cursor"
      );
    }

    state.cursor = state.answers[state.clue + "-" + state.dir].length;
    state.cursor = Math.max(0, Math.min(state.cursor, state.length - 1));

    if (state.dir === "across") {
      index[state.index + state.cursor].classList.add("cursor");
    } else {
      index[state.index + state.cursor * crossWordWidth].classList.add(
        "cursor"
      );
    }

    // === Update visible letters ===
    for (let x = 0; x < state.length; x++) {
      // Get character for this position, or empty string if none typed
      let answerChar = state.answers[state.clue + "-" + state.dir][x] || "";
      // Find the correct cell based on clue direction
      let cell =
        state.dir === "across"
          ? index[state.index + x]
          : index[state.index + x * crossWordWidth];
      // Only update cell if it’s not locked
      if (!cell.classList.contains("locked-cell")) {
        cell.value = answerChar;
      }
    }
  },
  false
);

// Function to select a clue and edit it
function selectClue() {
  let c = parseInt(this.getAttribute("data-clue"));
  let li = Array.from(document.querySelectorAll('div[data-clue="' + c + '"]'));
  if (li.length === 1) {
    editClue.bind(li[0])();
  } else {
    if (state.dir === "across") {
      editClue.bind(li[1])();
    } else {
      editClue.bind(li[0])();
    }
  }
}

// Add click event listener to input elements to select the corresponding clue
Array.from(document.querySelectorAll("input[data-clue]")).map((el) => {
  el.addEventListener("click", selectClue);
});
