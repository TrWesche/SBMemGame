const gameContainer = document.getElementById("game");
const scoreTracker = document.querySelector("#score");
const newGameButton = document.querySelector("#new-game");


const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];


let clickWatchdog = false;                              // Variable used to disable clicks during no match timeout
let qtyClicks = 0;                                      // Varaible for tracking game clicks


// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;
  console.log("shuffle");
  while (counter > 0) {                               // While there are elements in the array
    let index = Math.floor(Math.random() * counter);  // Pick a random index   
    counter--;                                        // Decrease counter by 1

    let temp = array[counter];                        // And swap the last element with it
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

// let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  let index = 0;
  console.log("create divs");
  for (let color of colorArray) {
    const newDiv = document.createElement("div");       // create a new div
    newDiv.classList.add(color);                        // give it a class attribute for the value we are looping over
    newDiv.setAttribute("data-id", index);

    newDiv.addEventListener("click", handleCardClick);  // call a function handleCardClick when a div is clicked on

    gameContainer.append(newDiv);                       // append the div to the element with an id of game
    
    index++;
  }
}


// =================================================
// 11111111111111   HELPER FUNCTIONS 111111111111111
// =================================================
const getLastCard = () => {
  return (JSON.parse(sessionStorage.getItem('last_card_selection')));
};

const noMatchFound = (currentCard, lastCard) => {
  setTimeout(() => {
    console.log('No Match!');
    console.log(currentCard);
    console.log(lastCard);
    currentCard.style.backgroundColor = "";
   
    const card_1 = document.querySelector(`#game div[data-id="${lastCard.id}"]`);
    card_1.style.backgroundColor = "";
  
    sessionStorage.removeItem('last_card_selection');
    clickWatchdog = false;
  }, 1000);
};

const matchFound = (currentCard, lastCard) => {
  currentCard.removeEventListener("click", handleCardClick);

  const card_1 = document.querySelector(`#game div[data-id="${lastCard.id}"]`);
  card_1.removeEventListener("click", handleCardClick);

  sessionStorage.removeItem('last_card_selection');
}


const incrementClicks = () => {
  qtyClicks += 1;
  scoreTracker.innerText = qtyClicks;
}

const resetClicks = () => {
  qtyClicks = 0;
  scoreTracker.innerText = qtyClicks;
}


const saveLastScore = () => {
  let previous_scores = JSON.parse(localStorage.getItem('score-history'));
  if (previous_scores) {
    previous_scores.push(qtyClicks);
  } else {
    previous_scores = [qtyClicks];
  }

  localStorage.setItem('score-history',JSON.stringify(previous_scores));
}


const removeOldDivs = () => {
  const divParent = document.querySelector("#game");
  console.log(divParent.childNodes);
  if (divParent) {
    while (divParent.childNodes.length > 0 ){
      console.log(divParent.childNodes[0]);
      divParent.childNodes[0].remove();
    }
  }
}



// =================================================
// 222222222222222 Click Handlers 222222222222222222
// =================================================
function handleCardClick(event) {
  if (!clickWatchdog) {
    console.log("you just clicked", event.target);

    const color = event.target.classList[0];              // Retrieve information on current card click
    const id = event.target.getAttribute("data-id");
    
    event.target.style.backgroundColor = color;           // Set the background color
    
    const lastCard = getLastCard();                       // Retrieve information on last card click
    // console.log(lastCard);

    if(lastCard) {                                        // Check lastCard variable is valid
      if (lastCard.id !== id) {                           // If there was an additional click on the same card do nothing
        incrementClicks();
        if (lastCard.color !== color) {                   // No Match Found
          clickWatchdog = true;
          noMatchFound(event.target, lastCard);
        } else {                                          // Match Found
          matchFound(event.target, lastCard);
        }
      }
    } 
    else {                                                // If no last card save current card choice to session storage
      incrementClicks();
      cardChoice = {
        id: event.target.getAttribute("data-id"),
        color: event.target.classList[0]
      }
      sessionStorage.setItem('last_card_selection', JSON.stringify(cardChoice));
    }
  }
}


const newGame = () => {
  if (qtyClicks > 0) {
    saveLastScore();
    resetClicks();
  }
  removeOldDivs();
  console.log("old divs removed");
  let shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
}

// Create a New Game
newGameButton.addEventListener("click", newGame);

// when the DOM loads
// createDivsForColors(shuffledColors);


