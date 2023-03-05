import React from 'react';
import { useState } from 'react';

function Square({ clickable, value, onSquareClick }) {
        return <button className={clickable ? "clickable-square" : "square"} onClick={onSquareClick}>{value}</button>;
}

function MainBoardSquare({ value, winningSquare, onSquareClick }) {
        return <button className={winningSquare ? "winning-square" : "square"} onClick={onSquareClick}>{value}</button>;
}

function MoveButton({ onClick, description }) {
        return <button onClick={onClick}>{description}</button>;
}

function SubBoard({ xIsNext, squares, onPlay, subBoardKey, clickable }) {

        function handleClick(clickableSquare, i) {
                if (clickableSquare) {
                        const nextSquares = JSON.parse(JSON.stringify(squares.slice()));
                        if (xIsNext) {
                                nextSquares[subBoardKey][0][i] = "X";
                        } else {
                                nextSquares[subBoardKey][0][i] = "O";
                        }

                        //Keep the original winner of a subBoard, even if the other player later completes a winning line.
                        if (!nextSquares[subBoardKey][1]) {
                                nextSquares[subBoardKey][1] = calculateWinner(nextSquares[subBoardKey][0])[0];
                        }

                        onPlay(nextSquares);
                }
        }

        function renderSubBoard() {
                const board = [];
                for (let i = 0; i < 3; i++) {
                        const row = [];
                        for (let j = 0; j < 3; j++) {
                                const squareIndex = i * 3 + j;
                                const squareValue = squares[subBoardKey][0][squareIndex];
                                const clickableSquare = clickable && !squareValue ? true : false;
                                row.push(<Square key={squareIndex} clickable={clickableSquare} value={squareValue} onSquareClick={() => handleClick(clickableSquare, squareIndex)} />);
                        }
                        board.push(
                                <div key={i} className="board-row">
                                        {row}
                                </div>
                        )
                }
                return board;
        }

        return (
                <div>
                        {renderSubBoard()}
                </div>
        );
}

function Board({ xIsNext, squares, onPlay, nextSubBoard }) {

        function renderBoard() {
                const board = [];
                for (let i = 0; i < 3; i++) {
                        const row = [];
                        for (let j = 0; j < 3; j++) {
                                const clickableSubBoard = nextSubBoard === -1 || nextSubBoard === (i * 3 + j) ? true : false;
                                row.push(<SubBoard key={i * 3 + j} subBoardKey={i * 3 + j} clickable={clickableSubBoard} onPlay={onPlay} squares={squares} xIsNext={xIsNext} />);
                        }
                        board.push(
                                <div key={i} className="sub-board-row">
                                        {row}
                                </div>
                        )
                }
                return board;
        }

        const mainBoardSquares = squares.map((subBoard, index) => {
                return subBoard[1];
        });
        const winner = calculateWinner(mainBoardSquares);
        let status;
        if (winner[0]) {
                status = 'Winner: ' + winner[0];
        } else {
                status = 'Next player: ' + (xIsNext ? 'X' : 'O');
        }
        if (mainBoardSquares.every(value => value != null) && !winner[0]) {
                status = "Draw"
        }

        return (
                <div className="desc-board">
                        <div className='text'>{status}</div>
                        <div>
                                {renderBoard()}
                        </div>
                </div>
        );
}

function MainBoard({ xIsNext, squares }) {

        function renderMainBoard(mainBoardSquares, winner) {
                const board = [];
                for (let i = 0; i < 3; i++) {
                        const row = [];
                        for (let j = 0; j < 3; j++) {
                                const winningSquare = winner[0] && winner[1].some(arrIndex => Math.floor(arrIndex / 3) === i && arrIndex % 3 === j) ? true : false;
                                row.push(<MainBoardSquare key={i * 3 + j} value={mainBoardSquares[i * 3 + j]} winningSquare={winningSquare} />);
                        }
                        board.push(
                                <div key={i} className="board-row">
                                        {row}
                                </div>
                        )
                }
                return board;
        }

        const mainBoardSquares = squares.map((subBoard, index) => {
                return subBoard[1];
        });
        const winner = calculateWinner(mainBoardSquares);
        // let status;
        // if (winner[0]) {
        //         status = 'Winner: ' + winner[0];
        // } else {
        //         status = 'Next player: ' + (xIsNext ? 'X' : 'O');
        // }
        // if (mainBoardSquares.every(value => value != null) && !winner[0]) {
        //         status = "Draw"
        // }

        return (
                <div className="desc-board">
                        <div className='text'>Result</div>
                        <div>
                                {renderMainBoard(mainBoardSquares, winner)}
                        </div>
                </div>
        );
}

export default function Game() {

        function handlePlay(nextSquares) {
                const nextHistory = JSON.parse(JSON.stringify(history.slice(0, currentMove + 1)));
                nextHistory.push(nextSquares);
                setHistory(nextHistory);
                setCurrentMove(nextHistory.length - 1);
        }

        function jumpTo(nextMove) {
                setCurrentMove(nextMove);
        }

        function changeMovesOrder() {
                setMovesIsAscending(!movesIsAscending);
        }

        const [history, setHistory] = useState([Array(9).fill([Array(9).fill(null), null])]);// The second element of the inner array of length 2 contains the symbol that has won that subBoard. Null initially...
        const [currentMove, setCurrentMove] = useState(0);
        const xIsNext = currentMove % 2 === 0;
        const currentSquares = history[currentMove];

        const previousSquares = currentMove > 0 ? history[currentMove - 1] : currentSquares;
        let nextSubBoard = -1;
        if (currentMove > 0) {
                for (let i = 0; i < 9; i++) {
                        for (let j = 0; j < 9; j++) {
                                // Find location of the latest move and see if the nextSubBoard it determines is full
                                if (currentSquares[i][0][j] != null && previousSquares[i][0][j] === null) {
                                        !currentSquares[j][0].some(value => value === null) ? nextSubBoard = -1 : nextSubBoard = j;
                                }
                        }
                }
        }

        const moves = history.map((squares, move) => {
                let description;
                let currMoveLocation = [null, null, null];
                if (move > 0) {
                        const prevMove = history[move - 1];
                        for (let i = 0; i < 9; i++) {
                                for (let j = 0; j < 9; j++) {
                                        if (squares[i][0][j] != null && prevMove[i][0][j] === null) {
                                                currMoveLocation = [i + 1, Math.floor(j / 3) + 1, (j % 3) + 1];
                                        }
                                }
                        }
                        description = "Go to move #" + move + " (sub-board " + currMoveLocation[0] + ", row " + currMoveLocation[1] + ", col " + currMoveLocation[2] + ")"
                } else {
                        description = 'Go to game start';
                        currMoveLocation = [null, null, null];
                }

                return (
                        <div>
                                <MoveButton description={description} onClick={() => jumpTo(move)} />
                        </div>

                );
        });

        const [movesIsAscending, setMovesIsAscending] = useState(true);

        return (
                <div className="game">
                        <div className="playBoard-gameInfo">
                                <div className="playBoard">
                                        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} nextSubBoard={nextSubBoard} />
                                </div>
                                <div className="gameInfo">
                                        <div className="block" >
                                                {movesIsAscending ? moves : moves.reverse()}
                                        </div>
                                        <div className="block">
                                                <button onClick={() => changeMovesOrder()}>{movesIsAscending ? "Descending" : "Ascending"}</button>
                                        </div>
                                </div>
                        </div>
                        <div className="mainBoard">
                                <MainBoard xIsNext={xIsNext} squares={currentSquares} />
                        </div>
                </div>
        );
}

function calculateWinner(squares) {
        const lines = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
                const [a, b, c] = lines[i];
                if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                        return [squares[a], lines[i]];
                }
        }
        return [null, null];
}
