;
var Color = function(r,g,b) {
    this.r = r;
    this.g = g;
    this.b = b;
}

Color.random = function() {
    return new Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));
}

Color.fromHex = function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return new Color(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16));
}

Color.prototype.toRgb = function() {
    return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
}

Color.prototype.luma = function() {
    return (0.2126 * this.r + 0.7152 * this.g + 0.0722 * this.b) / 256;
}

var color;
var score = 0;
var n = 0;
function newColor() {
    color = Color.random();

    var uiColor = color.luma() > .7 ? 'black' : 'white';
    $('input').css('border-color', uiColor);
    $('input').css('color', uiColor);
    $("input[type='button']:hover").css('background-color', color.luma() > .7 ? 'rgba(0,0,0,.2)' : 'rgba(255,255,255,.2)');
    $('#color').css('color', uiColor);
    $('#color').css('background-color', color.toRgb());
}

function verify() {
    var guessColor = Color.fromHex($('#guess').val());
    var diffr = Math.abs((guessColor.r - color.r) / 256);
    var diffg = Math.abs((guessColor.g - color.g) / 256);
    var diffb = Math.abs((guessColor.b - color.b) / 256);
    var accuracy = 1 - (diffr + diffg + diffb) / 3;

    score = (score * n + accuracy) / (n + 1);
    n++;

    $('#guessedcolor').css('background-color', guessColor.toRgb());
    $('#accuracy').html((accuracy * 100).toFixed(2));
    $('#score').html((score * 100).toFixed(2));
    $('#n').html(n);
}

function reset() {
    score = 0;
    n = 0;
    
    $('#accuracy').html('');
    $('#score').html(0);
    $('#n').html(n);
}

$(function() {
    $("#guess").keyup(function(event){
        if(event.keyCode == 13){
            $("#submit").click();
        }
    });
    $("#submit").click(verify);
    $('#reset').click(reset);
    $('#next').click(newColor);

    reset();
    newColor();
});