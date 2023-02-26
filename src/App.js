import React from 'react';
import { useState } from 'react';

function Square({ value, winningSquare, onSquareClick }) {
        return <button className={winningSquare ? "winning-square" : "square"} onClick={onSquareClick}>{value}</button>;
}

function MoveButton({ onClick, description, currMoveLocation }) {
        return currMoveLocation[0] === null && currMoveLocation[1] === null ? <button onClick={onClick}>{description}</button> : <button onClick={onClick}>{description + " (row " + currMoveLocation[0] + ", col " + currMoveLocation[1] + ")"}</button>;
}

function Board({ xIsNext, squares, onPlay }) {

        function handleClick(i) {
                if (squares[i] || calculateWinner(squares)[0]) {
                        return;
                }
                const nextSquares = squares.slice();
                if (xIsNext) {
                        nextSquares[i] = "X"
                } else {
                        nextSquares[i] = "O"
                }
                onPlay(nextSquares);
        }

        function renderBoard(winner) {
                const board = [];
                for (let i = 0; i < 3; i++) {
                        let row = [];
                        for (let j = 0; j < 3; j++) {
                                row.push(<Square key={i * 3 + j} value={squares[i * 3 + j]} winningSquare={winner[0] && winner[1].some(arrIndex => Math.floor(arrIndex / 3) === i && arrIndex % 3 === j) ? true : false} onSquareClick={() => handleClick(i * 3 + j)} />);
                        }
                        board.push(
                                <div key={i} className="board-row">
                                        {row}
                                </div>
                        )
                }
                return board;
        }

        const winner = calculateWinner(squares);
        let status;
        if (winner[0]) {
                status = 'Winner: ' + winner[0];
        } else {
                status = 'Next player: ' + (xIsNext ? 'X' : 'O');
        }
        if (squares.every(value => value != null) && !winner[0]) {
                status = "Draw"
        }

        return (
                <div>
                        <div className='status'>{status}</div>
                        {renderBoard(winner)}
                </div>
        );
}

export default function Game() {
        function handlePlay(nextSquares) {
                const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
                setHistory(nextHistory);
                setCurrentMove(nextHistory.length - 1);
        }

        function jumpTo(nextMove) {
                setCurrentMove(nextMove);
        }

        function changeMovesOrder() {
                setMovesIsAscending(!movesIsAscending);
        }

        const [history, setHistory] = useState([Array(9).fill(null)]);
        const [currentMove, setCurrentMove] = useState(0);
        const xIsNext = currentMove % 2 === 0;
        const currentSquares = history[currentMove];
        const moves = history.map((squares, move) => {
                let description;
                let prevMove;
                let currMoveLocation = [null, null];
                if (move > 0) {
                        description = 'Go to move #' + move;
                        prevMove = history[move - 1];
                        for (let i = 0; i < squares.length; i++) {
                                if (squares[i] != null && prevMove[i] === null) {
                                        currMoveLocation = [Math.floor(i / 3) + 1, (i % 3) + 1];
                                }
                        }
                } else {
                        description = 'Go to game start';
                        currMoveLocation = [null, null];
                }

                return (
                        <div>
                                <MoveButton description={description} currMoveLocation={currMoveLocation} onClick={() => jumpTo(move)} />
                        </div>

                );
        });
        const [movesIsAscending, setMovesIsAscending] = useState(true);

        return (
                <div className="game">
                        <div className="game-board">
                                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
                        </div>
                        <div className="game-info">
                                <div className="block" >
                                        {movesIsAscending ? moves : moves.reverse()}
                                </div>
                                <div className="block">
                                        <button onClick={() => changeMovesOrder()}>{movesIsAscending ? "Descending" : "Ascending"}</button>
                                </div>
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
