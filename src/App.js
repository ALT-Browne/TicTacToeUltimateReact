import React from 'react';
import { useState } from 'react';

function Square({ clickable, value, onSquareClick }) {
        return (
                clickable ? <button className="clickable-square" onClick={onSquareClick}>{value}</button> : <button className="square" onClick={onSquareClick}>{value}</button>
        );
}

function MainBoardSquare({ value, winningSquare, onSquareClick }) {
        return <button className={winningSquare ? "winning-square" : "square"} onClick={onSquareClick}>{value}</button>;
}

function MoveButton({ onClick, description, currMoveLocation }) {
        return currMoveLocation[0] === null && currMoveLocation[1] === null && currMoveLocation[2] === null ? <button onClick={onClick}>{description}</button> : <button onClick={onClick}>{description + " (sub-board " + currMoveLocation[0] + ", row " + currMoveLocation[1] + ", col " + currMoveLocation[2] + ")"}</button>;
}

function SubBoard({ xIsNext, squares, onPlay, subBoardKey, nextSubBoard }) {

        function handleClick(i) {
                if (nextSubBoard === -1 || nextSubBoard === subBoardKey) {
                        if (squares[subBoardKey][0][i]) {
                                return;
                        }
                        const nextSquares = JSON.parse(JSON.stringify(squares.slice()));
                        if (xIsNext) {
                                nextSquares[subBoardKey][0][i] = "X";
                        } else {
                                nextSquares[subBoardKey][0][i] = "O";
                        }

                        if (!nextSquares[subBoardKey][1]) {
                                nextSquares[subBoardKey][1] = calculateWinner(nextSquares[subBoardKey][0])[0];
                        }

                        let isNextSubBoardFull = true;
                        for (let j = 0; j < 9; j++) {
                                if (squares[i][0][j] === null) {
                                        isNextSubBoardFull = false;
                                }
                        }
                        if (isNextSubBoardFull) {
                                onPlay(nextSquares, -1);
                        } else {
                                onPlay(nextSquares, i);
                        }
                }
        }

        function renderSubBoard() {
                const board = [];
                for (let i = 0; i < 3; i++) {
                        let row = [];
                        for (let j = 0; j < 3; j++) {
                                row.push(<Square key={i * 3 + j} clickable={(nextSubBoard === -1 || nextSubBoard === subBoardKey) && !squares[subBoardKey][0][i * 3 + j] ? true : false} value={squares[subBoardKey][0][i * 3 + j]} onSquareClick={() => handleClick(i * 3 + j)} />);
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
                        let row = [];
                        for (let j = 0; j < 3; j++) {
                                row.push(<SubBoard key={i * 3 + j} subBoardKey={i * 3 + j} nextSubBoard={nextSubBoard} onPlay={onPlay} squares={squares} xIsNext={xIsNext} />);
                        }
                        board.push(
                                <div key={i} className="sub-board-row">
                                        {row}
                                </div>
                        )
                }
                return board;
        }

        return (
                <div>
                        {renderBoard()}
                </div>
        );
}

function MainBoard({ xIsNext, squares }) {

        function renderMainBoard(winner) {
                const board = [];
                for (let i = 0; i < 3; i++) {
                        let row = [];
                        for (let j = 0; j < 3; j++) {
                                row.push(<MainBoardSquare key={i * 3 + j} value={squares[i * 3 + j][1]} winningSquare={winner[0] && winner[1].some(arrIndex => Math.floor(arrIndex / 3) === i && arrIndex % 3 === j) ? true : false} />);
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
                        {renderMainBoard(winner)}
                </div>
        );
}

export default function Game() {

        function handlePlay(nextSquares, nextSubBoard) {
                let nextHistory = JSON.parse(JSON.stringify(history.slice(0, currentMove + 1)));
                nextHistory.push(nextSquares);

                setHistory(nextHistory);
                setCurrentMove(nextHistory.length - 1);
                //setNextSubBoard(nextSubBoard);
        }

        function jumpTo(nextMove) {
                setCurrentMove(nextMove);
        }

        function changeMovesOrder() {
                setMovesIsAscending(!movesIsAscending);
        }

        const [history, setHistory] = useState([Array(9).fill([Array(9).fill(null), null])]);//the second element of the inner array contains the symbol that has won that subBoard. Null initially...
        const [currentMove, setCurrentMove] = useState(0);
        const xIsNext = currentMove % 2 === 0;
        //const [nextSubBoard, setNextSubBoard] = useState(-1);
        const currentSquares = history[currentMove];

        const previousSquares = currentMove > 0 ? history[currentMove - 1] : currentSquares;
        let nextSubBoard = -1;
        if (currentMove > 0) {
                for (let i = 0; i < 9; i++) {
                        for (let j = 0; j < 9; j++) {
                                if (currentSquares[i][0][j] != null && previousSquares[i][0][j] === null) {
                                        nextSubBoard = j;
                                }
                        }
                }
                let isNextSubBoardFull = true;
                for (let j = 0; j < 9; j++) {
                        if (currentSquares[nextSubBoard][0][j] === null) {
                                isNextSubBoardFull = false;
                        }
                }
                if (isNextSubBoardFull) {
                        nextSubBoard = -1;
                }
        } else {
                nextSubBoard = -1;
        }


        const moves = history.map((squares, move) => {
                let description;
                let prevMove;
                let currMoveLocation = [null, null, null];
                if (move > 0) {
                        description = 'Go to move #' + move;
                        prevMove = history[move - 1];
                        for (let i = 0; i < 9; i++) {
                                for (let j = 0; j < 9; j++) {
                                        if (squares[i][0][j] != null && prevMove[i][0][j] === null) {
                                                currMoveLocation = [i + 1, Math.floor(j / 3) + 1, (j % 3) + 1];
                                        }
                                }
                        }
                } else {
                        description = 'Go to game start';
                        currMoveLocation = [null, null, null];
                }

                return (
                        <div>
                                <MoveButton description={description} currMoveLocation={currMoveLocation} onClick={() => jumpTo(move)} />
                        </div>

                );
        });
        console.log(moves);
        console.log(history);
        console.log(nextSubBoard);
        const [movesIsAscending, setMovesIsAscending] = useState(true);

        return (
                <div className="game">
                        <div className="game-board">
                                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} nextSubBoard={nextSubBoard} />
                        </div>
                        <div className="game-info">
                                <div className="block" >
                                        {movesIsAscending ? moves : moves.reverse()}
                                </div>
                                <div className="block">
                                        <button onClick={() => changeMovesOrder()}>{movesIsAscending ? "Descending" : "Ascending"}</button>
                                </div>
                        </div>
                        <div className="main-board">
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
