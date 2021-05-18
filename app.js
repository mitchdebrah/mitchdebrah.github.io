let boardDk = []; // empty array for the 52 cards
let competitors = []; // empty aray for competitors
let currentCompetitor = 0; // set at 0 for the 2 players

const boardDkCreation = () => {
  boardDk = [];
  // array of cards 
  const cardSuits = ["S", "H", "D", "C"];
  const ranks = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
  ];
 // assigns values to cards ace get 11, jack, queen, king gets a value of 10.
  for (let i = 0; i < ranks.length; i++) {
    for (let n = 0; n < cardSuits.length; n++) {
      let values = parseInt(ranks[i]); // converts  the strings into integers and assigns values to them.
      if (ranks[i] == "J" || ranks[i] == "Q" || ranks[i] == "K") values = 10;
      if (ranks[i] == "A") values = 11;
      let card = {   //objects  to hold  the ranks, suits and values 
        Rank: ranks[i],
        Suit: cardSuits[n],
        Value: values,
      };
      boardDk.push(card);
    }
  }
};

//  creates players, and pushes  players properties into player array.
const playersCreated = (number) => {
  competitors = [];
  for (let i = 1; i <= number; i++) {
    let hand = [];  // array of players current hand
    let player = { // objects to hold  player properties such as name, points  and players that will be stored in an object.
      Name: "Player " + i,
      Code: i,
      Scored: 0,
      Hand: hand,
    };
    competitors.push(player); // pushes object properties of variable player into an array of competitors
  }
};

//  creates divs and  appends them to players points and hand 
const userInterface = () => {
  document.getElementById("competitors").innerHTML = ""; 

  for (let e = 0; e < competitors.length; e++) {
    let playdiv = document.createElement("div");
    
    playdiv.id = "player_" + e;  // id attributes gives a unique identity to the player  + an index element from the compettitors  array.  add num 0 
    playdiv.className = "player"; //  gets and sets a class arttribute of player
   
    let playdivid = document.createElement("div");
    playdivid.innerHTML = "Player" + competitors[e].Code; // Player gets number 1 (player number 1)
    playdiv.appendChild(playdivid);

    let handiv = document.createElement("div");
    handiv.id = "hold_" + e;
    playdiv.appendChild(handiv);

    let pointdiv = document.createElement("div");
    pointdiv.className = "scorepts";
    pointdiv.id = "scorepts_" + e; // gets points 

    playdiv.appendChild(pointdiv);
    document.getElementById("competitors").appendChild(playdiv);
  }
};
//  shuffles a 100 card  
const cardShuffle = () => {
  for (let j = 0; j < 100; j++) {
    let topShuff = Math.floor(Math.random() * boardDk.length);
    let downShuff = Math.floor(Math.random() * boardDk.length);
    let spot = boardDk[topShuff];

    boardDk[topShuff] = boardDk[downShuff];
    boardDk[downShuff] = spot;
  }
};

// the game satrts here , has a restart and a deal button 
const beginBJGame = () => {
  document.getElementById("reset").value = "DEAL";
  currentCompetitor = 0; // sets current player to a no point
  boardDkCreation();
  cardShuffle();
  playersCreated(2); // takes argument for  the  " number " parameter

  userInterface();
  document
    .getElementById("player_" + currentCompetitor)  // the currentplayer 1 0r 2
  dealerhand();
};

const dealerhand = () => {
  // distributes the cards to the players each player gets two cards.  after shuffling
  for (let j = 0; j < 2; j++) {
    for (let q = 0; q < competitors.length; q++) {
      let card = boardDk.pop(); // removes the last element from the boardDk array 
      competitors[q].Hand.push(card); // property key in player object accesses the competitor array and pushes value to card
      displayCard(card, q);// the function is accessed 
      newScores(); // new points from the game are displayed.
    }
  }

  newDeck();  // calls newDeck function
};

//// created card symbols and userInterface, will updated to a colored image through CSS
const displayCard = (card, player) => {
  let hand = document.getElementById("hold_" + player);
  hand.appendChild(cardInterface(card));
};


// creates card GUI 
const cardInterface = (card) => {
  let intface = document.createElement("div");
  let symbol = "";

  // a conditional statement to assign suits decimal code to a symbol variable
  if (card.Suit == "H") {  
    symbol = "&#9829;"; // Hearts
  } else if (card.Suit == "S") {
    symbol = "&#9824;"; // spade
  } else if (card.Suit == "D") {
    symbol = "&#9830;";// diamonds
  } else {
    symbol = "&#9827;";  // clubs
  }

  intface.className = "card";
  intface.innerHTML = card.Rank + "<br/>" + symbol;
  return intface;
};

const getScores = (player) => {
  // returns the number of points at hand
  let scorpts = 0;
  for (let j = 0; j < competitors[player].Hand.length; j++) {
    scorpts += competitors[player].Hand[j].Value;
  }
  competitors[player].Scored = scorpts;
  return scorpts;
};
const newScores = () => {
  for (let i = 0; i < competitors.length; i++) {
    getScores(i);
    document.getElementById("scorepts_" + i).innerHTML = competitors[i].Scored;
  }
};

// removes card from deck to player and chesk for points over 21
//  pops card from  the displayCard function , sums the  card value from the dealchk function to the newDeck function, then to the total points using the newScore function 
const hit = () => {
  let card = boardDk.pop();
  competitors[currentCompetitor].Hand.push(card);
  displayCard(card, currentCompetitor);
  newScores();
  newDeck();
  dealChk();
};

const stand = () => {
  // moves to the next player or alternates between players , checks  and update current player, if no player availabel it calls the gameOver function.
  if (currentCompetitor != competitors.length - 1) {
    document
      .getElementById("player_" + currentCompetitor)
      .classList.remove("current");
    currentCompetitor += 1;
    document
      .getElementById("player_" + currentCompetitor)
      .classList.add("current");
  } else {
    gameOver();
  }
};

// ends the game if one of the player's scores more  than 21 pts and the other has less  the total needed points to win.
const gameOver = () => { 
  let Winner_is = "";
  let pointscored = 0;
  for (let vic = 0; vic < competitors.length; vic++) {
    if (competitors[vic].Scored > pointscored && competitors[vic].Scored < 22) {
      Winner_is = vic;
    }
    pointscored = competitors[vic].Scored;
  }
  document.getElementById("stateOfGame").innerHTML =
    "Player  " + competitors[Winner_is].Code + ": Won !!";
  document.getElementById("stateOfGame").style.display = "inline-block";
};


const dealChk = () => {
  // displays and check player who lost the game, and scored more than the needed points.
  if (competitors[currentCompetitor].Scored > 21) {
    document.getElementById("stateOfGame").innerHTML =
      "Player " + competitors[currentCompetitor].Code + ":  Lost";

    document.getElementById("stateOfGame").style.display = "inline-block"; //allows to set a width and height on the element.
  }
};

// refreshes and sets new deck for the game -- sets 52 cards
const newDeck = () => {
  document.getElementById("total-number-cards").innerHTML = boardDk.length;
};

//fires when the initial HTML document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.
window.addEventListener('DOMContentLoaded', () =>{
boardDkCreation();
cardShuffle();
playersCreated();

})

