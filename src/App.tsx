import { useState } from "react";
import "./App.css";

function App() {
  const TIC_TAC_TOE = [Array(3).fill(""), Array(3).fill(""), Array(3).fill("")];
  const [grid, setGrid] = useState(TIC_TAC_TOE);
  const [isPlayerX, setIsPlayerX] = useState(true);
  const [gameIsOver, setGameIsOver] = useState(false);
  const [winner, setWinner] = useState("");

  // These states are used if the game has to continue until has 3 aligned symbols
  // More info in the functions of playerXMove and playerOMove
  const [playerXMoves, setPlayerXMoves] = useState<number[][]>([]);
  const [playerOMoves, setPlayerOMoves] = useState<number[][]>([]);

  // Handles game state change with every click
  const handleOnClick = (outerIndex: number, innerIndex: number): void => {
    if (!gameIsOver) {
      // check that the cliked box is empty
      if (grid[innerIndex][outerIndex] !== "") return;

      // Handle the moves from each player
      if (isPlayerX) {
        playerXMove(innerIndex, outerIndex);
      } else {
        playerOMove(innerIndex, outerIndex);
      }

      // Check if have a winner
      const haveWinner = haveAWinner(grid);
      // Check if grid is full
      const gridIsFull = grid.flat().filter((box) => box == "");

      if (haveWinner || gridIsFull.length == 0) {
        setGameIsOver(true);

        // Check game is draw
        if (!haveWinner && gridIsFull) {
          setWinner("The game is a draw!");
          return;
        }
        // else check who won
        const winner = `The winner is Player ${isPlayerX ? "X" : "O"}`;
        setWinner(winner);
      }
    }
  };

  const updateGrid = (
    grid: string[][],
    innerIndex: number,
    outerIndex: number,
    removeAMove: boolean = false,
    moveToDelete: number[] = []
  ) => {
    const updatedGrid = [...grid];

    if (removeAMove) {
      updatedGrid[moveToDelete[0]][moveToDelete[1]] = "";
    }
    updatedGrid[innerIndex][outerIndex] = isPlayerX ? "X" : "O";

    // Update state of player
    setIsPlayerX((currentPlayer) => !currentPlayer);
    // Save new grid state
    setGrid(updatedGrid);
  };

  const playerXMove = (innerIndex: number, outerIndex: number) => {
    const updatedMoves = [...playerXMoves];

    // Set length == 3 to continue the game until someone has won
    // This will allow the player to replace the last placed move
    if (updatedMoves.length == 99) {
      const moveToDelete = updatedMoves.shift();
      updateGrid(grid, innerIndex, outerIndex, true, moveToDelete);
      updatedMoves.push([innerIndex, outerIndex]);
      setPlayerXMoves(updatedMoves);
    } else {
      updateGrid(grid, innerIndex, outerIndex);
      updatedMoves.push([innerIndex, outerIndex]);
      setPlayerXMoves(updatedMoves);
    }
  };

  const playerOMove = (innerIndex: number, outerIndex: number) => {
    const updatedMoves = [...playerOMoves];

    // Set length == 3 to continue the game until someone has won
    // This will allow the player to replace the last placed move
    if (updatedMoves.length == 99) {
      const moveToDelete = updatedMoves.shift();
      updateGrid(grid, innerIndex, outerIndex, true, moveToDelete);
      updatedMoves.push([innerIndex, outerIndex]);
      setPlayerOMoves(updatedMoves);
    } else {
      updateGrid(grid, innerIndex, outerIndex);
      updatedMoves.push([innerIndex, outerIndex]);
      setPlayerOMoves(updatedMoves);
    }
  };

  function haveAWinner(array: string[][]): boolean {
    for (let i = 0; i < array[0].length; i++) {
      // Check each row horizontally
      if (array[i].every((value) => value == array[i][0] && value !== "")) {
        return true;
      }

      // Check each column vertically
      let column = array.map((row) => row[i]);
      if (column.every((value) => value == column[0] && value !== "")) {
        return true;
      }
    }

    // Check for diagonal rows with the same value
    let diagonal1 = array.map((row, i) => row[i]);
    if (diagonal1.every((value) => value == diagonal1[0] && value !== "")) {
      return true;
    }
    let diagonal2 = array.map((row, i) => row[row.length - 1 - i]);
    if (diagonal2.every((value) => value === diagonal2[0] && value !== "")) {
      return true;
    }

    return false;
  }

  const handleResetGame = () => {
    setIsPlayerX(true);
    setPlayerXMoves([]);
    setPlayerOMoves([]);
    setGameIsOver(false);
    setGrid(TIC_TAC_TOE);
    setWinner("");
  };

  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>
      <div className="winner-text">{winner && <p>{winner}</p>}</div>
      <div className="grid-container">
        {grid.map((x, outerIndex) => (
          <div key={outerIndex}>
            {x.map((y, innerIndex) => (
              <div className="grid-box" key={innerIndex} onClick={() => handleOnClick(outerIndex, innerIndex)}>
                {/* {innerIndex} */}
                {/* {outerIndex} */}
                {grid[innerIndex][outerIndex]}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="action">
        <button onClick={handleResetGame}>Reset Game</button>
      </div>
    </div>
  );
}

export default App;
