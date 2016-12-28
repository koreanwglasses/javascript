var Vector2 = function(x, y) {
    this.x = x;
    this.y = y;
}

var Rectangle = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

Rectangle.prototype.translate = function(x, y) {
    if(x instanceof Vector2) {
        y = Vector2.y;
        x = Vector2.x;
    }
    this.x += x;
    this.y += y;
}

Rectangle.prototype.scale = function(x, y) {
    if(x instanceof Vector2) {
        y = Vector2.y;
        x = Vector2.x;
    }
    this.width *= x;
    this.height *= y;
}