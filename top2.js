import solvePuzzle from "./bottomTowSteps.js";
import { puzzleState, movePiece, goalState } from "./index.js";
class PuzzleNode {
    constructor(xAxios, yAxios, target, parent) {
        this.xAxios = xAxios;
        this.yAxios = yAxios;
        this.position = [yAxios, xAxios];
        this.parent = parent;
        this.targetNode = target;
        this.state = 'float';
        this.cost = this.calcCost();
    }
    calcCost() {
        // 计算曼哈顿距离
        return Math.abs(this.yAxios - this.targetNode[0]) + Math.abs(this.xAxios - this.targetNode[1]);
    }
}

class SearchA {
    constructor(initialState, goalState) {
        this.initialState = initialState;
        this.goalState = goalState;
        this.m = this.goalState.length;
        this.n = this.goalState[0].length;
        this.proityQueue = new Array();
        this.bottomlinePath = [
            [-1, 0], [0, 1], [1, 0], [0, 1], [-1, 0], [0, -1], [0, -1], [1, 0]
        ];
    }
    findTarget(target, state) {
        for (let i = 0; i < this.m; i++) {
            for (let j = 0; j < this.n; j++) {
                if (target == state[i][j] || target == state[i][j].value) {
                    return [i, j];
                }
            }
        }
    }
    getNeighbors(parent, target) {
        let x = [0, 0, 1, -1];
        let y = [-1, 1, 0, 0];
        let neighborList = new Array();
        for (let i = 0; i < x.length; i++) {
            let xAxios = x[i] + parent.xAxios;
            let yAxios = y[i] + parent.yAxios;
            neighborList.push([yAxios, xAxios]);
        }
        let m = this.m;
        let n = this.n;
        let initialState = this.initialState;
        let validneighborList = isValid(neighborList);
        function isValid(neighborList) {
            return neighborList.filter(([yAxios, xAxios]) => {
                if (0 <= yAxios && yAxios < m &&
                    xAxios >= 0 && xAxios < n
                    && initialState[yAxios][xAxios].nodeStatus == 'float'
                ) {
                    return [yAxios, xAxios];

                }
            })
        }
        function generateNodeList(target, validneighborList, parent) {
            let list = new Array();
            for (let i = 0; i < validneighborList.length; i++) {
                const element = validneighborList[i];
                let neighborNode = new PuzzleNode(element[1], element[0], target, parent)
                list.push(neighborNode)
            }
            return list;
        };
        return generateNodeList(target, validneighborList, parent);

    }
    async run() {
        let m = this.m;
        let endpoint = m * m - m * 2;
        for (let i = 1; i <= endpoint; i++) {

            if (i % m == 0) {
                const currentPosition = this.findTarget(i, this.initialState);
                this.initialState[currentPosition[0]][currentPosition[1]].nodeStatus = 'block';
                const targetNode = this.findTarget(i, this.goalState);
                if (JSON.stringify(currentPosition) === JSON.stringify(targetNode)) {
                    this.initialState[currentPosition[0]][currentPosition[1]].nodeStatus = 'block';
                    continue;
                }
                let beforeNode = [targetNode[0] + 1, targetNode[1] - 1];
                // let targetPath = [currentPosition, beforeNode];
                let targetPath = this.astar(currentPosition, beforeNode);

                await this.actionMove(targetPath);
                await this.ZeroPathMove([targetNode[0] + 1, targetNode[1] - 2])
                await this.lastOneMove([targetNode[0] + 1, targetNode[1] - 2]);
            } else {
                const currentPosition = this.findTarget(i, this.initialState);
                this.initialState[currentPosition[0]][currentPosition[1]].nodeStatus = 'block';
                const targetNode = this.findTarget(i, this.goalState);
                if (JSON.stringify(currentPosition) === JSON.stringify(targetNode)) {
                    this.initialState[currentPosition[0]][currentPosition[1]].nodeStatus = 'block';
                    continue;
                }
                let targetPath = this.astar(currentPosition, targetNode);
                await   this.actionMove(targetPath);
            }
        }
        let initialState = this.initialState.map(arr => arr.map(obj => obj.value)).slice(-2);
        let goalState = this.goalState.slice(-2);
        let solutionBottomTwo = solvePuzzle(initialState, goalState);
        await   this.moveBottomTowLine(solutionBottomTwo)
    };
    async   moveBottomTowLine(solutionBottomTwo) {
        for (let i = 0; i < solutionBottomTwo.length; i++) {
            const { row, col } = solutionBottomTwo[i];
            const currentPosition = this.findTarget(0, this.initialState);
            let nextRow = row + currentPosition[0];
            let nextCol = col + currentPosition[1];
            [this.initialState[currentPosition[0]][currentPosition[1]], this.initialState[nextRow][nextCol]] =
                [this.initialState[nextRow][nextCol], this.initialState[currentPosition[0]][currentPosition[1]]];

                await   movePiece(nextRow, nextCol);
        }

    }

  async  lastOneMove(originZero) {
        var nextStep;
        for (let i = 0; i < this.bottomlinePath.length; i++) {
            const element = this.bottomlinePath[i];
            nextStep = [element[0] + originZero[0], element[1] + originZero[1]];

         await   movePiece(nextStep[0], nextStep[1]);
            [this.initialState[originZero[0]][originZero[1]], this.initialState[nextStep[0]][nextStep[1]]] = [this.initialState[nextStep[0]][nextStep[1]], this.initialState[originZero[0]][originZero[1]]];
            originZero = nextStep;
        }
    }
    async   actionMove(targetPath) {
        for (let i = 0; i < targetPath.length - 1; i++) {
            await  this.ZeroPathMove(targetPath[i + 1]);
            const targetPosition = targetPath[i];
            const zeroPosition = targetPath[i + 1];
            await  movePiece(targetPosition[0], targetPosition[1]);
            [
                this.initialState[zeroPosition[0]][zeroPosition[1]], this.initialState[targetPosition[0]][targetPosition[1]]
            ] = [
                    this.initialState[targetPosition[0]][targetPosition[1]], this.initialState[zeroPosition[0]][zeroPosition[1]]
                ]
        }
    }


    async  ZeroPathMove(targetPath) {
        const zerotarget = targetPath;
        const initPosition = this.findTarget(0, this.initialState);
        let zeroPath = this.astar(initPosition, zerotarget);
        for (let index = 0; index < zeroPath.length - 1; index++) {
            const zeroPosition = zeroPath[index];
            const numPosition = zeroPath[index + 1];
            await    movePiece(numPosition[0], numPosition[1]);
            [this.initialState[zeroPosition[0]][zeroPosition[1]], this.initialState[numPosition[0]][numPosition[1]]] = [this.initialState[numPosition[0]][numPosition[1]], this.initialState[zeroPosition[0]][zeroPosition[1]]]
        }
    }
    astar(initPosition, targetNode) {

        let closeSet = new Set();
        let openSet = new Array();
        let initNode = new PuzzleNode(initPosition[1], initPosition[0], targetNode, null);
        openSet = [...this.getNeighbors(initNode, targetNode), ...openSet];
        while (openSet.length > 0) {
            openSet.sort((a, b) => a.cost - b.cost);
            let currentNode = openSet.shift();

            if (JSON.stringify(currentNode.position) == JSON.stringify(targetNode)) {
                let path = [];
                let node = currentNode;
                while (node) {
                    path.unshift(node.position);
                    node = node.parent;
                }
                return path;
            }

            const key = JSON.stringify(currentNode.position);
            if (!closeSet.has(key)) {
                closeSet.add(key);
                openSet = [...this.getNeighbors(currentNode, targetNode), ...openSet];

            }
        }
        return null;
    }
}


class Node {
    constructor(value, position) {
        // this.position = position;
        this.nodeStatus = 'float';
        this.value = value
    }
}

function formaPuzzle(state) {
    return state.map((arr, i) => arr.map((v, j) => new Node(v, [i, j])));
}
// formaPuzzle(initialState);



async function buttonStart() {
    let sA = new SearchA(formaPuzzle(puzzleState), goalState);

    await sA.run();
}
document.getElementById("start-button").addEventListener('click', () => buttonStart());

