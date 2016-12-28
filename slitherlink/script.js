var data = [
    [3,3,3,3,2,2,2],
    [ ,2,1,2, , , ],
    [2,2,2,3,2,2,2],
    [2, ,3, ,0, ,2],
    [3, ,2, ,2, ,2],
    [1,2,2,1, , , ],
    [ , , , , ,1,1]
];

var board = new Board(8,8,data);

function Board(width, height, data) {
    this.width = width;
    this.height = height;
    this.data = data;
}

Board.prototype.getNumbers = function(vertex) {
    return [
        this.data[vertex.x][vertex.y - 1],
        this.data[vertex.x - 1][vertex.y - 1],
        this.data[vertex.x - 1][vertex.y],
        this.data[vertex.x][vertex.y]
    ];
}

function Vertex(x, y) {
    this.x = x;
    this.y = y;
}

Vertex.prototype.equals = function(vertex, y) {
    if(typeof y === 'undefined') return this.x == vertex.x && this.y == vertex.y;
    else return this.x == vertex && this.y == y;
}

function Path() {
    this.data = [];
}

Path.prototype.append = function(vertex, y) {
    if(typeof y === 'undefined') this.data.push(vertex);
    else this.data.push(new Vertex(vertex, y));
}

Path.prototype.contains = function(vertex, y) {
    if(typeof y !== 'undefined') vertex = new Vertex(vertex,y);
    return typeof this.data.find(vertex.equals) !== 'undefined';
}

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
