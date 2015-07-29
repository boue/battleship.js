// store state of game and implement logic that modifies state
var model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,

  ships: [
    { locations: [0 , 0, 0], hits: ["", "", ""] },
    { locations: [0 , 0, 0], hits: ["", "", ""] },
    { locations: [0 , 0, 0], hits: ["", "", ""] }
  ],

  generateShipLocations: function(){
     var locations;
     for (var i = 0; i < this.numShips; i++){
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
      // we try until they don't overlap, keep generating new lcoations
      this.ships[i].locations = locations;
     }
  },

  generateShip: function(){
    var direction = Math.floor(Math.random() * 2);
    var row, col;
    
    if (direction === 1) {
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else {
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }

    var newShipLocations = [];
    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        newShipLocations.push(row + "" + (col + i));
      } else {
        newShipLocations.push((row + i) + "" + col);
      }
    }
    return newShipLocations;
  },

  collision: function(locations) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = model.ships[i];
      for (var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  },

  fire: function(guess){
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      // indexOf() searches an array for a matching value and
      // returns its index, or -1 if it can't find it
      var index = ship.locations.indexOf(guess);
      if (index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("HUGE HIT!");
        if (this.isSunk(ship)) {
          view.displayMessage("You destroyed that ship!");
          this.shipsSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("Sorry Captain that's a wasted missile!");
    return false;
  },

  isSunk: function(ship){
    for (var i = 0; i < this.shipLength; i++){
      if (ship.hits[i] !== "hit"){
        return false;
      }
    }
    return true;
  }
};

// update display when state in model changes
var view = {
  displayMessage: function(msg){
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },

  displayHit: function(location){
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },

  displayMiss: function(location){
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }
};

// glue game together, player's guess sent to model to update state
// see when game is complete
var controller = {
  guesses: 0,

  processGuess: function(guess){
    var location = parseGuess(guess);
    if (location) {
      this.guesses++;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage("You sank all the battleships, in " +
                            this.guesses + " guesses");
      }
    }
  }
};

function parseGuess(guess){
  var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

  if (guess === null || guess.length !== 2) {
    alert("Oops, not a valid guess");
  } else {
    firstChar = guess.charAt(0);
    var row = alphabet.indexOf(firstChar);
    var column = guess.charAt(1);

    if (isNaN(row) || isNaN(column)) {
      alert("That is not on this board");
    } else if (row < 0 || row >= model.boardSize || 
              column < 0 || column >= model.boardSize) {
      alert("Oops, that's off the board!");
    } else {
      return row + column;
    }
  }
  return null;
}

function init(){
  var fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;

  model.generateShipLocations();
}

function handleKeyPress(e){
  var fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13){
    fireButton.click();
    return false; //so the form doesn't do anything else
  }
}

function handleFireButton(){
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value;
  controller.processGuess(guess);
  guessInput.value = ""; //just resets the inside of the form
}

window.onload = init;

// controller.processGuess("A6");
// controller.processGuess("B6");
// controller.processGuess("C6");

// controller.processGuess("C4");
// controller.processGuess("D4");
// controller.processGuess("E4");

// controller.processGuess("B0");
// controller.processGuess("B1");
// controller.processGuess("B2");
// console.log(parseGuess("00")); this gives "oops, thats 
// off the board" bc row = -1 since it is undefined and when
// we checked indexOf(firstChar) it gave -1

// model.fire("53");
// model.fire("06");
// model.fire("16");

