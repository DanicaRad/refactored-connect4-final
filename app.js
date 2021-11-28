/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

 class Game {
    constructor(width, height, botPlayer, ...colors) {
      // creates an array of players
      this.players = !botPlayer ? [...colors] : [botPlayer, ...colors];
      console.log('this.player', this.players);
      this.currPlayer = !botPlayer ? this.players[0] : this.players[1];
      this.botPlayer = botPlayer; 
      this.width = width;
      this.height = height;
      this.makeBoard();
      this.makeHtmlBoard();
    }
    
    makeRandomColor() {
      return '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    }
  
    changePlayers(player) {
      let playerIdx = this.players.indexOf(this.currPlayer);
      if(!this.botPlayer) {
        console.log('no bot');
        if(playerIdx === this.players.length -1) {
          console.log('back to first player');
          return this.players[0];
        }
        console.log('next player');
        return this.players[playerIdx + 1];
      }
      if(player === this.botPlayer) {
        console.log('bot just played');
        return this.players[1];
      }
      return this.botPlayer;
    }
  
    changePlayers(player) {
      let playerIdx = this.players.indexOf(this.currPlayer);
      if(playerIdx === this.players.length -1) {
        console.log('back to first player');
        return this.players[0];
      }
        console.log('next player');
        return this.players[playerIdx + 1];
    }
  
    makeBoard() {
      this.board = [];
      for(let i = 0; i < this.height; i++) {
        this.board.push(Array.from({length : this.width}));
      }
    }
  
    makeHtmlBoard() {
      const form = document.getElementById('game-form');
      form.innerHTML = '';
        const htmlBoard = document.getElementById('board');
  
        const top = document.createElement("tr");
        top.setAttribute("id", "column-top");
        this.handleGameClick = this.handleClick.bind(this);
        top.addEventListener("click", this.handleGameClick);
        
        for (let x = 0; x < this.width; x++) {
           const headCell = document.createElement("td");
           headCell.setAttribute("id", x);
           top.append(headCell);
         }
        htmlBoard.append(top);
  
        for (let y = 0; y < this.height; y++) {
          const row = document.createElement('tr');
        
          for (let x = 0; x < this.width; x++) {
            const cell = document.createElement('td');
            cell.setAttribute('id', `${y}-${x}`);
            row.append(cell);
          }
          htmlBoard.append(row);
        }
    }
  
    findSpotForCol(x) {
        for(let y = this.height - 1; y >= 0; y --) {
             if(!this.board[y][x]) {
               return y;
             }
          }
           return null;
    }
  
      placeInTable(y, x) {
        const piece = document.createElement('div');
        piece.classList.add('played-piece');
        piece.style.backgroundColor = this.currPlayer.color;
        const square = document.getElementById(`${y}-${x}`);
        square.append(piece);
        console.log('piece from placeInTable', piece);
        setTimeout(() => piece.classList.add('piece'), 100)
      }
  
      endGame(msg) {
        alert(msg);
        location.reload();
    }
  
    handleClick(evt) {
  
      // get x from ID of clicked cell
      let x = parseInt(evt.target.id);
  
      let playerIdx = this.players.indexOf(this.currPlayer);
    
      // get next spot in column (if none, ignore click)
      const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }
    
      // place piece in in-memory board and add to HTML table
      this.board[y][x] = this.currPlayer;
  
      this.placeInTable(y, x);
    
      // check for win
    
      // get DOM elements for event listeners for win
      let cell = document.getElementById(`${y}-${x}`);
      let evtTarget = document.getElementById("column-top");
    
      if (this.checkForWin()) {
        let winner = this.currPlayer.color;
        evtTarget.removeEventListener('click', this.handleGameClick);
        cell.addEventListener('animationend', () => {
          return this.endGame(`The ${winner} player won!`)});
      }
    
      // check for tie
      if (this.board.every(row => row.every(cell => cell))) {
        return this.endGame('It`s a tie!');
      }
  
      // change players
      this.currPlayer = this.changePlayers(this.currPlayer);
      console.log('currPlayer', this.currPlayer);
  
      this.playBot();
  
    }
  
    // checks if it's bot's turn and automates bot click on random column once user play animation is done
    playBot() {
      window.addEventListener('animationend', () => {
        if(this.currPlayer === this.botPlayer) {
          console.log('now bot is playing!');
          let botX = this.botPlayer.pickColForBot(this.width);
          document.getElementById(botX).click();
        }
        return;
      });
    }
  
    checkForWin() {
      // make sure win is on board
      const _win = (cells) => {
        return cells.every(
          ([y, x]) =>
            y >= 0 &&
            y < this.height &&
            x >= 0 &&
            x < this.width &&
            this.board[y][x] === this.currPlayer
        );
      }
  
      // define four legal wins- horizontal, vertical, two diagonals- and check if any are true
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
          const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
          const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
          const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
          //
          if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
            return true;
          }
        }
      }
    }
  }
  
  class Player {
    constructor(color) {
      this.color = color;
    }
  }
  
  class BotPlayer {
    constructor(width) {
      this.color = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    }
  
    pickColForBot(width) {
      return Math.floor(Math.random() * width);
    }
  }
  
  let numOfPlayers = 1;
  
  // add players
  const addPlayer = document.getElementById('add-player');
  
  addPlayer.addEventListener('click', (evt) => {
    evt.preventDefault();
    if(evt.target.id = 'add-player') {
  
      numOfPlayers++;
  
      const newPlayer = document.createElement('input');
      newPlayer.setAttribute('type', 'text');
      newPlayer.id = `color${numOfPlayers}`;
  
      const playerInputs = document.getElementById('players');
      playerInputs.appendChild(newPlayer);
  
      const inputLabel = document.getElementById('form-header');
      inputLabel.innerText = 'Choose player colors and add more players!';
  
    }
  });
  
  // create player objects from user input of player numbers, player colors and board dimensions or defaults
  const play = document.getElementById('play');
  play.addEventListener('click', (evt) => { 
    evt.preventDefault();
    let width = document.getElementById('width').value;
    let height = document.getElementById('height').value;
  
      //for loop to collect player color inputs
      let playerColors = [];
      for(let i = 1; i <= numOfPlayers; i++) {
  
        let color = document.getElementById(`color${i}`);
      
        color.style.backgroundColor = color.value;
        !color.style.backgroundColor ? playerColors.push(new BotPlayer(width, height, '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'))) :
  
        playerColors.push(new Player(color.value));
      }
      // checks if single player and creates new game with bot or multiplayers
      numOfPlayers <= 1 ? new Game(width, height, new BotPlayer(width), ...playerColors) : new Game(width, height, null, ...playerColors);
  })
  