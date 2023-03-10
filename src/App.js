import React from 'react';
import { useState } from 'react';

// Each 3x3 subBoard is mapped to its winning combinations, using the indices of the bigger board.
const subBoardWinningCombinations = [
        [[0, 1, 2], [9, 10, 11], [18, 19, 20], [0, 9, 18], [1, 10, 19], [2, 11, 20], [0, 10, 20], [2, 10, 18]],
        [[3, 4, 5], [12, 13, 14], [21, 22, 23], [3, 12, 21], [4, 13, 22], [5, 14, 23], [3, 13, 23], [5, 13, 21]],
        [[6, 7, 8], [15, 16, 17], [24, 25, 26], [6, 15, 24], [7, 16, 25], [8, 17, 26], [6, 16, 26], [8, 16, 24]],
        [[27, 28, 29], [36, 37, 38], [45, 46, 47], [27, 36, 45], [28, 37, 46], [29, 38, 47], [27, 37, 47], [29, 37, 45]],
        [[30, 31, 32], [39, 40, 41], [48, 49, 50], [30, 39, 48], [31, 40, 49], [32, 41, 50], [30, 40, 50], [32, 40, 48]],
        [[33, 34, 35], [42, 43, 44], [51, 52, 53], [33, 42, 51], [34, 43, 52], [35, 44, 53], [33, 43, 53], [35, 43, 51]],
        [[54, 55, 56], [63, 64, 65], [72, 73, 74], [54, 63, 72], [55, 64, 73], [56, 65, 74], [54, 64, 74], [56, 64, 72]],
        [[57, 58, 59], [66, 67, 68], [75, 76, 77], [57, 66, 75], [58, 67, 76], [59, 68, 77], [57, 67, 77], [59, 67, 75]],
        [[60, 61, 62], [69, 70, 71], [78, 79, 80], [60, 69, 78], [61, 70, 79], [62, 71, 80], [60, 70, 80], [62, 70, 78]]
]

// Standard 3x3 board.
const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
]

// The following array maps each cell index to the corresponding subBoard it determines for the next move.
const moveMap = [0, 1, 2, 0, 1, 2, 0, 1, 2, 3, 4, 5, 3, 4, 5, 3, 4, 5, 6, 7, 8, 6, 7, 8, 6, 7, 8, 0, 1, 2, 0, 1, 2, 0, 1, 2, 3, 4, 5, 3, 4, 5, 3, 4, 5, 6, 7, 8, 6, 7, 8, 6, 7, 8, 0, 1, 2, 0, 1, 2, 0, 1, 2, 3, 4, 5, 3, 4, 5, 3, 4, 5, 6, 7, 8, 6, 7, 8, 6, 7, 8]

// The following array maps each subBoard to the array of cells it contains.
const subBoardCells = [[0, 1, 2, 9, 10, 11, 18, 19, 20], [3, 4, 5, 12, 13, 14, 21, 22, 23], [6, 7, 8, 15, 16, 17, 24, 25, 26], [27, 28, 29, 36, 37, 38, 45, 46, 47], [30, 31, 32, 39, 40, 41, 48, 49, 50], [33, 34, 35, 42, 43, 44, 51, 52, 53], [54, 55, 56, 63, 64, 65, 72, 73, 74], [57, 58, 59, 66, 67, 68, 75, 76, 77], [60, 61, 62, 69, 70, 71, 78, 79, 80]]

// The following array maps each cell to the subBoard which contains it.
const cellToSubBoardMap = [0, 0, 0, 1, 1, 1, 2, 2, 2, 0, 0, 0, 1, 1, 1, 2, 2, 2, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 3, 3, 3, 4, 4, 4, 5, 5, 5, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 6, 6, 6, 7, 7, 7, 8, 8, 8, 6, 6, 6, 7, 7, 7, 8, 8, 8]

function Square({ clickable, xIsNext, value, isGameOver, onSquareClick }) {
        if (!isGameOver) {
                if (clickable) {
                        if (xIsNext) {
                                return <div className="square clickable xNext" onClick={onSquareClick}></div>;
                        } else {
                                return <div className="square clickable circleNext" onClick={onSquareClick}></div>;
                        }
                } else {
                        if (value === "X") {
                                if (xIsNext) {
                                        return <div className="square x xNext" onClick={onSquareClick}></div>;
                                } else {
                                        return <div className="square x circleNext" onClick={onSquareClick}></div>;
                                }
                        }
                        else if (value === "O") {
                                if (xIsNext) {
                                        return <div className="square circle xNext" onClick={onSquareClick}></div>;
                                } else {
                                        return <div className="square circle circleNext" onClick={onSquareClick}></div>;
                                }
                        }
                        else {
                                if (xIsNext) {
                                        return <div className="square xNext" onClick={onSquareClick}></div>;
                                } else {
                                        return <div className="square circleNext" onClick={onSquareClick}></div>;
                                }
                        }
                }
        } else {
                if (value === "X") {
                        return <div className="square x"></div>;
                }
                else if (value === "O") {
                        return <div className="square circle"></div>;
                }
                else {
                        return <div className="square"></div>;
                }
        }
}

function MainBoardSquare({ value, winningSquare }) {
        if (winningSquare) {
                if (value === "X") {
                        return <div className="progressSquare x winningSquare"></div>;
                } else {
                        return <div className="progressSquare circle winningSquare"></div>;
                }
        } else {
                if (value === "X") {
                        return <div className="progressSquare x"></div>;
                } else if (value === "O") {
                        return <div className="progressSquare circle"></div>;
                } else {
                        return <div className="progressSquare"></div>;
                }
        }
}

function MoveButton({ onClick, description }) {
        return <button onClick={onClick}>{description}</button>;
}

function Board({ xIsNext, squares, mainBoardSquares, onPlay, nextSubBoardIndex, winner }) {

        function handleClick(clickableSquare, i) {
                if (clickableSquare) {
                        const nextSquares = JSON.parse(JSON.stringify(squares.slice()));
                        if (xIsNext) {
                                nextSquares[i] = "X";
                        } else {
                                nextSquares[i] = "O";
                        }
                        const nextMainBoardSquares = JSON.parse(JSON.stringify(mainBoardSquares.slice()));
                        // Only check for a subBoard winner if there hasn't already been one.
                        if (!nextMainBoardSquares[cellToSubBoardMap[i]]) {
                                const subBoardWinner = calculateWinner(nextSquares, subBoardWinningCombinations[cellToSubBoardMap[i]])[0];
                                if (subBoardWinner) {
                                        nextMainBoardSquares[cellToSubBoardMap[i]] = subBoardWinner;
                                }
                        }
                        onPlay(nextSquares, nextMainBoardSquares);
                }
        }

        function renderBoard(isGameOver) {
                const board = [];
                for (let i = 0; i < 81; i++) {
                        const squareValue = squares[i];
                        const clickableSquare = (nextSubBoardIndex === -1 || cellToSubBoardMap[i] === nextSubBoardIndex) && !squareValue ? true : false;
                        board.push(<Square key={i} clickable={clickableSquare} xIsNext={xIsNext} value={squareValue} isGameOver={isGameOver} onSquareClick={() => handleClick(clickableSquare, i)} />);
                }
                return board;
        }

        let status;
        if (winner[0]) {
                status = 'Winner: ' + winner[0];
        } else {
                status = 'Next player: ' + (xIsNext ? 'X' : 'O');
        }
        if (mainBoardSquares.every(value => value != null) && !winner[0]) {
                status = "Draw";
        }
        const isGameOver = (status === "Winner: X" || status === "Winner: O") ? true : false;
        console.log(isGameOver);

        return (
                <div className="playBoardContainer">
                        <div className='text'>{status}</div>
                        <div className={xIsNext ? "board xIsNext" : "board circleIsNext"} id="board">
                                {renderBoard(isGameOver)}
                        </div>
                </div>

        );
}

function MainBoard({ mainBoardSquares, winner }) {

        function renderMainBoard(mainBoardSquares, winner) {
                const board = [];
                for (let i = 0; i < 9; i++) {
                        // Check which squares are part of a winning combination, if any.
                        const winningSquare = winner[0] && winner[1].some(j => j === i) ? true : false;
                        board.push(<MainBoardSquare key={i} value={mainBoardSquares[i]} winningSquare={winningSquare} />);
                }
                return board;
        }

        return (
                <div className="progressBoardContainer">
                        <div className='text'>Result</div>
                        <div className="progressBoard">
                                {renderMainBoard(mainBoardSquares, winner)}
                        </div>
                </div>
        );
}

export default function Game() {

        function handlePlay(nextSquares, nextMainBoardSquares) {
                const nextHistory = JSON.parse(JSON.stringify(history.slice(0, currentMove + 1)));
                nextHistory.push(nextSquares);
                setHistory(nextHistory);
                const nextMainBoardHistory = JSON.parse(JSON.stringify(mainBoardHistory.slice(0, currentMove + 1)));
                nextMainBoardHistory.push(nextMainBoardSquares);
                setMainBoardHistory(nextMainBoardHistory);
                setCurrentMove(nextHistory.length - 1);
        }

        function jumpTo(nextMove) {
                setCurrentMove(nextMove);
        }

        function changeMovesOrder() {
                setMovesIsAscending(!movesIsAscending);
        }

        function resetGame() {
                setHistory([Array(81).fill(null)]);
                setCurrentMove(0);
                setMovesIsAscending(true);
                setMainBoardHistory([Array(9).fill(null)]);
        }

        // Keep track of all moves made during the game so the user can go back to any move and restart the game from there.
        const [history, setHistory] = useState([Array(81).fill(null)]);
        const [currentMove, setCurrentMove] = useState(0);
        const xIsNext = currentMove % 2 === 0;
        const currentSquares = history[currentMove];
        const previousSquares = currentMove > 0 ? history[currentMove - 1] : currentSquares;
        let nextSubBoardIndex = -1;
        if (currentMove > 0) {
                for (let i = 0; i < 81; i++) {
                        // Find location of the latest move and see if the nextSubBoard it determines is full.
                        if (currentSquares[i] != null && previousSquares[i] === null) {
                                const nextSubBoard = moveMap[i];
                                const nextSubBoardCells = subBoardCells[nextSubBoard];
                                !nextSubBoardCells.some(j => currentSquares[j] === null) ? nextSubBoardIndex = -1 : nextSubBoardIndex = nextSubBoard;
                        }
                }
        }
        // Find location of all moves in the history and set appropriate description for each one, to show the user.
        const moves = history.map((squares, move) => {
                let description;
                let currMoveLocation = [null, null];
                if (move > 0) {
                        const prevMove = history[move - 1];
                        for (let i = 0; i < 81; i++) {
                                if (squares[i] != null && prevMove[i] === null) {
                                        currMoveLocation = [Math.floor(i / 9) + 1, (i % 9) + 1];
                                }
                        }
                        description = "Go to move #" + move + " (row " + currMoveLocation[0] + ", col " + currMoveLocation[1] + ")"
                } else {
                        description = 'Go to game start';
                        currMoveLocation = [null, null];
                }

                return (
                        <MoveButton description={description} onClick={() => jumpTo(move)} />
                );
        });
        const [movesIsAscending, setMovesIsAscending] = useState(true);
        const [mainBoardHistory, setMainBoardHistory] = useState([Array(9).fill(null)]);
        const currentMainBoardSquares = mainBoardHistory[currentMove];
        const winner = calculateWinner(currentMainBoardSquares, winningCombinations);

        return (
                <div className="game">
                        <div className="gameInfo">
                                <div className="moveHistory" >
                                        {movesIsAscending ? moves : moves.reverse()}
                                </div>
                                <button onClick={() => changeMovesOrder()}>{movesIsAscending ? "Descending" : "Ascending"}</button>
                        </div>
                        <Board xIsNext={xIsNext} winner={winner} squares={currentSquares} mainBoardSquares={currentMainBoardSquares} onPlay={handlePlay} nextSubBoardIndex={nextSubBoardIndex} />
                        <MainBoard mainBoardSquares={currentMainBoardSquares} winner={winner} />
                        <button className="reset" onClick={resetGame}>
                                Reset
                        </button>
                </div>
        );
}

function calculateWinner(squares, winningLines) {
        for (let i = 0; i < winningLines.length; i++) {
                const [a, b, c] = winningLines[i];
                if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                        return [squares[a], winningLines[i]];
                }
        }
        return [null, null];
}
