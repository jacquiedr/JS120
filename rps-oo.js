const readline = require('readline-sync');
const VALID_CHOICES = ['rock', 'paper', 'scissors', 'spock', 'lizard', 'r', 'p', 'sc', 'sp', 'l'];
const SHORT_INPUTS = {
  r: 'rock',
  sc: 'scissors',
  p: 'paper',
  sp: 'spock',
  l: 'lizard'
};
const WINNING_COMBOS = {
  rock: ['scissors', 'lizard'],
  scissors: ['paper', 'lizard'],
  paper: ['spock', 'rock'],
  spock: ['scissors', 'rock'],
  lizard: ['spock', 'paper']
};
const STARTING_SCORE = 0;
const START_ROUND_COUNT = 0;
const PAST_MOVES = 5;
const NUM_OF_ROUNDS = 5;


const RPSGame = {
  human: createHuman(),
  computer: createComputer(),
  round: START_ROUND_COUNT,
  roundInMatch: NUM_OF_ROUNDS,

  getHumanName() {
    let inputName;
    this.printEmptyLine();

    while (true) {
      inputName = readline.question('Please enter your name to get started: ').trim();

      if (![undefined, null, NaN, ''].includes(inputName)) break;
      console.log('That is not valid input.');
    }

    this.human.name = inputName;
    return inputName;
  },

  printEmptyLine() {
    console.log('');
  },

  clearScreen() {
    console.clear();
  },

  freezeGame() {
    readline.question('\nPress \'enter\' to continue');
  },

  displayWelcomeMessage() {
    let humanName = this.getHumanName();
    this.clearScreen();
    console.log(`Hi, ${humanName}!`);
    this.printEmptyLine();
    console.log('Welcome to Rock, Paper, Scissors, Lizard, Spock.');
  },

  displayRules() {
    this.printEmptyLine();

    Object.keys(WINNING_COMBOS).forEach(choice => {
      console.log(`${choice.toUpperCase()} beats ${WINNING_COMBOS[choice][0].toUpperCase()} and ${WINNING_COMBOS[choice][1].toUpperCase()}`);
    });

    this.printEmptyLine();
    console.log('You will be playing best of five rounds against Computer. Best of luck!');
    this.freezeGame();
  },

  displayGoodbyeMessage() {
    this.printEmptyLine();
    console.log(`Thanks for playing Rock, Paper, Scissors, Lizard, Spock. Goodbye, ${this.human.name}!`);
  },

  getWinnerOfRound() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    if (WINNING_COMBOS[humanMove].includes(computerMove)) {
      return 'Human';
    } else if (WINNING_COMBOS[computerMove].includes(humanMove)) {
      return 'Computer';
    } else {
      return 'Tie';
    }
  },

  displayWinnerOfRound() {
    this.printEmptyLine();
    console.log(`You chose: ${(this.human.move).toUpperCase()}`);
    console.log(`The computer chose: ${(this.computer.move).toUpperCase()}`);
    this.printEmptyLine();

    let winner = this.getWinnerOfRound();

    if (winner === 'Human') {
      console.log(`${this.human.name} won the round!`);
    } else if (winner === 'Computer') {
      console.log('Computer won the round!');
    } else {
      console.log("That's a tie!");
    }
  },

  updateScoreBoard() {
    let winner = this.getWinnerOfRound();

    if (winner === 'Human') {
      this.human.score += 1;
    } else if (winner === 'Computer') {
      this.computer.score += 1;
    }
  },

  displayScoreBoard(stage) {
    console.log(`${stage} Scoreboard: `);
    console.log(`${this.human.name}: ${this.human.score}`);
    console.log(`Computer: ${this.computer.score}`);
    this.printEmptyLine();
  },

  playAgain() {
    console.log('Would you like to play again? (y/n)');
    let answer;

    while (true) {
      answer = readline.question().toLowerCase();
      if (['no', 'n', 'yes', 'y'].includes(answer)) break;
      console.log('Invalid input!');
    }

    return answer;
  },

  incrementRoundCount() {
    this.round += 1;
  },

  displayRoundCount() {
    console.log(`Round ${this.round} of ${this.roundInMatch}`);
    this.printEmptyLine();
  },

  detectWinnerOfMatch() {
    if ((this.computer.score > this.human.score)) {
      return 'Computer';
    } else if (this.human.score > this.computer.score) {
      return 'Human';
    }

    return 'Tie';
  },

  detectMajorityWon() {
    let majorityRounds = Math.ceil(this.roundInMatch / 2);

    if ((this.computer.score >= majorityRounds) ||
    (this.computer.score === NUM_OF_ROUNDS)) {
      return 'Computer';
    } else if ((this.human.score >= majorityRounds) ||
    (this.human.score === NUM_OF_ROUNDS)) {
      return 'Human';
    }

    return null;
  },

  displayWinnerOfMatch(winner) {
    if (winner === 'Computer') {
      console.log('Computer won the match! GG!');
      this.printEmptyLine();
    } else if (winner === 'Human') {
      console.log(`${this.human.name} won the match! Strong work!`);
      this.printEmptyLine();
    } else if (winner === 'Tie') {
      console.log('The match was a tie! Great game!');
      this.printEmptyLine();
    }
  },

  displayHistory() {
    console.log("\nEnter 'h' to see history of past moves, or press 'enter' to continue.");
    let answer;

    while (true) {
      answer = readline.question().toLowerCase();

      if (answer === 'h') {
        this.printEmptyLine();
        let humanNumMoves = Math.min(this.human.history.length, PAST_MOVES);
        let compNumMoves = Math.min(this.computer.history.length, PAST_MOVES);
        console.log(`${this.human.name}'s past ${humanNumMoves} moves: ${this.human.history.slice(-PAST_MOVES).join(', ')}`);
        console.log(`Computer's past ${compNumMoves} moves: ${this.computer.history.slice(-PAST_MOVES).join(', ')}`);
        break;
      } else if (answer === '') {
        break;
      }

      console.log("Sorry, invalid input! Please enter 'h' or press 'enter'.");
    }
    return answer;
  },

  resetGame() {
    this.human.score = STARTING_SCORE;
    this.computer.score = STARTING_SCORE;
    this.round = START_ROUND_COUNT;
  },

  playRound() {
    this.clearScreen();
    this.incrementRoundCount();
    this.displayRoundCount();
    this.displayScoreBoard('Current');
    this.human.choose();
    this.computer.choose();
    this.getWinnerOfRound();
    this.displayWinnerOfRound();
    this.updateScoreBoard();
    let history = this.displayHistory();

    if (history) {
      this.freezeGame();
    }
  },

  play() {
    this.displayWelcomeMessage();
    this.displayRules();

    while (true) {
      this.resetGame();

      while (this.round < this.roundInMatch) {
        this.playRound();
        if (this.detectMajorityWon()) break;
      }

      this.clearScreen();
      this.displayScoreBoard('Final');
      this.displayWinnerOfMatch(this.detectWinnerOfMatch());
      let wantsToPlayAgain = this.playAgain();
      if (wantsToPlayAgain === 'n' || wantsToPlayAgain === 'no') break;
    }

    this.displayGoodbyeMessage();
  },

};

function createPlayer() {
  return {
    move: null,
    score: STARTING_SCORE,
    history: [],

    addMoveToHistory(move) {
      this.history.push(move);
    },

  };
}

function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    name: null,
    choose() {
      let choice;

      while (true) {
        console.log('Choose from: (R)OCK, (P)APER, (SC)ISSORS, (L)IZARD, or (SP)OCK:');
        choice = readline.question().toLowerCase();
        if (VALID_CHOICES.includes(choice)) break;
        console.log('Sorry, invalid choice.');
      }

      this.move = choice in SHORT_INPUTS ? SHORT_INPUTS[choice] : choice;
      this.addMoveToHistory(this.move);
    },
  };

  return Object.assign(playerObject, humanObject);
}

function createComputer() {
  let playerObject = createPlayer();
  let choices = Object.keys(WINNING_COMBOS);

  let computerObject = {
    choose() {
      let randomIndex = Math.floor(Math.random() * choices.length);
      this.move = choices[randomIndex];
      this.addMoveToHistory(this.move);
    },
  };

  return Object.assign(playerObject, computerObject);
}

RPSGame.play();