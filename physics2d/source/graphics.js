var ShapeRenderer = function(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d'); 

    this.viewport = new Rectangle(0, 0, canvas.width, canvas.height);
}

ShapeRenderer.prototype.drawCircle = function(x, y, width, height) {
    
}