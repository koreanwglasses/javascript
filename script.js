Backtrack = function () {

}

Backtrack.Solve = function(initial, getNext, check) {
    var solution = initial.slice(0);
    var tree = [solution];
    while(true) {
        while(tree[tree.length - 1].length === 0) { 
            tree.pop();
            solution.pop();
        }

        var next = tree[tree.length - 1].pop();           
        solution.push(next);

        if(check(solution)) {
            return solution;
        } else {
            tree.push(getNext(solution));
        }
    }
}

n = 30;

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function getNext(solution) {
    var occupiedCols = [];
    var occupiedDiagDown = [];
    var occupiedDiagUp = [];

    for(i = 0; i < solution.length; i++) {
        var point = solution[i];

        var col = point.x;
        var diagDown = point.x - point.y;
        var diagUp = point.x + point.y;

        occupiedCols.push(col);
        occupiedDiagDown.push(diagDown);
        occupiedDiagUp.push(diagUp);
    }

    var y = solution[solution.length - 1].y + 1;

    var next = [];
    for(x = 0; x < n; x++) {
        var col = x;
        var diagDown = x - y;
        var diagUp = x + y;

        if(occupiedCols.indexOf(col) === -1 && occupiedDiagDown.indexOf(diagDown) === -1 && occupiedDiagUp.indexOf(diagUp) === -1)
            next.push(new Point(x, y));
    }
    return next;
}

function check(solution) {
    return solution.length === n;
}

var solution = Backtrack.Solve([new Point(0,0)], getNext, check);
var output = '';
for(i = 0; i < solution.length; i++) {
    output += '. '.repeat(solution[i].x) + 'Q\n';
}
console.log(output);