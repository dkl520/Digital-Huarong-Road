import MinHeap from "./MinHeap.js";
// import { movePiece } from './index.js';
class PuzzleNode {
    constructor(state, parent, move, cost, goalState, onelineLength) {
        this.state = state;
        this.parent = parent;
        this.move = move;
        this.cost = cost;
        this.goalState = goalState;
        this.onelineLength = onelineLength;
        this.heuristic = this.calculateHeuristic();
    }

    calculateHeuristic() {
        let heuristic = 0;
        for (let i = 0; i < this.state.length; i++) {
            for (let j = 0; j < this.state[i].length; j++) {
                const currentValue = this.state[i][j];
                if (currentValue !== this.goalState[i][j] && currentValue !== 0) {
                    const goalIndex = this.findIndex(this.goalState, currentValue);
                    const distance =
                        Math.abs(i - goalIndex.row) + Math.abs(j - goalIndex.col);
                    heuristic += distance;
                }
            }
        }
        return heuristic;
    }

    findIndex(matrix, value) {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] === value) {
                    return { row: i, col: j };
                }
            }
        }
        return null;
    }

    getPriority() {
        return this.cost + this.heuristic;
    }
}

function solvePuzzle(initialState, goalState) {
    const isValidMove = (position, move, numRows, numCols) => {
        const newPosition = {
            row: position.row + move.row,
            col: position.col + move.col
        };
        return (
            newPosition.row >= 0 &&
            newPosition.row < numRows &&
            newPosition.col >= 0 &&
            newPosition.col < numCols
        );
    };

    const getNeighbors = (node, numRows, numCols) => {
        const neighbors = [];
        const position = node.findIndex(node.state, 0);
        const moves = [{ row: -1, col: 0 }, { row: 1, col: 0 }, { row: 0, col: -1 }, { row: 0, col: 1 }];

        moves.forEach((move) => {
            if (isValidMove(position, move, numRows, numCols)) {
                const newState = JSON.parse(JSON.stringify(node.state)); // Deep copy the state
                [newState[position.row][position.col], newState[position.row + move.row][position.col + move.col]] =
                    [newState[position.row + move.row][position.col + move.col], newState[position.row][position.col]];
                const newNode = new PuzzleNode(newState, node, move, node.cost + 1, goalState);
                neighbors.push(newNode);
            }
        });

        return neighbors;
    };

    const astar = () => {
        const openSet = new MinHeap();
        openSet.push(new PuzzleNode(initialState, null, null, 0, goalState));
        const closedSet = new Set();

        while (!openSet.isEmpty()) {
            const current = openSet.pop();

            if (JSON.stringify(current.state) === JSON.stringify(goalState)) {
                const path = [];
                let currentNode = current;
                while (currentNode.parent !== null) {
                    path.unshift(currentNode.move);
                    currentNode = currentNode.parent;
                }
                return path;
            }

            const key = JSON.stringify(current.state);
            if (!closedSet.has(key)) {
                closedSet.add(key);
                const numRows = current.state.length;
                const numCols = current.state[0].length;

                getNeighbors(current, numRows, numCols).forEach((neighbor) => {
                    const neighborKey = JSON.stringify(neighbor.state);
                    if (!closedSet.has(neighborKey)) {
                        openSet.push(neighbor);
                    }
                });
            }
        }
        return null;
    };

    return astar();
}




export default solvePuzzle;