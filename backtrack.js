(function (global) {
    global.Backtrack = function () {

    }

    global.Backtrack.Solve = function(initial, getNext, check) {
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
})(this);