if (typeof window === "undefined") {
  import("./board.js")
    .then((pkg) => {
      Board = pkg.Board;
    })
    .catch((err) => {
      console.error("Failed to load the board module:", err);
    });
}

class Game {
  constructor(w, h, padding, paddingTop, paddingBottom) {
    this.h = h;
    this.w = w;
    this.x = padding;
    this.y = paddingTop;
    this.padding = padding;
    this.paddingTop = paddingTop;
    this.paddingBottom = paddingBottom;

    // Array of puzzles with FEN, correct move, and turn
    this.puzzles = [
      {
        fen: "rnbqkb1r/pppppppp/5n2/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 0 1",
        correctMove: { from: 45, to: 39 }, // Knight move
        whiteToMove: true
      },
      {
        fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
        correctMove: { from: 54, to: 46 }, // Pawn move
        whiteToMove: true
      },
      // {
      //   fen: "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1",
      //   correctMove: { from: "g8", to: "f6" }, // Knight move
      //   whiteToMove: false
      // }
    ];

    this.currentPuzzleIndex = 0;
    this.loadPuzzle();
  }

  loadPuzzle() {
    const puzzle = this.puzzles[this.currentPuzzleIndex];
    this.board = new Board(this.x, this.y, this.w, this.h, puzzle.fen);
    this.color = puzzle.whiteToMove ? Piece.WHITE : Piece.BLACK;
    this.board.data.setLegalMovesFor(this.color);
  }

  draw() {
    this.board.draw();
    let turnText = this.color === Piece.WHITE ? "WHITE's turn" : "BLACK's turn";

    if (this.board.check) {
      turnText += " CHECK";
    }

    const fontSize = this.w > 600 ? 40 : this.w > 400 ? 30 : 20;
    textSize(fontSize);
    fill("white");
    textAlign(CENTER);
    text(turnText, this.x + this.w / 2, this.y - this.paddingTop + this.paddingTop / 2 + (fontSize - 10) / 2);
  }

  clicked(clientY, clientX) {
    const selectedIndex = this.board.data.selectedIndex;

    if (selectedIndex >= 0) {
      const clickedCell = this.board.clickedCell(clientY, clientX);
      const validMove = this.board.getPossibleMoveForTargetIndex(clickedCell.index, selectedIndex);

      if (clickedCell && clickedCell.index !== selectedIndex && validMove) {
        // Check if the move is correct
        if (this.isCorrectMove(validMove)) {
          alert("You're Right! ✅");
          this.nextPuzzle();
        } else {
          alert("Wrong Move! ❌ Try Again.");
        }
      } else {
        this.board.selectCellIndex(NOT_SELECTED);
        this.board.data.setLegalMovesFor(this.color);
      }
    } else {
      const clickedCellForTurn = this.board.clickedCellByColor(clientY, clientX, this.color);
      if (clickedCellForTurn && this.board.hasPossibleMoveForIndex(clickedCellForTurn.index)) {
        this.board.selectCellIndex(clickedCellForTurn.index);
        this.board.data.setLegalMovesFor(this.color);
      }
    }
  }

  isCorrectMove(move) {
    console.log(move)
    const puzzle = this.puzzles[this.currentPuzzleIndex];
    return puzzle.correctMove.from === move.from && puzzle.correctMove.to === move.to;
  }

  nextPuzzle() {
    this.currentPuzzleIndex++;
    if (this.currentPuzzleIndex < this.puzzles.length) {
      this.loadPuzzle();
    } else {
      alert("🎉 You've completed all puzzles!");
    }
  }
}
